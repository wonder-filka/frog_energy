import "server-only";

import prisma from "@/lib/prisma";
import { LoginSchema, RegistrationSchema } from "@/lib/schemas";
import { createSession } from "@/lib/session";
import bcrypt from "bcryptjs";
import { z } from "zod";

type AuthResult = { userId: string } | { message: string };

export async function authenticate(data: z.infer<typeof LoginSchema>): Promise<AuthResult> {
	try {
		const parsed = LoginSchema.safeParse(data);
		if (!parsed.success) {
			return { message: "manualError" };
		}

		const user = await prisma.user.findUnique({
			where: { email: parsed.data.email },
		});
		if (!user) {
			return { message: "incorrectCredentials" };
		}

		const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
		if (!valid) {
			return { message: "incorrectCredentials" };
		}

		await createSession(user.id);
		return { userId: user.id };
	} catch (error) {
		console.error(error);
		return { message: "manualError" };
	}
}

export async function registerUser(data: z.infer<typeof RegistrationSchema>): Promise<AuthResult> {
	try {
		const parsed = RegistrationSchema.safeParse(data);
		if (!parsed.success) {
			return { message: "manualError" };
		}
		const existing = await prisma.user.findUnique({
			where: { email: parsed.data.email },
		});
		if (existing) {
			return { message: "emailExists" };
		}
		const passwordHash = await bcrypt.hash(parsed.data.password, 10);
		const user = await prisma.user.create({
			data: {
				firstName: parsed.data.firstName,
				email: parsed.data.email,
				passwordHash,
			},
		});
		await createSession(user.id);
		return { userId: user.id };
	} catch (error) {
		console.error(error);
		return { message: "manualError" };
	}
}
