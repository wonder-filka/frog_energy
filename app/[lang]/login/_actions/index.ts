"use server";

import { authenticate } from "@/lib/auth";
import { LoginSchema } from "@/lib/schemas";
import { hasLocale } from "@/i18n-config";
import type { Locale } from "@/i18n-config";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function login(data: z.infer<typeof LoginSchema>, locale: Locale) {
	const result = await authenticate(data);
	if ("message" in result) {
		return result;
	}

	// redirect() works by throwing, so it stays outside the auth helper's try/catch
	redirect(`/${hasLocale(locale) ? locale : "en"}/money`);
}
