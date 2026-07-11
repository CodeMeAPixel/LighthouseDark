import { describe, expect, it } from "vitest";
import { detectSlop } from "./aiSuggestions";
import type { SEOData } from "./seoAnalyzer";

function makeSEOData(overrides: Partial<SEOData> = {}): SEOData {
	return {
		title: "A Perfectly Normal Page Title",
		metaDescription: "A perfectly normal, specific meta description.",
		keywords: null,
		ogImg: null,
		h1Count: 1,
		h2Count: 2,
		robots: null,
		googlebot: null,
		canonical: "https://example.com/",
		lang: "en",
		status: 200,
		finalUrl: "https://example.com/",
		viewport: true,
		viewportIsResponsive: true,
		hasFavicon: true,
		jsonLdCount: 1,
		canonicalIsSelf: true,
		indexable: true,
		follow: true,
		metaCharset: "utf-8",
		firstH1: "A Perfectly Normal Page Title",
		hasOgBasic: true,
		hasTwitterCard: true,
		hreflangCount: 0,
		preconnectCount: 0,
		preloadCount: 0,
		metaThemeColor: null,
		titleLength: 28,
		descriptionLength: 44,
		imgCount: 3,
		imgWithoutAlt: 0,
		robotsTxtPresent: true,
		robotsTxtDisallowAll: false,
		sitemapPresent: true,
		cacheControl: "public, max-age=3600",
		contentEncoding: "gzip",
		contentType: "text/html",
		...overrides,
	};
}

describe("detectSlop", () => {
	it("returns no indicators for a clean, well-formed page", () => {
		expect(detectSlop(makeSEOData())).toEqual([]);
	});

	it("returns an empty array when seo data is null", () => {
		expect(detectSlop(null)).toEqual([]);
	});

	it("flags generic/placeholder titles", () => {
		const indicators = detectSlop(
			makeSEOData({ title: "Welcome to WordPress" }),
		);
		expect(indicators.some((i) => i.type === "generic-title")).toBe(true);
	});

	it("flags AI-generated content markers in the meta description", () => {
		const indicators = detectSlop(
			makeSEOData({
				metaDescription:
					"In today's digital age, let's dive in to unlock the potential.",
			}),
		);
		expect(indicators.some((i) => i.type === "ai-content-markers")).toBe(true);
	});

	it("flags stock/placeholder OG images", () => {
		const indicators = detectSlop(
			makeSEOData({ ogImg: "https://images.unsplash.com/photo-123" }),
		);
		expect(indicators.some((i) => i.type === "stock-og-image")).toBe(true);
	});

	it("flags a missing title and missing description as high severity", () => {
		const indicators = detectSlop(
			makeSEOData({
				title: null,
				titleLength: null,
				metaDescription: null,
				descriptionLength: null,
			}),
		);
		expect(indicators).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ type: "missing-title", severity: "high" }),
				expect.objectContaining({
					type: "missing-description",
					severity: "high",
				}),
			]),
		);
	});

	it("flags missing and multiple H1s", () => {
		expect(
			detectSlop(makeSEOData({ h1Count: 0 })).some(
				(i) => i.type === "missing-h1",
			),
		).toBe(true);
		expect(
			detectSlop(makeSEOData({ h1Count: 3 })).some(
				(i) => i.type === "multiple-h1",
			),
		).toBe(true);
	});
});
