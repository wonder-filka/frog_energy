import "server-only";

import { JWTPayload, SignJWT, jwtVerify } from "jose";

import { cookies } from "next/headers";

function getEncodedKey() {
	const secretKey = process.env.SESSION_SECRET;
	if (!secretKey) {
		throw new Error("SESSION_SECRET is not set (add it to .env)");
	}
	return new TextEncoder().encode(secretKey);
}

export async function encrypt(payload: JWTPayload) {
	return new SignJWT(payload)
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("7d")
		.sign(getEncodedKey());
}

export async function decrypt(session: string | undefined = "") {
	try {
		const { payload } = await jwtVerify(session, getEncodedKey(), {
			algorithms: ["HS256"],
		});
		return payload;
	} catch {
		return null;
	}
}

export async function createSession(userId: string) {
	const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
	const session = await encrypt({ userId, expiresAt });
	const cookieStore = await cookies();

	cookieStore.set("session", session, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		expires: expiresAt,
		sameSite: "lax",
		path: "/",
	});
}

export async function updateSession() {
	const session = (await cookies()).get("session")?.value;
	const payload = await decrypt(session);

	if (!session || !payload) {
		return null;
	}

	const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

	const cookieStore = await cookies();
	cookieStore.set("session", session, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		expires: expires,
		sameSite: "lax",
		path: "/",
	});
}

export async function deleteSession() {
	const cookieStore = await cookies();
	cookieStore.delete("session");
}

export async function getSessionUserId(): Promise<string | null> {
	const session = (await cookies()).get("session")?.value
	if (!session) return null

	const payload = await decrypt(session)
	if (!payload || typeof payload.userId !== "string") return null

	return payload.userId
}

const ADMIN_EMAILS = new Set(
    (process.env.ADMIN_EMAILS || "")
        .split(/[,\s;]+/) // Разбивайте по нескольким разделителям
        .map((s) => s.trim().toLowerCase()) // Очистка и нижний регистр
        .filter(Boolean)
);

export async function checkIsAdmin(email: string) {
    return ADMIN_EMAILS.has(email.toLowerCase());
}
