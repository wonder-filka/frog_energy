import type { Dictionary } from "@/get-dictionary";
import type { Variant } from "@/lib/types";

export const boardDict = (t: Dictionary, variant: Variant) => ({
	title: t.sidebar[`${variant}Title`],
	description: t.dashboard.description,
	newCell: t.dialog.newCell.title,
	search: t.dashboard.search,
	noResult: t.dashboard.noresult,
	like: t.like,
	unlike: t.unlike,
	authRequired: t.auth.required,
	likeNeedsLogin: t.auth.likeNeedsLogin,
	login: t.login,
	register: t.register,
});

export type BoardDict = ReturnType<typeof boardDict>;
