import type { Dictionary } from "@/get-dictionary";
import type { Variant } from "./types";

export const buyDict = (t: Dictionary) => ({
	variants: {
		money: t.buyForm.money,
		love: t.buyForm.love,
		luck: t.luck.title,
		soul: t.soul.title,
		dream: t.dream.title,
	} satisfies Record<Variant, string>,
	labels: {
		textN: t.buyForm.textN,
		textPlaceholder: t.buyForm.textPlaceholder,
		limit: t.buyForm.limit,
		left: t.buyForm.left,
		days: t.buyForm.days,
		daysChoose: t.buyForm.daysChoose,
		daysSumm: t.buyForm.daysSumm,
		pickNumber: t.buyForm.pickNumber,
		pickRandomNumber: t.buyForm.pickRandomNumber,
		preferredNumber: t.buyForm.preferredNumber,
		sum: t.buyForm.sum,
		termsPrefix: t.buyForm.termsPrefix,
		termsLink: t.buyForm.termsLink,
		back: t.buyForm.back,
		selectCells: t.buyForm.submit.first,
		bookCells: t.buyForm.submit.second,
		authChoose: t.auth.choose,
		continueToBuy: t.auth.continueToBuy,
	},
	messages: {
		"buyForm.errors.min": t.buyForm.errors.min,
		"buyForm.errors.max": t.buyForm.errors.max,
		"buyForm.errors.maxday": t.buyForm.errors.maxday,
		"buyForm.numberTaken": t.buyForm.numberTaken,
		"buyForm.numberHeld": t.buyForm.numberHeld,
		"buyForm.unknownError": t.buyForm.unknownError,
		"buyForm.noUserId": t.buyForm.noUserId,
		"buyForm.noSelected": t.buyForm.noSelected,
		"buyForm.termsRequired": t.buyForm.termsRequired,
		"buyForm.pickAny": t.buyForm.pickAny,
		error: t.error,
	},
});

export type BuyDict = ReturnType<typeof buyDict>;
export type BuyMessageKey = keyof BuyDict["messages"];

export const translateBuyMessage = (messages: BuyDict["messages"], key?: string) =>
	key ? (messages[key as BuyMessageKey] ?? messages["buyForm.unknownError"]) : undefined;
