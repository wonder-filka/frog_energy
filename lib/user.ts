import "server-only";

import prisma from "@/lib/prisma";

/**
 * Gets the basic settings for a user.
 * @param userId - The user's ID.
 * @returns The user's id, first name and email, or undefined if not found.
 */
export async function getUserBasicSettings(userId: string) {
	try {
		const result = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				firstName: true,
				email: true,
			},
		});
		if (!result) {
			return;
		}
		return result;
	} catch (error) {
		console.error("Error fetching user settings:", error);
		return;
	}
}
