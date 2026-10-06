import type { Variant } from "@/lib/types";

// Full class names so Tailwind generates them (it can't see `border-${color}-400`)
export const VARIANT_COLORS: Record<
	Variant,
	{ toggleOn: string; toggleOff: string; border: string; focus: string }
> = {
	money: {
		toggleOn: "bg-amber-400 text-black border-amber-400",
		toggleOff: "border-amber-400 text-amber-400",
		border: "border-amber-400",
		focus: "focus-visible:border-amber-400",
	},
	love: {
		toggleOn: "bg-rose-400 text-black border-rose-400",
		toggleOff: "border-rose-400 text-rose-400",
		border: "border-rose-400",
		focus: "focus-visible:border-rose-400",
	},
	luck: {
		toggleOn: "bg-emerald-400 text-black border-emerald-400",
		toggleOff: "border-emerald-400 text-emerald-400",
		border: "border-emerald-400",
		focus: "focus-visible:border-emerald-400",
	},
	soul: {
		toggleOn: "bg-sky-400 text-black border-sky-400",
		toggleOff: "border-sky-400 text-sky-400",
		border: "border-sky-400",
		focus: "focus-visible:border-sky-400",
	},
	dream: {
		toggleOn: "bg-violet-400 text-black border-violet-400",
		toggleOff: "border-violet-400 text-violet-400",
		border: "border-violet-400",
		focus: "focus-visible:border-violet-400",
	},
};

export const VARIANTS: Variant[] = ["money", "love", "luck", "soul", "dream"];
