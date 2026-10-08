import "server-only";

import prisma from "@/lib/prisma";
import type { SlotHold } from "@/app/generated/prisma/client";
import type { Locale } from "@/i18n-config";
import type { BuyResult, SlotItem, SlotOrder, Variant } from "@/lib/types";
import { sendOrderSuccess } from "@/lib/mail";
import {
	SLOT_KIND_BY_VARIANT,
	VARIANT_BY_SLOT_KIND,
	slotDelegate,
	type PrismaTx,
} from "@/lib/variant-models";

const DAY_MS = 24 * 60 * 60 * 1000;
const HOLD_MINUTES = 10;
const MIN_NUM = 1;
const MAX_NUM = 10_000;

type BuyParams = {
	userId: string;
	order: SlotHold;
	tx: PrismaTx;
};

async function buySlot({ userId, order, tx }: BuyParams): Promise<BuyResult> {
	const now = new Date();
	const expires = new Date(now.getTime() + order.days * DAY_MS);
	const variant = VARIANT_BY_SLOT_KIND[order.variant];
	const row = await slotDelegate(tx, variant).create({
		data: {
			userId,
			personalNum: order.num,
			userText: order.userText,
			createdAt: now,
			deletedAt: null,
			expiresAt: expires,
		},
	});
	return { ...row, variant };
}

async function buySlots(userId: string, holds: SlotHold[], tx: PrismaTx) {
	const created: BuyResult[] = [];
	for (const order of holds) {
		created.push(await buySlot({ userId, order, tx }));
		await tx.slotHold.update({
			where: { id: order.id },
			data: { status: "consumed" },
		});
	}
	return created;
}
export async function completePaidOrder(orderId: string, locale: Locale) {
	const order = await prisma.$transaction(async (tx) => {
		const flipped = await tx.order.updateMany({
			where: { id: orderId, status: { not: "PAID" } },
			data: { status: "PAID" },
		});
		if (flipped.count === 0) return null; // already completed by the other path

		const paid = await tx.order.findUniqueOrThrow({
			where: { id: orderId },
			include: { slotHold: true, user: true },
		});
		await buySlots(paid.userId, paid.slotHold, tx);
		return paid;
	});

	if (!order) return false;

	if (order.user?.email && order.paymentId) {
		const siteUrl = process.env.SITE_URL || "https://frog-energy.com";
		await sendOrderSuccess(
			order.user.email,
			{
				orderId: order.paymentId,
				amountUSD: Number(order.amount),
				items: order.slotHold.map((h) => ({
					variant: h.variant,
					num: h.num ?? null,
					days: h.days ?? 1,
					userText: h.userText ?? null,
					expiresAt: h.expiresAt ?? null,
				})),
				siteUrl: `${siteUrl}/${locale}/home`,
			},
			locale
		);
	}
	return true;
}

async function createHold(
	userId: string,
	slot: SlotItem,
	personalNum: number,
	days: number,
	text: string,
	tx: PrismaTx
) {
	const now = new Date();
	const exp = new Date(now.getTime() + HOLD_MINUTES * 60 * 1000);

	return tx.slotHold.create({
		data: {
			userId,
			num: personalNum,
			variant: SLOT_KIND_BY_VARIANT[slot.variant],
			days: days,
			userText: text,
			status: "active",
			expiresAt: exp,
		},
	});
}

async function checkPreferredNumbers(
	variant: Variant,
	personalNum: number,
	tx: PrismaTx
): Promise<{ taken: true } | { heldUntil: Date } | null> {
	const now = new Date();
	const [slot, hold] = await Promise.all([
		slotDelegate(tx, variant).findFirst({
			where: { personalNum, expiresAt: { gt: now }, deletedAt: null },
			select: { personalNum: true },
		}),
		tx.slotHold.findFirst({
			where: {
				variant: SLOT_KIND_BY_VARIANT[variant],
				num: personalNum,
				expiresAt: { gt: now },
			},
			select: { expiresAt: true },
			orderBy: { expiresAt: "desc" },
		}),
	]);
	if (slot) return { taken: true };
	if (hold) return { heldUntil: hold.expiresAt };
	return null;
}

