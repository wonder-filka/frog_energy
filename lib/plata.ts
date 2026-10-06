import "server-only";

import crypto from "crypto";

const PLATA_API_BASE_URL = process.env.PLATA_API_BASE_URL;
const PLATA_BY_MONO_TOKEN = process.env.PLATA_BY_MONO_TOKEN;

let cachedPubKeyPem: string | null = null;

async function fetchPubKeyPem(): Promise<string | null> {
	if (!PLATA_API_BASE_URL || !PLATA_BY_MONO_TOKEN) return null;

	const res = await fetch(`${PLATA_API_BASE_URL}/api/merchant/pubkey`, {
		headers: { "X-Token": PLATA_BY_MONO_TOKEN },
		cache: "no-store",
	});
	if (!res.ok) return null;

	const data = (await res.json()) as { key: string };
	return Buffer.from(data.key, "base64").toString("utf-8");
}

async function getPubKeyPem(forceRefresh = false): Promise<string | null> {
	if (!cachedPubKeyPem || forceRefresh) {
		cachedPubKeyPem = await fetchPubKeyPem();
	}
	return cachedPubKeyPem;
}

function verifyWithKey(pem: string, rawBody: string, signatureB64: string): boolean {
	try {
		const signature = Buffer.from(signatureB64, "base64");
		return crypto.createVerify("SHA256").update(rawBody).verify(pem, signature);
	} catch {
		return false;
	}
}

export async function verifyPlataWebhookSignature(
	rawBody: string,
	signatureB64: string | null
): Promise<boolean> {
	if (!signatureB64) return false;

	const pem = await getPubKeyPem();
	if (!pem) return false;

	if (verifyWithKey(pem, rawBody, signatureB64)) return true;

	const freshPem = await getPubKeyPem(true);
	if (!freshPem) return false;

	return verifyWithKey(freshPem, rawBody, signatureB64);
}
