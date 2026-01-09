"use server";

import { JSDOM } from "jsdom";

export interface SEOData {
  title: string | null;
  metaDescription: string | null;
  keywords: string | null;
  ogImg: string | null;
  h1Count: number;
  h2Count: number;
  robots: string | null;
  googlebot: string | null;
  canonical: string | null;
  lang: string | null;
  // Additional insights
  status: number;
  finalUrl: string;
  viewport: boolean; // meta viewport present
  viewportIsResponsive: boolean; // contains width=device-width and initial-scale
  hasFavicon: boolean; // any link rel*="icon"
  jsonLdCount: number; // number of script[type='application/ld+json']
  canonicalIsSelf: boolean; // canonical points to this page
  indexable: boolean | null; // null if unknown
  follow: boolean | null; // null if unknown
  metaCharset: string | null;
  firstH1: string | null;
  hasOgBasic: boolean; // og:title, og:description, og:image
  hasTwitterCard: boolean; // twitter:card present
  hreflangCount: number; // link[rel='alternate'][hreflang]
  preconnectCount: number; // link[rel='preconnect']
  preloadCount: number; // link[rel='preload']
  metaThemeColor: string | null; // meta[name='theme-color']
  titleLength: number | null;
  descriptionLength: number | null;
  imgCount: number;
  imgWithoutAlt: number;
  robotsTxtPresent: boolean | null;
  robotsTxtDisallowAll: boolean | null;
  sitemapPresent: boolean | null;
  cacheControl: string | null;
  contentEncoding: string | null;
  contentType: string | null;
}

