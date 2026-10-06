"use server";

import prisma from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import type { Variant } from "@/lib/types";
import { likeDelegate, slotDelegate } from "@/lib/variant-models";

const VARIANTS: readonly Variant[] = ["money", "love", "luck", "soul", "dream"];

// `likedByMe` is computed for the session user, never for a client-supplied id
export async function getBoardAssignments(variant: Variant) {
	const userId = await getSessionUserId();

	return prisma.$transaction(async (tx) => {
		const now = new Date();

		const items = await slotDelegate(tx, variant).findMany({
			where: {
				deletedAt: null,
				expiresAt: { gte: now },
			},
			select: {
				id: true,
				userId: true,
				personalNum: true,
				userText: true,
				createdAt: true,
				expiresAt: true,
				user: { select: { firstName: true } },
				likes: true,
			},
			orderBy: { personalNum: "asc" },
		});

		return items.map((i) => ({
			id: i.id,
			personalNum: i.personalNum,
			userId: i.userId,
			userName: i.user?.firstName ?? "User",
			userText: i.userText ?? null,
			createdAt: i.createdAt,
			expiresAt: i.expiresAt,
			likes: i.likes.length,
			likedByMe: userId
				? i.likes.some((like) => like.userId === userId)
				: false,
		}));
	});
}

export type ToggleMoneyLikeResult =
	| { ok: true; liked: boolean; likes: number }
	| { ok: false; code: "UNAUTHORIZED" | "BAD_REQUEST" };

// The liking user comes from the session cookie: a userId argument from the
// client could be any user's id
export async function toggleMoneyLike(
	slotId: string,
	variant: Variant
): Promise<ToggleMoneyLikeResult> {
	const userId = await getSessionUserId();
	if (!userId) {
		return { ok: false, code: "UNAUTHORIZED" } as const;
	}
	if (!VARIANTS.includes(variant) || typeof slotId !== "string") {
		return { ok: false, code: "BAD_REQUEST" } as const;
	}

	const { liked, likes } = await prisma.$transaction(async (tx) => {
		const delegate = likeDelegate(tx, variant);

		const existing = await delegate.findUnique({
			where: { userId_slotId: { userId, slotId } },
		});
		if (existing) {
			await delegate.delete({ where: { id: existing.id } });
		} else {
			await delegate.create({ data: { userId, slotId } });
		}

		const count = await delegate.count({ where: { slotId } });
		return { liked: !existing, likes: count };
	});

	return { ok: true, liked, likes } as const;
}
