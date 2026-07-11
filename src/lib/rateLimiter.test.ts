import { describe, expect, it } from "vitest";
import { checkRateLimit } from "./rateLimiter";

describe("checkRateLimit", () => {
	it("allows requests under the limit and decrements remaining", () => {
		const result = checkRateLimit("test-ip-allow");
		expect(result.allowed).toBe(true);
		expect(result.remaining).toBe(9);
	});

	it("blocks requests once the limit is exceeded", () => {
		const ip = "test-ip-exceed";
		for (let i = 0; i < 10; i++) {
			expect(checkRateLimit(ip).allowed).toBe(true);
		}
		const blocked = checkRateLimit(ip);
		expect(blocked.allowed).toBe(false);
		expect(blocked.remaining).toBe(0);
	});

	it("tracks separate buckets per key so one client can't exhaust another's quota", () => {
		const ipA = "test-ip-a";
		const ipB = "test-ip-b";
		for (let i = 0; i < 10; i++) checkRateLimit(ipA);

		expect(checkRateLimit(ipA).allowed).toBe(false);
		expect(checkRateLimit(ipB).allowed).toBe(true);
	});
});
