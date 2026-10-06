"use server";

import prisma from "@/lib/prisma";
import { LoginSchema } from "@/lib/schemas";
import { createSession } from "@/lib/session";
import { hasLocale } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function login(data: z.infer<typeof LoginSchema>, locale: Locale) {
	try {
		const parsed = LoginSchema.safeParse(data);
		if (!parsed.success) {
			return { message: "Invalid form data" };
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
	} catch (error) {
		console.error(error);
		return { message: "Error db" };
	}

	// Outside try/catch: redirect() works by throwing
	redirect(`/${hasLocale(locale) ? locale : "en"}/money`);
}
