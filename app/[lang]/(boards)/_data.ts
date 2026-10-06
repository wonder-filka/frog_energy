import "server-only";

import prisma from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import type { Variant } from "@/lib/types";
import { slotDelegate } from "@/lib/variant-models";

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
