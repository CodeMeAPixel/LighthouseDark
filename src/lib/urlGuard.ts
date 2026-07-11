import dns from "node:dns/promises";
import { isIP } from "node:net";

const BLOCKED_HOSTNAMES = new Set(["localhost", "localhost.localdomain"]);
const MAX_REDIRECTS = 5;

function isPrivateIPv4(ip: string): boolean {
	const parts = ip.split(".").map(Number);
	if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return true;
	const [a, b] = parts;
	if (a === 0) return true; // 0.0.0.0/8 ("this" network)
	if (a === 10) return true; // 10.0.0.0/8
	if (a === 127) return true; // loopback
	if (a === 169 && b === 254) return true; // link-local, incl. cloud metadata (169.254.169.254)
	if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
	if (a === 192 && b === 168) return true; // 192.168.0.0/16
	if (a === 100 && b >= 64 && b <= 127) return true; // 100.64.0.0/10 (CGNAT)
	if (a >= 224) return true; // multicast (224.0.0.0/4) + reserved (240.0.0.0/4)
	return false;
}

function isPrivateIPv6(ip: string): boolean {
	const normalized = ip.toLowerCase();
	if (normalized === "::1" || normalized === "::") return true;
	if (normalized.startsWith("fe80:")) return true; // link-local
	if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true; // unique local fc00::/7
	if (normalized.startsWith("::ffff:")) {
		return isPrivateIPv4(normalized.slice("::ffff:".length));
	}
	return false;
}

export function isPrivateIP(ip: string): boolean {
	const version = isIP(ip);
	if (version === 4) return isPrivateIPv4(ip);
	if (version === 6) return isPrivateIPv6(ip);
	return true; // not a recognizable IP literal — treat as unsafe
}

/**
 * Validates that a URL is http(s) and does not resolve to a private, loopback,
 * link-local, or otherwise internal address. Throws if the URL is unsafe to fetch.
 */
export async function assertPublicHttpUrl(rawUrl: string): Promise<URL> {
	let parsed: URL;
	try {
		parsed = new URL(rawUrl);
	} catch {
		throw new Error("Invalid URL format");
	}

	if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
		throw new Error("Only http and https URLs are allowed");
	}

	const hostname = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, "");
	if (BLOCKED_HOSTNAMES.has(hostname)) {
		throw new Error("Requests to local or internal hosts are not allowed");
	}

	if (isIP(hostname)) {
		if (isPrivateIP(hostname)) {
			throw new Error(
				"Requests to private or internal IP addresses are not allowed",
			);
		}
		return parsed;
	}

	let addresses: string[];
	try {
		const records = await dns.lookup(hostname, { all: true, verbatim: true });
		addresses = records.map((r) => r.address);
	} catch {
		throw new Error("Could not resolve host");
	}

	if (addresses.length === 0 || addresses.some((addr) => isPrivateIP(addr))) {
		throw new Error(
			"Requests to private or internal IP addresses are not allowed",
		);
	}

	return parsed;
}

export interface SafeFetchResult {
	response: Response;
	finalUrl: string;
}

/**
 * Like fetch(), but validates every URL (including redirect targets) against
 * assertPublicHttpUrl before following it, closing the DNS-rebinding /
 * redirect-to-internal-host SSRF bypass that plain fetch(url) is exposed to.
 */
export async function safeFetch(
	url: string,
	init?: RequestInit,
): Promise<SafeFetchResult> {
	let currentUrl = url;

	for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
		const validated = await assertPublicHttpUrl(currentUrl);
		const response = await fetch(validated.href, {
			...init,
			redirect: "manual",
		});

		const isRedirect =
			response.status >= 300 &&
			response.status < 400 &&
			response.headers.has("location");
		if (!isRedirect) {
			return { response, finalUrl: validated.href };
		}

		const location = response.headers.get("location");
		if (!location) return { response, finalUrl: validated.href };
		currentUrl = new URL(location, validated.href).href;
	}

	throw new Error("Too many redirects");
}
