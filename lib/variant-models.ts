import { SlotKind, type Prisma } from "@/app/generated/prisma/client";
import type { Variant } from "./types";

export type PrismaTx = Prisma.TransactionClient;

export const SLOT_KIND_BY_VARIANT: Record<Variant, SlotKind> = {
	money: SlotKind.MONEY,
	love: SlotKind.LOVE,
	luck: SlotKind.LUCK,
	soul: SlotKind.SOUL,
	dream: SlotKind.DREAM,
};

export const VARIANT_BY_SLOT_KIND: Record<SlotKind, Variant> = {
	MONEY: "money",
	LOVE: "love",
	LUCK: "luck",
	SOUL: "soul",
	DREAM: "dream",
};

const SLOT_MODEL_KEY = {
	money: "moneySlots",
	love: "loveSlots",
	luck: "luckSlots",
	soul: "soulSlots",
	dream: "dreamSlots",
} as const satisfies Record<Variant, keyof PrismaTx>;

const LIKE_MODEL_KEY = {
	money: "moneyLike",
	love: "loveLike",
	luck: "luckLike",
	soul: "soulLike",
	dream: "dreamLike",
} as const satisfies Record<Variant, keyof PrismaTx>;


export function slotDelegate(tx: PrismaTx, variant: Variant) {
	return tx[SLOT_MODEL_KEY[variant]] as unknown as PrismaTx["moneySlots"];
}

export function likeDelegate(tx: PrismaTx, variant: Variant) {
	return tx[LIKE_MODEL_KEY[variant]] as unknown as PrismaTx["moneyLike"];
}
