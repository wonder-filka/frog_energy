"use server";

import prisma from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { ChangePasswordSchema, SettingsEmailSchema, SettingsNameSchema } from "@/lib/schemas";
import bcrypt from "bcryptjs";
import { z } from "zod";

type SettingsResult = { ok: true } | { ok: false; message: string };

export async function updateUserName(data: z.infer<typeof SettingsNameSchema>): Promise<SettingsResult> {
	const userId = await getSessionUserId();
	if (!userId) return { ok: false, message: "updateFailed" };

	const parsed = SettingsNameSchema.safeParse(data);
	if (!parsed.success) return { ok: false, message: "updateFailed" };

	try {
		await prisma.user.update({
			where: { id: userId },
			data: { firstName: parsed.data.firstName },
		});
		return { ok: true };
	} catch (error) {
		console.error("Error updating user settings Name:", error);
		return { ok: false, message: "updateFailed" };
	}
}

export async function updateUserEmail(data: z.infer<typeof SettingsEmailSchema>): Promise<SettingsResult> {
	const userId = await getSessionUserId();
	if (!userId) return { ok: false, message: "updateFailed" };

	const parsed = SettingsEmailSchema.safeParse(data);
	if (!parsed.success) return { ok: false, message: "invalidEmail" };

	try {
		const existing = await prisma.user.findUnique({
			where: { email: parsed.data.email },
			select: { id: true },
		});
		if (existing) {
			return existing.id === userId ? { ok: true } : { ok: false, message: "emailExists" };
		}
		await prisma.user.update({
			where: { id: userId },
			data: { email: parsed.data.email },
		});
		return { ok: true };
	} catch (error) {
		console.error("Error updating user settings Email:", error);
		return { ok: false, message: "updateFailed" };
	}
}

export async function changeUserPassword(data: z.infer<typeof ChangePasswordSchema>): Promise<SettingsResult> {
	const userId = await getSessionUserId();
	if (!userId) return { ok: false, message: "passwordChangeFailed" };

	const parsed = ChangePasswordSchema.safeParse(data);
	if (!parsed.success) return { ok: false, message: "passwordChangeFailed" };

	try {
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { passwordHash: true },
		});
		if (!user?.passwordHash) return { ok: false, message: "passwordChangeFailed" };

		const isMatch = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash)
		if (!isMatch) return { ok: false, message: "currentPasswordIncorrect" };

		const hashedPassword = await bcrypt.hash(parsed.data.newPassword, 10);
		await prisma.user.update({
			where: { id: userId },
			data: { passwordHash: hashedPassword },
		});
		return { ok: true };
	} catch (error) {
		console.error("Error changing user password:", error);
		return { ok: false, message: "passwordChangeFailed" };
	}
}