async function findFirstEnabled(
	variant: Variant,
	tx: PrismaTx
): Promise<number | { message: string }> {
	const now = new Date();
	const [rows, holds] = await Promise.all([
		slotDelegate(tx, variant).findMany({
			select: { personalNum: true },
			where: { deletedAt: null, expiresAt: { gt: now } },
			orderBy: { personalNum: "asc" },
		}),
		tx.slotHold.findMany({
			select: { num: true },
			where: {
				variant: SLOT_KIND_BY_VARIANT[variant],
				expiresAt: { gt: now },
			},
		}),
	]);
	return pickFirstGap(rows, holds);
}

function pickFirstGap(
	rows: { personalNum: number }[],
	holds: { num: number }[]
): number | { message: string } {
	const used = Array.from(
		new Set([...rows.map((r) => r.personalNum), ...holds.map((h) => h.num)])
	)
		.filter((n) => n >= MIN_NUM && n <= MAX_NUM)
		.sort((a, b) => a - b);

	let expect = MIN_NUM;
	for (const n of used) {
		if (n > expect) break;
		if (n === expect) expect++;
		if (expect > MAX_NUM) break;
	}

	if (expect < MIN_NUM || expect > MAX_NUM) {
		return { message: "noFreeNums" };
	}
	return expect;
}

type HoldConflict = { variant: Variant; personalNum: number; message: string; heldUntil?: Date };

export type CreateHoldsResult =
	| SlotHold[]
	| {
			message: string;
			conflicts?: HoldConflict[];
	  };

export async function createHoldsForUser(
	slots: SlotItem[],
	userId: string
): Promise<CreateHoldsResult> {
	try {
		return await prisma.$transaction(async (tx) => {
			const withNumber: SlotOrder[] = slots
				.filter((s): s is SlotItem & { personalNum: number } => s.personalNum != null)
				.map((s) => ({
					variant: s.variant,
					days: s.days,
					text: s.text,
					personalNum: s.personalNum,
				}));

			const withoutNumber: SlotItem[] = slots.filter((s) => s.personalNum == null);

			const conflicts: HoldConflict[] = [];
			const prepared: SlotOrder[] = [];

			for (const s of withNumber) {
				const busy = await checkPreferredNumbers(s.variant, s.personalNum, tx);
				if (busy && "heldUntil" in busy) {
					conflicts.push({
						variant: s.variant,
						personalNum: s.personalNum,
						message: "buyForm.numberHeld",
						heldUntil: busy.heldUntil,
					});
				} else if (busy) {
					conflicts.push({
						variant: s.variant,
						personalNum: s.personalNum,
						message: "buyForm.numberTaken",
					});
				} else {
					prepared.push(s);
				}
			}
			if (conflicts.length > 0) {
				return { message: "buyForm.numberTaken", conflicts };
			}

			for (const s of withoutNumber) {
				const firstEnabled = await findFirstEnabled(s.variant, tx);
				if (typeof firstEnabled !== "number") {
					return { message: firstEnabled.message };
				}
				prepared.push({ ...s, personalNum: firstEnabled });
			}

			const created: SlotHold[] = [];
			for (const s of prepared) {
				created.push(await createHold(userId, s, s.personalNum, s.days, s.text ?? "", tx));
			}
			return created;
		});
	} catch (error) {
		console.error("createHolds error", error);
		return { message: "unknownError" };
	}
}

export async function grantSlot(
	slot: SlotItem,
	userId: string
): Promise<BuyResult | { message: string }> {
	try {
		return await prisma.$transaction(async (tx) => {
			let num: number;
			if (slot.personalNum != null) {
				if (await checkPreferredNumbers(slot.variant, slot.personalNum, tx)) {
					return { message: "Занято" };
				}
				num = slot.personalNum;
			} else {
				const firstEnabled = await findFirstEnabled(slot.variant, tx);
				if (typeof firstEnabled !== "number") {
					return { message: firstEnabled.message };
				}
				num = firstEnabled;
			}

			const hold = await createHold(userId, slot, num, slot.days, slot.text ?? "", tx);
			const bought = await buySlot({ userId, order: hold, tx });
			// temp left this hold "active" for 10 more minutes; it is used now
			await tx.slotHold.update({ where: { id: hold.id }, data: { status: "consumed" } });
			return bought;
		});
	} catch (error) {
		console.error("grantSlot error", error);
		return { message: "unknownError" };
	}
}
