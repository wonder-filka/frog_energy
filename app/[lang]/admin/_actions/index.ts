"use server";

// Every action checks the admin itself: these are public POST endpoints, so
// hiding the buttons from non-admins protects nothing.

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { grantSlot } from "@/lib/orders";
import { AdminDeleteSchema, AdminInfoSchema, SlotItemsSchema } from "@/lib/schemas";
import type { BuyResult, SlotItem, Variant } from "@/lib/types";
import { slotDelegate } from "@/lib/variant-models";
import { getAdminUserId } from "../_data";

// temp revalidated "/admin", which never matches the real /{lang}/admin URL
const refreshAdminPage = () => revalidatePath("/[lang]/admin", "page");

export async function deleteSlot(itemId: string, variant: Variant, reason: string) {
	if (!(await getAdminUserId())) return { message: "forbidden" };

	const parsed = AdminDeleteSchema.safeParse({ itemId, variant, reason });
	if (!parsed.success) {
		return { message: parsed.error.issues[0]?.message ?? "Invalid data" };
	}

	try {
		await slotDelegate(prisma, parsed.data.variant).update({
			where: { id: parsed.data.itemId },
			data: {
				deletedAt: new Date(),
				deletedReason: parsed.data.reason,
			},
		});

		refreshAdminPage();
		return { success: true, message: "Слот успешно удален." };
	} catch (error) {
		console.error("Error deleting slot:", error);
		return { message: "Ошибка базы данных при удалении слота." };
	}
}

// Gives the admin themself a free cell (as temp did: the page passed the admin's own id)
export async function createHoldsAndSlot(slot: SlotItem): Promise<BuyResult | { message: string }> {
	const adminId = await getAdminUserId();
	if (!adminId) return { message: "forbidden" };

	const parsed = SlotItemsSchema.safeParse([slot]);
	if (!parsed.success) return { message: "Invalid data" };

	const result = await grantSlot(parsed.data[0], adminId);
	if (!("message" in result)) refreshAdminPage();
	return result;
}

export async function createInfo(input: {
	nextBroadcast: string;
	prevBroadcast: string;
	weekTopic: string;
}) {
	if (!(await getAdminUserId())) return { message: "forbidden" };

	const parsed = AdminInfoSchema.safeParse(input);
	if (!parsed.success) return { message: "Invalid data" };

	try {
		await prisma.info.create({ data: parsed.data });
		return { ok: true as const };
	} catch (error) {
		console.error("[createInfo]", error);
		return { message: "infoCreateFailed" };
	}
}