export async function analyzeSEO(url: string): Promise<SEOData | undefined> {
  const controller = new AbortController();
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    timeout = setTimeout(() => controller.abort(), 8000);

  const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
  signal: controller.signal,
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const getMeta = (names: string[]) =>
      names.map(n => document.querySelector(`meta[name="${n}"], meta[property="${n}"]`)?.getAttribute("content")?.trim())
        .find(Boolean) || null;

    // Use the final response URL (after redirects) as the base for resolving relative links
    const finalUrl = (res as any).url || url;
    const baseHref = document.querySelector("base")?.getAttribute("href") || undefined;
    const baseUrl = new URL(baseHref || finalUrl, finalUrl).href;
    const toAbsolute = (v: string | null) => (v ? new URL(v, baseUrl).href : null);

  // Prefer <title>, then OG/Twitter, then first <h1> text as a last resort
    const titleTag = document.querySelector("title")?.textContent?.trim();
    const ogTitle = getMeta(["og:title", "twitter:title"]);
    const h1Fallback = document.querySelector("h1")?.textContent?.trim() || null;

    // Language: prefer <html lang>, then og:locale (normalized underscore -> hyphen)
    const htmlLang = document.documentElement.getAttribute("lang")?.trim();
    const ogLocale = getMeta(["og:locale"])?.replace(/_/g, "-") || null;

    const canonicalRaw = document.querySelector("link[rel='canonical']")?.getAttribute("href") || null;

  // Viewport presence and basic responsiveness
  const viewportMeta = document.querySelector("meta[name='viewport']");
  const hasViewport = !!viewportMeta;
  const viewportContent = viewportMeta?.getAttribute("content")?.toLowerCase() || "";
  const viewportIsResponsive = /width\s*=\s*device-width/.test(viewportContent) && /initial-scale\s*=/.test(viewportContent);

    // Favicon/Icon presence (shortcut icon, icon, mask-icon)
    const hasAnyIcon = !!document.querySelector("link[rel~='icon'], link[rel='shortcut icon'], link[rel='mask-icon']");

    // JSON-LD structured data count
    const jsonLdCount = document.querySelectorAll("script[type='application/ld+json']").length;

    // Charset
    const charset =
      document.querySelector("meta[charset]")?.getAttribute("charset")?.trim() ||
      (document
        .querySelector("meta[http-equiv='Content-Type']")
        ?.getAttribute("content")
        ?.match(/charset=([^;]+)/i)?.[1] || null);

    // Indexability from robots meta/header
    const robotsCombined = `${getMeta(["robots"]) || ""} ${res.headers.get("x-robots-tag") || ""}`.toLowerCase();
    const indexable = robotsCombined.includes("noindex")
      ? false
      : robotsCombined.includes("index")
        ? true
        : null;
    const follow = robotsCombined.includes("nofollow")
      ? false
      : robotsCombined.includes("follow")
        ? true
        : null;

    // Canonical normalization and self-referential check
    const canonicalAbs = toAbsolute(canonicalRaw);
    const normalizeForCompare = (u: string) => {
      try {
        const a = new URL(u);
        let p = a.pathname.endsWith("/") ? a.pathname.slice(0, -1) : a.pathname;
        return `${a.origin}${p}${a.search}`;
      } catch {
        return u;
      }
    };
    const canonicalIsSelf = !!(canonicalAbs && normalizeForCompare(canonicalAbs) === normalizeForCompare(finalUrl));

  // Social completeness
  const hasOgBasic = !!(getMeta(["og:title"]) && getMeta(["og:description"]) && getMeta(["og:image", "og:image:url", "og:image:secure_url"]));
  const hasTwitterCard = !!getMeta(["twitter:card"]);

  // Internationalization and resource hints
  const hreflangCount = document.querySelectorAll("link[rel='alternate'][hreflang]").length;
  const preconnectCount = document.querySelectorAll("link[rel='preconnect']").length;
  const preloadCount = document.querySelectorAll("link[rel='preload']").length;

  // Theming
  const metaThemeColor = document.querySelector("meta[name='theme-color']")?.getAttribute("content") || null;

    // Meta lengths and image alt coverage
    const titleLength = titleTag?.length || ogTitle?.length || (h1Fallback?.length || null);
    const descriptionLength = (getMeta(["description"])?.length) || (getMeta(["og:description"])?.length) || null;
    const imgs = Array.from(document.querySelectorAll("img"));
    const imgCount = imgs.length;
    const imgWithoutAlt = imgs.filter((img) => {
      const alt = img.getAttribute("alt");
      return alt === null || alt.trim() === "";
    }).length;

    // Header info
    const cacheControl = res.headers.get("cache-control");
    const contentEncoding = res.headers.get("content-encoding");
    const contentType = res.headers.get("content-type");

    // robots.txt and sitemap checks with tight timeouts (parallelized)
    let robotsTxtPresent: boolean | null = null;
    let robotsTxtDisallowAll: boolean | null = null;
    let sitemapPresent: boolean | null = null;
    try {
      const origin = new URL(finalUrl).origin;
      const robotsUrl = new URL("/robots.txt", origin).href;
      const sitemapUrl = new URL("/sitemap.xml", origin).href;

      // Parallelize robots.txt and sitemap checks with shared timeout
      const checkController = new AbortController();
      const checkTimeout = setTimeout(() => checkController.abort(), 3000);

      try {
        const [robotsRes, sitemapRes] = await Promise.allSettled([
          fetch(robotsUrl, { headers: { Accept: "text/plain" }, signal: checkController.signal }),
          fetch(sitemapUrl, { headers: { Accept: "application/xml,text/xml;q=0.9,*/*;q=0.8" }, signal: checkController.signal })
        ]);

        if (robotsRes.status === "fulfilled" && robotsRes.value.ok) {
          robotsTxtPresent = true;
          const text = (await robotsRes.value.text()).slice(0, 2000);
          const uaAll = /user-agent\s*:\s*\*/i.test(text);
          const disallowAll = /disallow\s*:\s*\/$/im.test(text) || /disallow\s*:\s*\/*\s*$/im.test(text);
          robotsTxtDisallowAll = uaAll && disallowAll ? true : false;
          if (/sitemap\s*:/i.test(text)) sitemapPresent = true;
        } else {
          robotsTxtPresent = robotsRes.status === "fulfilled" ? false : null;
        }

        if (sitemapRes.status === "fulfilled" && sitemapRes.value.ok) {
          sitemapPresent = true;
        } else if (sitemapPresent === null) {
          sitemapPresent = sitemapRes.status === "fulfilled" ? false : null;
        }
      } finally {
        clearTimeout(checkTimeout);
      }
    } catch {
      // ignore
    }

    const data: SEOData = {
      title: titleTag || ogTitle || h1Fallback,
      metaDescription: getMeta(["description", "og:description", "twitter:description"]),
      keywords: getMeta(["keywords", "news_keywords"]),
      ogImg: toAbsolute(getMeta(["og:image", "og:image:url", "og:image:secure_url", "twitter:image"])),
      h1Count: document.querySelectorAll("h1").length,
      h2Count: document.querySelectorAll("h2").length,
      robots: getMeta(["robots"]) || res.headers.get("x-robots-tag"),
      googlebot: getMeta(["googlebot"]),
      canonical: canonicalAbs,
      lang: htmlLang || ogLocale,
      status: res.status,
      finalUrl,
      viewport: hasViewport,
  viewportIsResponsive,
      hasFavicon: hasAnyIcon,
      jsonLdCount,
      canonicalIsSelf,
      indexable,
      follow,
      metaCharset: charset,
      firstH1: h1Fallback,
  hasOgBasic,
  hasTwitterCard,
  hreflangCount,
  preconnectCount,
  preloadCount,
  metaThemeColor,
  titleLength,
  descriptionLength,
  imgCount,
  imgWithoutAlt,
      robotsTxtPresent,
      robotsTxtDisallowAll,
      sitemapPresent,
      cacheControl,
      contentEncoding,
      contentType,
    };

    return data;
  } catch (error) {
    console.error("SEO analysis failed:", error);
    return undefined;
  } finally {
  // Ensure we always clear the timeout
  if (timeout) clearTimeout(timeout);
  }
}
