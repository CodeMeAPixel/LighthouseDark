import { parseHTML } from 'linkedom'

export interface SEOData {
  title: string | null
  metaDescription: string | null
  keywords: string | null
  ogImg: string | null
  h1Count: number
  h2Count: number
  robots: string | null
  googlebot: string | null
  canonical: string | null
  lang: string | null
  status: number
  finalUrl: string
  viewport: boolean
  viewportIsResponsive: boolean
  hasFavicon: boolean
  jsonLdCount: number
  canonicalIsSelf: boolean
  indexable: boolean | null
  follow: boolean | null
  metaCharset: string | null
  firstH1: string | null
  hasOgBasic: boolean
  hasTwitterCard: boolean
  hreflangCount: number
  preconnectCount: number
  preloadCount: number
  metaThemeColor: string | null
  titleLength: number | null
  descriptionLength: number | null
  imgCount: number
  imgWithoutAlt: number
  robotsTxtPresent: boolean | null
  robotsTxtDisallowAll: boolean | null
  sitemapPresent: boolean | null
  cacheControl: string | null
  contentEncoding: string | null
  contentType: string | null
}

export async function analyzeSEO(url: string): Promise<SEOData | undefined> {
  const controller = new AbortController()
  let timeout: ReturnType<typeof setTimeout> | undefined

  try {
    timeout = setTimeout(() => controller.abort(), 8000)

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Sec-Ch-Ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1'
      },
      signal: controller.signal,
    })

    if (!res.ok) {
      if (res.status === 403) {
        throw new Error('Access Forbidden (403): The target site is blocking the analysis. This often happens with Cloudflare or bot protection.')
      }
      throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    }
    const html = await res.text()
    const { document } = parseHTML(html)

    const getMeta = (names: string[]) =>
      names
        .map((n) =>
          document
            .querySelector(`meta[name="${n}"], meta[property="${n}"]`)
            ?.getAttribute('content')
            ?.trim()
        )
        .find(Boolean) || null

    const finalUrl = (res as unknown as { url?: string }).url || url
    const baseHref = document.querySelector('base')?.getAttribute('href') || undefined
    const baseUrl = new URL(baseHref || finalUrl, finalUrl).href
    const toAbsolute = (v: string | null) => (v ? new URL(v, baseUrl).href : null)

    const titleTag = document.querySelector('title')?.textContent?.trim()
    const ogTitle = getMeta(['og:title', 'twitter:title'])
    const h1Fallback = document.querySelector('h1')?.textContent?.trim() || null

    const htmlLang = document.documentElement.getAttribute('lang')?.trim()
    const ogLocale = getMeta(['og:locale'])?.replace(/_/g, '-') || null

    const canonicalRaw = document.querySelector("link[rel='canonical']")?.getAttribute('href') || null

    const viewportMeta = document.querySelector("meta[name='viewport']")
    const hasViewport = !!viewportMeta
    const viewportContent = viewportMeta?.getAttribute('content')?.toLowerCase() || ''
    const viewportIsResponsive =
      /width\s*=\s*device-width/.test(viewportContent) && /initial-scale\s*=/.test(viewportContent)

    const hasAnyIcon = !!document.querySelector(
      "link[rel~='icon'], link[rel='shortcut icon'], link[rel='mask-icon']"
    )

    const jsonLdCount = document.querySelectorAll("script[type='application/ld+json']").length

    const charset =
      document.querySelector('meta[charset]')?.getAttribute('charset')?.trim() ||
      document
        .querySelector("meta[http-equiv='Content-Type']")
        ?.getAttribute('content')
        ?.match(/charset=([^;]+)/i)?.[1] ||
      null

    const robotsCombined = `${getMeta(['robots']) || ''} ${res.headers.get('x-robots-tag') || ''}`.toLowerCase()
    const indexable = robotsCombined.includes('noindex')
      ? false
      : robotsCombined.includes('index')
        ? true
        : null
    const follow = robotsCombined.includes('nofollow')
      ? false
      : robotsCombined.includes('follow')
        ? true
        : null

    const canonicalAbs = toAbsolute(canonicalRaw)
    const normalizeForCompare = (u: string) => {
      try {
        const a = new URL(u)
        const p = a.pathname.endsWith('/') ? a.pathname.slice(0, -1) : a.pathname
        return `${a.origin}${p}${a.search}`
      } catch {
        return u
      }
    }
    const canonicalIsSelf = !!(
      canonicalAbs && normalizeForCompare(canonicalAbs) === normalizeForCompare(finalUrl)
    )

    const hasOgBasic = !!(
      getMeta(['og:title']) &&
      getMeta(['og:description']) &&
      getMeta(['og:image', 'og:image:url', 'og:image:secure_url'])
    )
    const hasTwitterCard = !!getMeta(['twitter:card'])

    const hreflangCount = document.querySelectorAll("link[rel='alternate'][hreflang]").length
    const preconnectCount = document.querySelectorAll("link[rel='preconnect']").length
    const preloadCount = document.querySelectorAll("link[rel='preload']").length

    const metaThemeColor =
      document.querySelector("meta[name='theme-color']")?.getAttribute('content') || null

    const titleLength = titleTag?.length || ogTitle?.length || h1Fallback?.length || null
    const descriptionLength =
      getMeta(['description'])?.length || getMeta(['og:description'])?.length || null
    const imgs = Array.from(document.querySelectorAll('img'))
    const imgCount = imgs.length
    const imgWithoutAlt = imgs.filter((img) => {
      const alt = img.getAttribute('alt')
      return alt === null || alt.trim() === ''
    }).length

    // Check robots.txt
    let robotsTxtPresent: boolean | null = null
    let robotsTxtDisallowAll: boolean | null = null
    try {
      const robotsUrl = new URL('/robots.txt', finalUrl).href
      const robotsRes = await fetch(robotsUrl, { signal: AbortSignal.timeout(3000) })
      robotsTxtPresent = robotsRes.ok
      if (robotsRes.ok) {
        const robotsText = await robotsRes.text()
        robotsTxtDisallowAll = /Disallow:\s*\/\s*$/m.test(robotsText)
      }
    } catch {
      robotsTxtPresent = null
    }

    // Check sitemap
    let sitemapPresent: boolean | null = null
    try {
      const sitemapUrl = new URL('/sitemap.xml', finalUrl).href
      const sitemapRes = await fetch(sitemapUrl, {
        method: 'HEAD',
        signal: AbortSignal.timeout(3000),
      })
      sitemapPresent = sitemapRes.ok
    } catch {
      sitemapPresent = null
    }

    return {
      title: titleTag || ogTitle || h1Fallback,
      metaDescription: getMeta(['description', 'og:description']),
      keywords: getMeta(['keywords']),
      ogImg: toAbsolute(getMeta(['og:image', 'og:image:url', 'twitter:image'])),
      h1Count: document.querySelectorAll('h1').length,
      h2Count: document.querySelectorAll('h2').length,
      robots: getMeta(['robots']),
      googlebot: getMeta(['googlebot']),
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
      cacheControl: res.headers.get('cache-control'),
      contentEncoding: res.headers.get('content-encoding'),
      contentType: res.headers.get('content-type'),
    }
  } catch (e) {
    console.error('SEO analysis error:', e)
    return undefined
  } finally {
    if (timeout) clearTimeout(timeout)
  }
}
