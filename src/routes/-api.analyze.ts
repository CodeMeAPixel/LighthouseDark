import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";
import * as Sentry from "@sentry/node";
import { analyzeSEO } from "@/lib/seoAnalyzer";
import { analyzeLighthouse } from "@/lib/lighthouseAnalyzer";
import {
	generateAISuggestions,
	detectSlop,
	type AISuggestion,
	type SlopIndicator,
} from "@/lib/aiSuggestions";
import { checkRateLimit } from "@/lib/rateLimiter";
import { assertPublicHttpUrl } from "@/lib/urlGuard";

interface AnalyzeRequest {
	url: string;
}

interface AnalyzeResponse {
	seo: Awaited<ReturnType<typeof analyzeSEO>>;
	lighthouse: Awaited<ReturnType<typeof analyzeLighthouse>>;
	aiSuggestions: AISuggestion[];
	slopIndicators: SlopIndicator[];
}

interface ErrorResponse {
	error: string;
	code?: string;
}

function normalizeUrl(inputUrl: string): string {
	let normalized = inputUrl.trim();

	if (!/^https?:\/\//i.test(normalized)) {
		normalized = `https://${normalized}`;
	}

	try {
		const parsed = new URL(normalized);
		return parsed.href;
	} catch {
		throw new Error("Invalid URL format");
	}
}

export const analyzeUrl = createServerFn({ method: "POST" })
	.inputValidator((data: AnalyzeRequest) => {
		if (!data || typeof data.url !== "string" || !data.url.trim()) {
			throw new Error("URL is required");
		}
		return { url: data.url };
	})
	.handler(async ({ data }): Promise<AnalyzeResponse | ErrorResponse> => {
		const { url } = data;

		try {
			// Rate limiting — keyed on the real client IP, not a shared bucket
			const clientIp = getRequestIP({ xForwardedFor: true }) ?? "unknown";
			const { allowed, resetTime } = checkRateLimit(clientIp);
			if (!allowed) {
				return {
					error: `Rate limit exceeded. Please try again in ${Math.ceil((resetTime - Date.now()) / 1000)} seconds.`,
					code: "RATE_LIMIT_EXCEEDED",
				};
			}

			// Normalize URL
			const normalizedUrl = normalizeUrl(url);

			// Reject URLs that resolve to private/internal addresses before we
			// spend a fetch or a PageSpeed API call on them.
			try {
				await assertPublicHttpUrl(normalizedUrl);
			} catch (err) {
				return {
					error: err instanceof Error ? err.message : "That URL isn't allowed",
					code: "URL_NOT_ALLOWED",
				};
			}

			// Run all analyses in parallel
			const [seoData, lighthouseData] = await Promise.all([
				analyzeSEO(normalizedUrl).catch((err) => {
					console.error("SEO analysis error:", err);
					Sentry.captureException(err);
					return null;
				}),
				analyzeLighthouse(normalizedUrl).catch((err) => {
					console.error("Lighthouse analysis error:", err);
					Sentry.captureException(err);
					return null;
				}),
			]);

			// Generate AI suggestions based on the analysis results
			let aiSuggestions: AISuggestion[] = [];

			try {
				if (seoData || lighthouseData) {
					aiSuggestions = await generateAISuggestions({
						url: normalizedUrl,
						seo: seoData ?? null,
						lighthouse: lighthouseData,
					});
				}
			} catch (err) {
				console.error("AI suggestions error:", err);
				Sentry.captureException(err);
				// Continue without AI suggestions
			}

			// Detect slop/quality issues
			const slopIndicators = detectSlop(seoData ?? null);

			return {
				seo: seoData as Awaited<ReturnType<typeof analyzeSEO>>,
				lighthouse: lighthouseData as Awaited<
					ReturnType<typeof analyzeLighthouse>
				>,
				aiSuggestions,
				slopIndicators,
			};
		} catch (error) {
			console.error("Analysis error:", error);
			Sentry.captureException(error);
			return {
				error:
					error instanceof Error
						? error.message
						: "An unexpected error occurred",
				code: "ANALYSIS_ERROR",
			};
		}
	});
