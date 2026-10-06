import "server-only";

import prisma from "@/lib/prisma";
import type { Variant } from "@/lib/types";
import { slotDelegate } from "@/lib/variant-models";

export async function getSlotById(slotId: string, variant: Variant) {
	try {
		return await slotDelegate(prisma, variant).findUnique({
			where: { id: slotId },
		});
	} catch (error) {
		console.error("Error fetching slot by ID:", error);
		return null;
	}
}
