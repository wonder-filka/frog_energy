import { z } from "zod";

// Error messages are keys of `formMessages` in lib/auth-dict.ts, translated when rendered

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
