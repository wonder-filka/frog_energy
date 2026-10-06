"use server";

import prisma from "@/lib/prisma";
import { RegistrationSchema } from "@/lib/schemas";
import { createSession } from "@/lib/session";
import { hasLocale } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import { redirect } from "next/navigation";
import { z } from "zod";
import bcrypt from "bcryptjs";

export async function signup(data: z.infer<typeof RegistrationSchema>, locale: Locale) {
	try {
		const parsed = RegistrationSchema.safeParse(data);
		if (!parsed.success) {
			throw new Error("Invalid form data");
		}
		const existing = await prisma.user.findFirst({
			where: {
				OR: [{ email: parsed.data.email }],
			},
		});
		if (existing?.email === parsed.data.email) {
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
		console.log("created user", user);
		if (!user) {
			return { message: "signupFailed" };
		}
		await createSession(user.id);
	} catch (error) {
		console.error(error);
		return { message: "Error db" };
	}

	// Outside try/catch: redirect() works by throwing
	redirect(`/${hasLocale(locale) ? locale : "en"}/buy`);
}
