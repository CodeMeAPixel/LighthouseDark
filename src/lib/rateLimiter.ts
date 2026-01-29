// Rate limiter for API requests
interface RateLimitEntry {
	count: number;
	resetTime: number;
}

interface RateLimitResult {
	allowed: boolean;
	remaining: number;
	resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const MAX_REQUESTS = 10;
const WINDOW_MS = 60000; // 1 minute

export function checkRateLimit(ip: string): RateLimitResult {
	const now = Date.now();
	const entry = rateLimitMap.get(ip);

	if (!entry || now > entry.resetTime) {
		const newEntry = {
			count: 1,
			resetTime: now + WINDOW_MS,
		};
		rateLimitMap.set(ip, newEntry);
		return {
			allowed: true,
			remaining: MAX_REQUESTS - 1,
			resetTime: newEntry.resetTime,
		};
	}

	if (entry.count >= MAX_REQUESTS) {
		return {
			allowed: false,
			remaining: 0,
			resetTime: entry.resetTime,
		};
	}

	entry.count++;
	return {
		allowed: true,
		remaining: MAX_REQUESTS - entry.count,
		resetTime: entry.resetTime,
	};
}
