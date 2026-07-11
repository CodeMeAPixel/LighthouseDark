import { describe, expect, it, vi } from "vitest";
import { assertPublicHttpUrl, isPrivateIP } from "./urlGuard";

describe("isPrivateIP", () => {
	it("flags loopback addresses", () => {
		expect(isPrivateIP("127.0.0.1")).toBe(true);
		// "127.1" isn't a valid dotted-quad per net.isIP, so it's treated as unsafe (fail closed)
		expect(isPrivateIP("127.1")).toBe(true);
		expect(isPrivateIP("::1")).toBe(true);
	});

	it("flags private RFC1918 ranges", () => {
		expect(isPrivateIP("10.0.0.5")).toBe(true);
		expect(isPrivateIP("172.16.0.1")).toBe(true);
		expect(isPrivateIP("172.31.255.255")).toBe(true);
		expect(isPrivateIP("172.32.0.1")).toBe(false);
		expect(isPrivateIP("192.168.1.1")).toBe(true);
	});

	it("flags link-local and cloud metadata addresses", () => {
		expect(isPrivateIP("169.254.169.254")).toBe(true);
		expect(isPrivateIP("fe80::1")).toBe(true);
	});

	it("flags CGNAT and reserved/multicast ranges", () => {
		expect(isPrivateIP("100.64.0.1")).toBe(true);
		expect(isPrivateIP("224.0.0.1")).toBe(true);
		expect(isPrivateIP("240.0.0.1")).toBe(true);
	});

	it("allows ordinary public IPv4 addresses", () => {
		expect(isPrivateIP("8.8.8.8")).toBe(false);
		expect(isPrivateIP("1.1.1.1")).toBe(false);
	});

	it("treats invalid IP literals as unsafe", () => {
		expect(isPrivateIP("not-an-ip")).toBe(true);
	});
});

describe("assertPublicHttpUrl", () => {
	it("rejects non-http(s) protocols", async () => {
		await expect(assertPublicHttpUrl("file:///etc/passwd")).rejects.toThrow(
			/http and https/i,
		);
		await expect(assertPublicHttpUrl("ftp://example.com")).rejects.toThrow();
	});

	it("rejects malformed URLs", async () => {
		await expect(assertPublicHttpUrl("not a url")).rejects.toThrow(
			/invalid url/i,
		);
	});

	it("rejects the localhost hostname", async () => {
		await expect(assertPublicHttpUrl("http://localhost:3000")).rejects.toThrow(
			/local or internal/i,
		);
	});

	it("rejects literal private/loopback IP URLs without a DNS lookup", async () => {
		await expect(assertPublicHttpUrl("http://127.0.0.1/")).rejects.toThrow(
			/private or internal/i,
		);
		await expect(
			assertPublicHttpUrl("http://169.254.169.254/latest/meta-data"),
		).rejects.toThrow(/private or internal/i);
	});

	it("allows a literal public IP URL", async () => {
		const result = await assertPublicHttpUrl("http://8.8.8.8/");
		expect(result.hostname).toBe("8.8.8.8");
	});

	it("rejects a hostname that resolves to a private address", async () => {
		vi.doMock("node:dns/promises", () => ({
			default: {
				lookup: vi
					.fn()
					.mockResolvedValue([{ address: "127.0.0.1", family: 4 }]),
			},
		}));
		vi.resetModules();
		const { assertPublicHttpUrl: assertWithMockedDns } = await import(
			"./urlGuard"
		);
		await expect(
			assertWithMockedDns("http://rebind.example.test/"),
		).rejects.toThrow(/private or internal/i);
		vi.doUnmock("node:dns/promises");
		vi.resetModules();
	});
});
