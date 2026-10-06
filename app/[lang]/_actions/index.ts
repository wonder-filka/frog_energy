"use server";

import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { deleteSession, getSessionUserId } from "@/lib/session";
import type { Variant } from "@/lib/types";
import { likeDelegate } from "@/lib/variant-models";

const VARIANTS: readonly Variant[] = ["money", "love", "luck", "soul", "dream"];

export type ToggleLikeResult =
	| { ok: true; liked: boolean; likes: number }
	| { ok: false; code: "UNAUTHORIZED" | "BAD_REQUEST" };

export async function toggleLike(
	slotId: string,
	variant: Variant
): Promise<ToggleLikeResult> {
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

export async function logout(redirectTo: string) {
	await deleteSession();
	redirect(redirectTo.startsWith("/") && !redirectTo.startsWith("//") ? redirectTo : "/");
}
