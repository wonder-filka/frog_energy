import type { Dictionary } from "@/get-dictionary";

export const settingsDict = (t: Dictionary) => ({
	labels: {
		basicSettings: t.basicSettings,
		firstName: t.firstName.label,
		email: t.email,
		save: t.save,
		changePasswordTitle: t.changePasswordTitle,
		currentPassword: t.currentPassword,
		newPassword: t.newPassword,
		updatePassword: t.updatePassword,
		hide: t.hide,
		show: t.show,
	},
	toasts: {
		updated: t.basicSettingsUpdated,
		updateFailed: t.updateFailed,
		passwordUpdated: t.passwordUpdated,
		changePasswordFailed: t.changePasswordFailed,
	},
	messages: {
		minFirstName: t.minFirstName,
		invalidEmail: t.invalidEmail,
		emailExists: t.emailExists,
		shortPassword: t.shortPassword,
		longPassword: t.longPassword,
		currentPasswordIncorrect: t.currentPasswordIncorrect,
		updateFailed: t.updateFailed,
	},
});

export type SettingsDict = ReturnType<typeof settingsDict>;

export const translateSettingsMessage = (messages: SettingsDict["messages"], key?: string) =>
	key ? (messages[key as keyof SettingsDict["messages"]] ?? messages.updateFailed) : undefined;
