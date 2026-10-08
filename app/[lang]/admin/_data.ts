import "server-only";

// Admin page data + the admin check shared with ./_actions

import prisma from "@/lib/prisma";
import { checkIsAdmin, getSessionUserId } from "@/lib/session";
import { getUserBasicSettings } from "@/lib/user";
import type { BoardAssignmentItem, Variant } from "@/lib/types";
import { slotDelegate } from "@/lib/variant-models";

const VARIANTS: Variant[] = ["money", "love", "luck", "soul", "dream"];

/** The session user's id if they are an admin (ADMIN_EMAILS), otherwise null. */
export async function getAdminUserId(): Promise<string | null> {
	const userId = await getSessionUserId();
	if (!userId) return null;

	const user = await getUserBasicSettings(userId);
	if (!user || !(await checkIsAdmin(user.email))) return null;

	return userId;
}

async function fetchAndMapSlots(variant: Variant): Promise<BoardAssignmentItem[]> {
	const now = new Date();
	const items = await slotDelegate(prisma, variant).findMany({
		where: {
			expiresAt: { gte: now }, // актуальные на текущий момент
		},
		include: {
			user: { select: { id: true, firstName: true, email: true } },
		},
		orderBy: { personalNum: "asc" },
	});

	return items.map((i) => ({
		personalNum: i.personalNum,
		userId: i.userId,
		userName: i.user?.firstName ?? "User",
		userText: i.userText,
		expiresAt: i.expiresAt,
		createdAt: i.createdAt,
		deletedAt: i.deletedAt,
		deletedReason: i.deletedReason,
		variant,
		userEmail: i.user?.email ?? "",
		itemId: i.id,
	}));
}

export async function getAllBoardAssignmentsAdmin(): Promise<BoardAssignmentItem[]> {
	if (!(await getAdminUserId())) return [];

	const lists = await Promise.all(VARIANTS.map((variant) => fetchAndMapSlots(variant)));
	const combinedList = lists.flat();

	combinedList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

	return combinedList;
}
