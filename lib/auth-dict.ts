import type { Dictionary } from "@/get-dictionary";

// The slice of the dictionary that auth forms (Client Components) need,
// so pages pass only these strings instead of the whole dictionary
export const authDict = (t: Dictionary) => ({
	labels: {
		email: t.email,
		firstName: t.firstName.label,
		firstNameHelp: t.firstName.help,
		password: t.password.label,
		confirmPassword: t.confirmPassword,
		newPassword: t.newPassword,
		login: t.login,
		register: t.register,
		forgotPass: t.forgotPass,
		enterCode: t.enterCode,
		sendCode: t.sendCode,
		back: t.back,
		savePassword: t.savePassword,
		passwordChangedSuccess: t.passwordChangedSuccess,
		hide: t.hide,
		show: t.show,
	},
	// Keyed by the message keys used in lib/schemas.ts and the auth actions
	messages: {
		minFirstName: t.minFirstName,
		invalidEmail: t.invalidEmail,
		shortPassword: t.shortPassword,
		longPassword: t.longPassword,
		"password.needUpper": t.password.needUpper,
		"password.needLower": t.password.needLower,
		"password.needDigit": t.password.needDigit,
		passwordMismatch: t.passwordMismatch,
		incorrectCredentials: t.incorrectCredentials,
		manualError: t.manualError,
		emailExists: t.emailExists,
		signupFailed: t.signupFailed,
		emailNotFound: t.emailNotFound,
		rateLimited: t.rateLimited,
		emailSendFailed: t.emailSendFailed,
		invalidCode: t.invalidCode,
		error: t.error,
	},
});

export type AuthDict = ReturnType<typeof authDict>;
export type AuthMessageKey = keyof AuthDict["messages"];

export const translateMessage = (messages: AuthDict["messages"], key?: string) =>
	key ? (messages[key as AuthMessageKey] ?? messages.error) : undefined;
