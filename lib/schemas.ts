import { z } from "zod";

export const RegistrationSchema = z
	.object({
		firstName: z.string().min(2, { error: "minFirstName" }),
		email: z.email({ error: "invalidEmail" }),
		password: z
			.string()
			.min(8, { error: "shortPassword" })
			// по желанию: добавить правила сложности
			.regex(/[A-Z]/, { error: "password.needUpper" })
			.regex(/[a-z]/, { error: "password.needLower" })
			.regex(/[0-9]/, { error: "password.needDigit" }),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ["confirmPassword"],
		error: "passwordMismatch",
	});

export const LoginSchema = z.object({
	email: z.email({ error: "invalidEmail" }),
	password: z.string().min(8, { error: "shortPassword" }),
});

export const ForgotSchema = z.object({
	email: z.email({ error: "invalidEmail" }),
});

export const NewPasswordSchema = z
	.object({
		password: z
			.string()
			.min(8, { error: "shortPassword" })
			.max(128, { error: "longPassword" }),
		confirm: z.string(),
	})
	.refine((data) => data.password === data.confirm, {
		error: "passwordMismatch",
		path: ["confirm"],
	});

export const MAX_LEN = 160;
export const MAX_DAYS = 365;
export const PN_MAX = 10000;

export const BuySlotVariantSchema = z.object({
	isMoney: z.boolean().default(false),
	isLove: z.boolean().default(false),
	isLuck: z.boolean().default(false),
	isSoul: z.boolean().default(false),
	isDream: z.boolean().default(false),
});

export type BuySlotVariantFormInput = z.input<typeof BuySlotVariantSchema>;
export type BuySlotVariantFormOutput = z.output<typeof BuySlotVariantSchema>;

const BuySlotSectionSchema = z
	.object({
		days: z.coerce
			.number()
			.int()
			.min(1, { error: "buyForm.errors.min" })
			.max(MAX_DAYS, { error: "buyForm.errors.maxday" })
			.default(1),
		text: z.string().max(MAX_LEN).optional(),
		pn: z.coerce
			.number()
			.int()
			.min(1, { error: "buyForm.errors.min" })
			.max(PN_MAX, { error: "buyForm.errors.max" })
			.optional(),
	})
	.optional();

export const BuySlotSchema = z.object({
	tm: BuySlotSectionSchema,
	tl: BuySlotSectionSchema,
	tlk: BuySlotSectionSchema,
	ts: BuySlotSectionSchema,
	td: BuySlotSectionSchema,
});

export type BuySlotFormInput = z.input<typeof BuySlotSchema>;
export type BuySlotFormOutput = z.output<typeof BuySlotSchema>;
export type BuySlotFormKey = keyof BuySlotFormOutput;

export const SlotItemsSchema = z
	.array(
		z.object({
			variant: z.enum(["money", "love", "luck", "soul", "dream"]),
			days: z.number().int().min(1).max(MAX_DAYS),
			text: z.string().max(MAX_LEN).optional(),
			personalNum: z.number().int().min(1).max(PN_MAX).optional(),
		})
	)
	.min(1)
	.max(5)
	.refine((items) => new Set(items.map((i) => i.variant)).size === items.length, {
		error: "duplicateVariant",
	});

export const SettingsNameSchema = z.object({
	firstName: z.string().min(2, { error: "minFirstName" }),
});

export const SettingsEmailSchema = z.object({
	email: z.email({ error: "invalidEmail" }),
});


export const ChangePasswordSchema = z.object({
	currentPassword: z.string().min(1, { error: "shortPassword" }),
	newPassword: z.string().min(8, { error: "shortPassword" }).max(128, { error: "longPassword" }),
});

export const AdminDeleteSchema = z.object({
	itemId: z.string().min(1),
	variant: z.enum(["money", "love", "luck", "soul", "dream"]),
	reason: z.string().trim().min(5, { error: "Reason must be at least 5 characters long." }).max(500),
});

export const AdminInfoSchema = z.object({
	nextBroadcast: z.string().trim().max(500),
	prevBroadcast: z.string().trim().max(500),
	weekTopic: z.string().trim().max(2000),
});
