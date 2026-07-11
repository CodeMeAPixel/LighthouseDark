import * as Sentry from "@sentry/node";

export interface LighthouseMetrics {
	performanceScore: number | null;
	accessibilityScore: number | null;
	bestPracticesScore: number | null;
	seoScore: number | null;
	pwaScore: number | null;
	fcp: number | null;
	lcp: number | null;
	cls: number | null;
	tbt: number | null;
	speedIndex: number | null;
	ttfb: number | null;
	totalByteWeight: number | null;
	networkRequests: number | null;
	opportunities: Array<{ id: string; title: string; savingsMs: number }>;
	largestAssets: Array<{ url: string; size: number; type: string }>;
	thirdPartySummary: Array<{ domain: string; requests: number; bytes: number }>;
	screenshot: string | null;
}

export interface LighthouseData {
	mobile: LighthouseMetrics;
	desktop: LighthouseMetrics;
}

const EMPTY: LighthouseMetrics = {
	performanceScore: null,
	accessibilityScore: null,
	bestPracticesScore: null,
	seoScore: null,
	pwaScore: null,
	fcp: null,
	lcp: null,
	cls: null,
	tbt: null,
	speedIndex: null,
	ttfb: null,
	totalByteWeight: null,
	networkRequests: null,
	opportunities: [],
	largestAssets: [],
	thirdPartySummary: [],
	screenshot: null,
};

function parsePSIResult(result: unknown): LighthouseMetrics {
	try {
		const r = result as Record<string, unknown>;
		if (!r?.lighthouseResult) return EMPTY;

		const lhr = r.lighthouseResult as Record<string, unknown>;
		const audits = (lhr.audits as Record<string, unknown>) || {};
		const cats = (lhr.categories as Record<string, unknown>) || {};

		const getScore = (cat: unknown): number | null => {
			const c = cat as { score?: number } | undefined;
			return c?.score != null ? Math.round(c.score * 100) : null;
		};

		const perfScore = getScore(cats.performance);
		const accessibilityScore = getScore(cats.accessibility);
		const bestPracticesScore = getScore(cats["best-practices"]);
		const seoScore = getScore(cats.seo);
		const pwaScore = null;

		const toMs = (v: unknown): number | null => {
			const n = v as number;
			return typeof n === "number" && Number.isFinite(n) ? Math.round(n) : null;
		};

		const getAudit = (id: string) =>
			audits[id] as Record<string, unknown> | undefined;

		const netReq = (() => {
			const details = getAudit("network-requests")?.details as
				| { items?: unknown[] }
				| undefined;
			return details?.items?.length ?? null;
		})();

		const opps = Object.values(audits)
			.filter((a): a is Record<string, unknown> => {
				const audit = a as Record<string, unknown>;
				const details = audit?.details as
					| { type?: string; overallSavingsMs?: number }
					| undefined;
				return (
					details?.type === "opportunity" &&
					typeof details?.overallSavingsMs === "number" &&
					!!audit?.title
				);
			})
			.map((a) => ({
				id: (a.id as string) || (a.title as string),
				title: a.title as string,
				savingsMs: Math.round(
					(a.details as { overallSavingsMs: number }).overallSavingsMs,
				),
			}))
			.sort((a, b) => b.savingsMs - a.savingsMs)
			.slice(0, 5);

		const largestAssets: Array<{ url: string; size: number; type: string }> =
			[];
		const resourceSummary = getAudit("resource-summary")?.details as
			| { items?: unknown[] }
			| undefined;
		const assetDetails = resourceSummary?.items || [];
		for (const item of assetDetails) {
			const i = item as {
				url?: string;
				transferSize?: number;
				resourceType?: string;
			};
			if (i.url && i.transferSize && i.resourceType) {
				largestAssets.push({
					url: i.url,
					size: i.transferSize,
					type: i.resourceType,
				});
			}
		}
		largestAssets.sort((a, b) => b.size - a.size);
		const topAssets = largestAssets.slice(0, 5);

		const thirdPartySummary: Array<{
			domain: string;
			requests: number;
			bytes: number;
		}> = [];
		const thirdParty = getAudit("third-party-summary")?.details as
			| { items?: unknown[] }
			| undefined;
		const thirdPartyDetails = thirdParty?.items || [];
		for (const item of thirdPartyDetails) {
			const i = item as {
				entity?: string;
				requestCount?: number;
				transferSize?: number;
			};
			if (i.entity && i.requestCount && i.transferSize) {
				thirdPartySummary.push({
					domain: i.entity,
					requests: i.requestCount,
					bytes: i.transferSize,
				});
			}
		}
		thirdPartySummary.sort((a, b) => b.bytes - a.bytes);
		const topThirdParty = thirdPartySummary.slice(0, 5);

		const screenshot =
			(getAudit("final-screenshot")?.details as { data?: string } | undefined)
				?.data || null;

		const clsAudit = getAudit("cumulative-layout-shift");
		const clsValue = clsAudit?.numericValue as number | undefined;

		return {
			performanceScore: perfScore,
			accessibilityScore,
			bestPracticesScore,
			seoScore,
			pwaScore,
			fcp: toMs(getAudit("first-contentful-paint")?.numericValue),
			lcp: toMs(getAudit("largest-contentful-paint")?.numericValue),
			cls: clsValue ?? null,
			tbt: toMs(getAudit("total-blocking-time")?.numericValue),
			speedIndex: toMs(getAudit("speed-index")?.numericValue),
			ttfb: toMs(
				getAudit("server-response-time")?.numericValue ??
					getAudit("time-to-first-byte")?.numericValue,
			),
			totalByteWeight:
				(getAudit("total-byte-weight")?.numericValue as number) ?? null,
			networkRequests: netReq,
			opportunities: opps,
			largestAssets: topAssets,
			thirdPartySummary: topThirdParty,
			screenshot,
		};
	} catch (e) {
		console.error("Error parsing PSI result:", e);
		Sentry.captureException(e);
		return EMPTY;
	}
}

