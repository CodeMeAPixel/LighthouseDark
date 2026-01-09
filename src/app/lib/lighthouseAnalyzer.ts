"use server"

export interface LighthouseMetrics {
  performanceScore: number | null
  accessibilityScore: number | null
  bestPracticesScore: number | null
  seoScore: number | null
  pwaScore: number | null
  fcp: number | null
  lcp: number | null
  cls: number | null
  tbt: number | null
  speedIndex: number | null
  ttfb: number | null
  totalByteWeight: number | null
  networkRequests: number | null
  opportunities: Array<{ id: string; title: string; savingsMs: number }>
  largestAssets: Array<{ url: string; size: number; type: string }>
  thirdPartySummary: Array<{ domain: string; requests: number; bytes: number }>
  screenshot: string | null
}

export interface LighthouseData {
  mobile: LighthouseMetrics
  desktop: LighthouseMetrics
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
}

function parsePSIResult(result: any): LighthouseMetrics {
  try {
    if (!result?.lighthouseResult) return EMPTY

    const lhr = result.lighthouseResult
    const audits = lhr.audits || {}
    const cats = lhr.categories || {}

    const perfScore = cats.performance?.score != null ? Math.round(cats.performance.score * 100) : null
    const accessibilityScore = cats.accessibility?.score != null ? Math.round(cats.accessibility.score * 100) : null
    const bestPracticesScore = cats["best-practices"]?.score != null ? Math.round(cats["best-practices"].score * 100) : null
    const seoScore = cats.seo?.score != null ? Math.round(cats.seo.score * 100) : null
    const pwaScore = null

    const toMs = (v: any) => (typeof v === "number" && isFinite(v) ? Math.round(v) : null)

    // Network requests
    const netReq = (() => {
      const details = audits["network-requests"]?.details
      return details?.items?.length ? details.items.length : null
    })()

    // Opportunities
    const opps = (lhr.audits ? Object.values(lhr.audits) : [])
      .filter((a: any) => a?.details?.type === "opportunity" && typeof a?.details?.overallSavingsMs === "number" && a?.title)
      .map((a: any) => ({ id: a?.id || a?.title, title: a?.title, savingsMs: Math.round(a.details.overallSavingsMs) }))
      .sort((a: any, b: any) => b.savingsMs - a.savingsMs)
      .slice(0, 5)

    // Largest assets
    const largestAssets: Array<{ url: string; size: number; type: string }> = []
    const assetDetails = audits["resource-summary"]?.details?.items || []
    assetDetails.forEach((item: any) => {
      if (item.url && item.transferSize && item.resourceType) {
        largestAssets.push({ url: item.url, size: item.transferSize, type: item.resourceType })
      }
    })
    largestAssets.sort((a, b) => b.size - a.size)
    const topAssets = largestAssets.slice(0, 5)

    // Third-party summary
    const thirdPartySummary: Array<{ domain: string; requests: number; bytes: number }> = []
    const thirdPartyDetails = audits["third-party-summary"]?.details?.items || []
    thirdPartyDetails.forEach((item: any) => {
      if (item.entity && item.requestCount && item.transferSize) {
        thirdPartySummary.push({ domain: item.entity, requests: item.requestCount, bytes: item.transferSize })
      }
    })
    thirdPartySummary.sort((a, b) => b.bytes - a.bytes)
    const topThirdParty = thirdPartySummary.slice(0, 5)

    // Screenshot
    const screenshot = audits["final-screenshot"]?.details?.data || null

    return {
      performanceScore: perfScore,
      accessibilityScore,
      bestPracticesScore,
      seoScore,
      pwaScore,
      fcp: toMs(audits["first-contentful-paint"]?.numericValue),
      lcp: toMs(audits["largest-contentful-paint"]?.numericValue),
      cls: audits["cumulative-layout-shift"]?.numericValue ?? null,
      tbt: toMs(audits["total-blocking-time"]?.numericValue),
      speedIndex: toMs(audits["speed-index"]?.numericValue),
      ttfb: toMs(audits["server-response-time"]?.numericValue ?? audits["time-to-first-byte"]?.numericValue),
      totalByteWeight: audits["total-byte-weight"]?.numericValue ?? null,
      networkRequests: netReq,
      opportunities: opps as any,
      largestAssets: topAssets,
      thirdPartySummary: topThirdParty,
      screenshot,
    }
  } catch (e) {
    console.error("Error parsing PSI result:", e)
    return EMPTY
  }
}

async function runPSIAnalysis(url: string, strategy: "mobile" | "desktop"): Promise<LighthouseMetrics> {
  try {
    const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY
    if (!apiKey) {
      console.error("GOOGLE_PAGESPEED_API_KEY not configured")
      return EMPTY
    }

    const encodedUrl = encodeURIComponent(url)
    const psiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodedUrl}&key=${apiKey}&strategy=${strategy}&category=performance&category=accessibility&category=best-practices&category=seo`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60000)

    const response = await fetch(psiUrl, {
      headers: { "User-Agent": "Lighthouse-Dark/1.0" },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.error(`PSI API error (${strategy}):`, response.status, response.statusText)
      return EMPTY
    }

    const result = await response.json()
    return parsePSIResult(result)
  } catch (e) {
    console.error(`PSI analysis error (${strategy}):`, (e as any)?.message || e)
    return EMPTY
  }
}

export async function analyzeLighthouse(url: string): Promise<LighthouseData> {
  try {
    const [mobile, desktop] = await Promise.all([
      runPSIAnalysis(url, "mobile"),
      runPSIAnalysis(url, "desktop"),
    ])

    return { mobile, desktop }
  } catch (e) {
    console.error("Lighthouse analysis error:", e)
    return {
      mobile: EMPTY,
      desktop: EMPTY,
    }
  }
}
