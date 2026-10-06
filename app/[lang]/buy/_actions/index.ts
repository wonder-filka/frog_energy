"use server";

import { authenticate, registerUser } from "@/lib/auth";
import { createHoldsForUser, type CreateHoldsResult } from "@/lib/orders";
import { LoginSchema, RegistrationSchema, SlotItemsSchema } from "@/lib/schemas";
import { getSessionUserId } from "@/lib/session";
import type { SlotItem } from "@/lib/types";
import { z } from "zod";

export async function createHolds(slots: SlotItem[]): Promise<CreateHoldsResult> {
	const userId = await getSessionUserId();
	if (!userId) {
		return { message: "buyForm.noUserId" };
	}
	const parsed = SlotItemsSchema.safeParse(slots);
	if (!parsed.success) {
		return { message: "buyForm.unknownError" };
	}
	return createHoldsForUser(parsed.data, userId);
}

export async function loginInline(data: z.infer<typeof LoginSchema>) {
	return authenticate(data);
}

export async function signupInline(data: z.infer<typeof RegistrationSchema>) {
	return registerUser(data);
}