async function runPSIAnalysis(
	url: string,
	strategy: "mobile" | "desktop",
): Promise<LighthouseMetrics> {
	try {
		const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
		if (!apiKey) {
			console.error("GOOGLE_PAGESPEED_API_KEY not configured");
			return EMPTY;
		}

		const encodedUrl = encodeURIComponent(url);

		// Check if analyzing localhost - PSI cannot reach local URLs
		if (url.includes("localhost") || url.includes("127.0.0.1")) {
			console.error(
				`PSI analysis skipped for ${strategy}: Cannot analyze localhost URLs via Google PageSpeed Insights.`,
			);
			return EMPTY;
		}

		const psiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodedUrl}&key=${apiKey}&strategy=${strategy}&category=performance&category=accessibility&category=best-practices&category=seo`;

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 60000);

		const response = await fetch(psiUrl, {
			headers: { "User-Agent": "Lighthouse-Dark/1.0" },
			signal: controller.signal,
		});

		clearTimeout(timeoutId);

		if (!response.ok) {
			const errorText = await response.text();
			let detailedError = "";
			try {
				const errorJson = JSON.parse(errorText);
				detailedError = errorJson.error?.message || errorText;
			} catch {
				detailedError = errorText;
			}
			console.error(
				`PSI API error (${strategy}):`,
				response.status,
				detailedError,
			);
			return EMPTY;
		}

		const result = await response.json();
		return parsePSIResult(result);
	} catch (e) {
		console.error(
			`PSI analysis error (${strategy}):`,
			(e as Error)?.message || e,
		);
		Sentry.captureException(e);
		return EMPTY;
	}
}

export async function analyzeLighthouse(url: string): Promise<LighthouseData> {
	try {
		const [mobile, desktop] = await Promise.all([
			runPSIAnalysis(url, "mobile"),
			runPSIAnalysis(url, "desktop"),
		]);

		return { mobile, desktop };
	} catch (e) {
		console.error("Lighthouse analysis error:", e);
		Sentry.captureException(e);
		return {
			mobile: EMPTY,
			desktop: EMPTY,
		};
	}
}
