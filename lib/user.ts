import "server-only";

// Read-only user lookups for Server Components. Not a "use server" module:
// as Server Actions these would return any user's name/email to any caller.

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

export async function getUserNameAndEnergy(userId: string) {
	try {
		const result = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				firstName: true,
				energy: true,
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
