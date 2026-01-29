export function normalizeUrl(url: string): string {
	const trimmed = url.trim();
	if (/^https?:\/\//i.test(trimmed)) {
		return trimmed;
	}
	return `https://${trimmed}`;
}

export function isValidUrl(url: string): boolean {
	try {
		const normalized = normalizeUrl(url);
		new URL(normalized);
		return true;
	} catch {
		return false;
	}
}

export function sanitizeInput(input: unknown): unknown {
	if (typeof input === "string") {
		return input.replace(/[<>&'"]/g, "");
	}
	if (Array.isArray(input)) {
		return input.map(sanitizeInput);
	}
	if (typeof input === "object" && input !== null) {
		const sanitizedObject: Record<string, unknown> = {};
		for (const [key, value] of Object.entries(input)) {
			sanitizedObject[key] = sanitizeInput(value);
		}
		return sanitizedObject;
	}
	return input;
}
