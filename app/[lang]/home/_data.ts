import "server-only";

// Data for the /home page (called from its Server Component only)

import prisma from "@/lib/prisma";
import { PopularCell, Variant } from "@/lib/types";
import { slotDelegate } from "@/lib/variant-models";

const VARIANTS: Variant[] = ["money", "love", "luck", "soul", "dream"];

export async function getTopLikedActiveSlots(
	userId?: string | null
): Promise<PopularCell[]> {
	return prisma.$transaction(async (tx) => {
		const now = new Date();
		const where = { deletedAt: null, expiresAt: { gte: now } };

		// Базовый select + счётчик лайков
		const baseSelect = {
			id: true,
			userId: true,
			personalNum: true,
			userText: true,
			createdAt: true,
			expiresAt: true,
			user: { select: { firstName: true } },
			_count: { select: { likes: true } }, // количество лайков
		} as const;

		const selectWithLiked = userId
			? ({
					...baseSelect,
					likes: {
						where: { userId },
						select: { id: true },
						take: 1,
					},
			  } as const)
			: baseSelect;

		const orderBy = [
			{ likes: { _count: "desc" as const } },
			{ createdAt: "desc" as const },
			{ personalNum: "asc" as const },
		];

		// локальный маппер -> Assignment & { variant }
		const map = (
			rows: {
				personalNum: number;
				user: {
					firstName: string;
				};
				id: string;
				createdAt: Date;
				userId: string;
				expiresAt: Date;
				userText: string | null;
				_count: {
					likes: number;
				};
				// Present only when userId is set: this user's like, if any
				likes?: { id: string }[];
			}[],
			variant: Variant
		): PopularCell[] =>
			rows.map((i) => ({
				id: i.id,
				userId: i.userId,
				personalNum: i.personalNum,
				userText: i.userText ?? null,
				createdAt: i.createdAt,
				expiresAt: i.expiresAt,
				userName: i.user?.firstName ?? "User",
				likes: i._count?.likes ?? 0,
				likedByMe: Boolean(userId && i.likes && i.likes.length > 0),
				variant,
			}));

		// выкидываем нули (если меньше 10 останется — так и надо)
		const nonZero = <T extends { _count?: { likes?: number } }>(arr: T[]) =>
			arr.filter((r) => (r._count?.likes ?? 0) > 0);

		// тянем по всем доскам параллельно
		const lists = await Promise.all(
			VARIANTS.map(async (variant) => {
				const rows = await slotDelegate(tx, variant).findMany({
					where,
					select: selectWithLiked,
					orderBy,
					take: 10,
				});
				return map(nonZero(rows), variant);
			})
		);

		return lists.flat();
	});
}

export async function getUserCellsSeparated(variant: Variant, userId: string) {
	const now = new Date();
	try {
		const delegate = slotDelegate(prisma, variant);
		const select = {
			id: true,
			userId: true,
			personalNum: true,
			userText: true,
			createdAt: true,
			expiresAt: true,
			likes: true,
			updatedAt: true,
			deletedAt: true,
		} as const;

		const [activeItems, expiredItems] = await Promise.all([
			delegate.findMany({
				where: { userId, expiresAt: { gt: now } },
				select,
				orderBy: { expiresAt: "asc" },
			}),
			delegate.findMany({
				where: { userId, expiresAt: { lte: now } },
				select,
				orderBy: { expiresAt: "asc" },
			}),
		]);

		return { active: activeItems, expired: expiredItems };
	} catch (error) {
		console.error(`Error fetching ${variant} cells:`, error);
		return { active: [], expired: [] };
	}
}

export async function getLatestInfo() {
	try {
		const row = await prisma.info.findFirst({
			orderBy: { createdAt: "desc" },
		});
		if (!row) return null;
		return row;
	} catch (error) {
		console.error("[getLatestInfo]", error);
		return null;
	}
}
