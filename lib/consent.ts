// Cookie consent: stored in a first-party cookie so the server can render
// the right banner state on the first paint (no flash).

export type Consent = {
	analytics: boolean; // GTM (Google Analytics inside the container)
	marketing: boolean; // Meta Pixel, Google Ads
};

export const CONSENT_COOKIE = "cookie_consent";
const MAX_AGE = 60 * 60 * 24 * 180; // 6 months, then ask again

/** null = the visitor has not chosen yet */
export function parseConsent(value: string | undefined): Consent | null {
	const match = value?.match(/^a([01])m([01])$/);
	if (!match) return null;
	return { analytics: match[1] === "1", marketing: match[2] === "1" };
}

export function serializeConsent({ analytics, marketing }: Consent): string {
	return `a${analytics ? 1 : 0}m${marketing ? 1 : 0}`;
}

/** Browser only */
export function writeConsentCookie(consent: Consent) {
	const secure = location.protocol === "https:" ? "; Secure" : "";
	document.cookie = `${CONSENT_COOKIE}=${serializeConsent(consent)}; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax${secure}`;
}

// Cookies the trackers set on our domain; removed when consent is withdrawn
const TRACKER_COOKIE = /^(_ga|_gid|_gat|_gcl_|_fbp|_fbc)/;

/** Browser only */
export function deleteTrackerCookies() {
	const host = location.hostname;
	// Trackers set cookies on the top domain (".frog-energy.com"), so try both
	const domains = ["", `; Domain=${host}`, `; Domain=.${host.split(".").slice(-2).join(".")}`];

	for (const pair of document.cookie.split("; ")) {
		const name = pair.split("=")[0];
		if (!TRACKER_COOKIE.test(name)) continue;
		for (const domain of domains) {
			document.cookie = `${name}=; Path=/; Max-Age=0${domain}`;
		}
	}
}
