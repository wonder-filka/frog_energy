"use server";

import { registerUser } from "@/lib/auth";
import { RegistrationSchema } from "@/lib/schemas";
import { hasLocale } from "@/i18n-config";
import type { Locale } from "@/i18n-config";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function signup(data: z.infer<typeof RegistrationSchema>, locale: Locale) {
	const result = await registerUser(data);
	if ("message" in result) {
		return result;
	}

	// redirect() works by throwing, so it stays outside the auth helper's try/catch
	redirect(`/${hasLocale(locale) ? locale : "en"}/buy`);
}
