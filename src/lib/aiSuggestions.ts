import { generateObject } from 'ai'
import { z } from 'zod'

import type { LighthouseData, LighthouseMetrics } from './lighthouseAnalyzer'
import type { SEOData } from './seoAnalyzer'
import { getOpenAI } from './aiClient'

export interface AISuggestion {
  name: string
  message: string
  impact: 'high' | 'medium' | 'low'
  effort: 'low' | 'medium' | 'high'
  category: 'performance' | 'seo' | 'accessibility' | 'best-practices' | 'content'
}

interface AnalysisInput {
  url: string
  seo: SEOData | null
  lighthouse: LighthouseData | null
}

interface CompressedIssue {
  type: string
  value?: string | number | boolean | null
  threshold?: number
  scope?: 'mobile' | 'desktop' | 'both'
}

export interface SlopIndicator {
  type: string
  evidence: string
  severity: 'high' | 'medium' | 'low'
}

/**
 * Detect common "slop" - low-quality, generic, or AI-generated content indicators
 */
export function detectSlop(seo: SEOData | null): SlopIndicator[] {
  const indicators: SlopIndicator[] = []

  if (!seo) return indicators

  // Generic/template title patterns
  const genericTitlePatterns = [
    /^home\s*[-|]\s*/i,
    /^welcome to/i,
    /^untitled/i,
    /lorem ipsum/i,
    /\{\{.*\}\}/,
    /\[\[.*\]\]/,
    /^page \d+/i,
    /^my site/i,
    /^website$/i,
  ]

  if (seo.title) {
    for (const pattern of genericTitlePatterns) {
      if (pattern.test(seo.title)) {
        indicators.push({
          type: 'generic-title',
          evidence: seo.title.slice(0, 50),
          severity: 'high',
        })
        break
      }
    }
  }

  // Missing or placeholder meta description
  const genericDescPatterns = [
    /lorem ipsum/i,
    /\{\{.*\}\}/,
    /\[\[.*\]\]/,
    /^description$/i,
    /^enter.*description/i,
    /^add.*description/i,
    /^this is.*website/i,
    /^welcome to our/i,
  ]

  if (seo.metaDescription) {
    for (const pattern of genericDescPatterns) {
      if (pattern.test(seo.metaDescription)) {
        indicators.push({
          type: 'generic-description',
          evidence: seo.metaDescription.slice(0, 50),
          severity: 'high',
        })
        break
      }
    }

    // AI-generated content markers (overuse of certain phrases)
    const aiPatterns = [
      /\bin today's digital age\b/i,
      /\bin this article, we will\b/i,
      /\bit's important to note that\b/i,
      /\blet's dive in\b/i,
      /\bwithout further ado\b/i,
      /\bin conclusion,\b/i,
      /\ball in all,\b/i,
      /\bgame-?changer\b/i,
      /\bunlock the (power|potential|secrets)\b/i,
      /\btake .* to the next level\b/i,
      /\brevolutionize your\b/i,
    ]

    for (const pattern of aiPatterns) {
      if (pattern.test(seo.metaDescription)) {
        indicators.push({
          type: 'ai-content-markers',
          evidence: 'Meta description contains common AI-generated phrases',
          severity: 'medium',
        })
        break
      }
    }
  }

  // Stock image indicators in OG image URLs
  if (seo.ogImg) {
    const stockImagePatterns = [
      /unsplash\.com/i,
      /pexels\.com/i,
      /shutterstock/i,
      /istockphoto/i,
      /gettyimages/i,
      /stock-?photo/i,
      /placeholder/i,
      /via\.placeholder/i,
      /placehold\.it/i,
      /picsum\.photos/i,
      /dummyimage/i,
    ]

    for (const pattern of stockImagePatterns) {
      if (pattern.test(seo.ogImg)) {
        indicators.push({
          type: 'stock-og-image',
          evidence: 'OG image appears to be from stock photo site',
          severity: 'low',
        })
        break
      }
    }
  }

  // Missing essential elements
  if (!seo.title || seo.titleLength === 0) {
    indicators.push({ type: 'missing-title', evidence: 'No title tag', severity: 'high' })
  }

  if (!seo.metaDescription || seo.descriptionLength === 0) {
    indicators.push({ type: 'missing-description', evidence: 'No meta description', severity: 'high' })
  }

  if (seo.h1Count === 0) {
    indicators.push({ type: 'missing-h1', evidence: 'No H1 heading', severity: 'high' })
  } else if (seo.h1Count > 1) {
    indicators.push({ type: 'multiple-h1', evidence: `${seo.h1Count} H1 tags`, severity: 'medium' })
  }

  // Keyword stuffing indicator (same word repeated in title/description)
  if (seo.title && seo.metaDescription) {
    const words = seo.title.toLowerCase().split(/\s+/).filter(w => w.length > 4)
    const descWords = seo.metaDescription.toLowerCase()
    const repeated = words.filter(w => {
      const regex = new RegExp(`\\b${w}\\b`, 'gi')
      const matches = descWords.match(regex)
      return matches && matches.length > 3
    })
    if (repeated.length > 0) {
      indicators.push({
        type: 'keyword-stuffing',
        evidence: `Word "${repeated[0]}" repeated excessively`,
        severity: 'medium',
      })
    }
  }

  return indicators
}

/**
 * Compress data to only include problematic/noteworthy fields
 * This dramatically reduces token usage
 */
function compressForAI(seo: SEOData | null, lighthouse: LighthouseData | null): CompressedIssue[] {
  const issues: CompressedIssue[] = []

  if (seo) {
    // Title issues
    if (!seo.title) {
      issues.push({ type: 'no-title' })
    } else if (seo.titleLength && seo.titleLength < 30) {
      issues.push({ type: 'short-title', value: seo.titleLength, threshold: 30 })
    } else if (seo.titleLength && seo.titleLength > 60) {
      issues.push({ type: 'long-title', value: seo.titleLength, threshold: 60 })
    }

    // Description issues
    if (!seo.metaDescription) {
      issues.push({ type: 'no-meta-desc' })
    } else if (seo.descriptionLength && seo.descriptionLength < 120) {
      issues.push({ type: 'short-desc', value: seo.descriptionLength, threshold: 120 })
    } else if (seo.descriptionLength && seo.descriptionLength > 160) {
      issues.push({ type: 'long-desc', value: seo.descriptionLength, threshold: 160 })
    }

    // Heading issues
    if (seo.h1Count === 0) issues.push({ type: 'no-h1' })
    if (seo.h1Count > 1) issues.push({ type: 'multi-h1', value: seo.h1Count })
    if (seo.h2Count === 0) issues.push({ type: 'no-h2' })

    // Image issues
    if (seo.imgWithoutAlt > 0) {
      issues.push({ type: 'missing-alt', value: seo.imgWithoutAlt })
    }

    // Technical SEO
    if (!seo.canonical) issues.push({ type: 'no-canonical' })
    if (seo.canonical && !seo.canonicalIsSelf) issues.push({ type: 'canonical-mismatch' })
    if (!seo.viewport) issues.push({ type: 'no-viewport' })
    if (seo.viewport && !seo.viewportIsResponsive) issues.push({ type: 'bad-viewport' })
    if (!seo.hasOgBasic) issues.push({ type: 'incomplete-og' })
    if (!seo.hasTwitterCard) issues.push({ type: 'no-twitter-card' })
    if (!seo.lang) issues.push({ type: 'no-lang' })
    if (!seo.hasFavicon) issues.push({ type: 'no-favicon' })
    if (seo.jsonLdCount === 0) issues.push({ type: 'no-schema' })
    if (seo.indexable === false) issues.push({ type: 'noindex' })
    if (seo.robotsTxtPresent === false) issues.push({ type: 'no-robots-txt' })
    if (seo.robotsTxtDisallowAll) issues.push({ type: 'robots-disallow-all' })
    if (seo.sitemapPresent === false) issues.push({ type: 'no-sitemap' })

    // Performance hints from headers
    if (!seo.contentEncoding || !seo.contentEncoding.includes('gzip')) {
      issues.push({ type: 'no-compression' })
    }
  }

  if (lighthouse) {
    const addMetricIssue = (
      metrics: LighthouseMetrics,
      scope: 'mobile' | 'desktop'
    ) => {
      // Performance score
      if (metrics.performanceScore !== null && metrics.performanceScore < 50) {
        issues.push({ type: 'poor-perf', value: metrics.performanceScore, scope })
      } else if (metrics.performanceScore !== null && metrics.performanceScore < 90) {
        issues.push({ type: 'avg-perf', value: metrics.performanceScore, scope })
      }

      // Core Web Vitals
      if (metrics.lcp !== null && metrics.lcp > 2500) {
        issues.push({ type: 'slow-lcp', value: metrics.lcp, threshold: 2500, scope })
      }
      if (metrics.cls !== null && metrics.cls > 0.1) {
        issues.push({ type: 'high-cls', value: metrics.cls, threshold: 0.1, scope })
      }
      if (metrics.fcp !== null && metrics.fcp > 1800) {
        issues.push({ type: 'slow-fcp', value: metrics.fcp, threshold: 1800, scope })
      }
      if (metrics.tbt !== null && metrics.tbt > 200) {
        issues.push({ type: 'high-tbt', value: metrics.tbt, threshold: 200, scope })
      }
      if (metrics.ttfb !== null && metrics.ttfb > 800) {
        issues.push({ type: 'slow-ttfb', value: metrics.ttfb, threshold: 800, scope })
      }

      // Accessibility
      if (metrics.accessibilityScore !== null && metrics.accessibilityScore < 90) {
        issues.push({ type: 'a11y-issues', value: metrics.accessibilityScore, scope })
      }

      // Best practices
      if (metrics.bestPracticesScore !== null && metrics.bestPracticesScore < 90) {
        issues.push({ type: 'bp-issues', value: metrics.bestPracticesScore, scope })
      }

      // Resource issues
      if (metrics.totalByteWeight && metrics.totalByteWeight > 3000000) {
        issues.push({ type: 'heavy-page', value: Math.round(metrics.totalByteWeight / 1024), scope })
      }
      if (metrics.networkRequests && metrics.networkRequests > 100) {
        issues.push({ type: 'many-requests', value: metrics.networkRequests, scope })
      }

      // Top opportunities
      if (metrics.opportunities.length > 0) {
        const topOpp = metrics.opportunities[0]
        if (topOpp.savingsMs > 500) {
          issues.push({ type: 'opportunity', value: `${topOpp.id}:${topOpp.savingsMs}ms`, scope })
        }
      }

      // Third-party bloat
      const totalThirdParty = metrics.thirdPartySummary.reduce((sum, tp) => sum + tp.bytes, 0)
      if (totalThirdParty > 500000) {
        issues.push({ type: '3p-bloat', value: Math.round(totalThirdParty / 1024), scope })
      }
    }

    addMetricIssue(lighthouse.mobile, 'mobile')
    addMetricIssue(lighthouse.desktop, 'desktop')
  }

  return issues
}

/**
 * Format issues into a compact string for the AI prompt
 */
function formatIssuesCompact(issues: CompressedIssue[]): string {
  if (issues.length === 0) return 'No critical issues detected.'

  // Group by scope
  const grouped: Record<string, string[]> = { both: [], mobile: [], desktop: [] }

  for (const issue of issues) {
    const scope = issue.scope || 'both'
    let str = issue.type
    if (issue.value !== undefined) str += `=${issue.value}`
    if (issue.threshold !== undefined) str += `(>${issue.threshold})`
    grouped[scope].push(str)
  }

  const parts: string[] = []
  if (grouped.both.length) parts.push(`General: ${grouped.both.join(', ')}`)
  if (grouped.mobile.length) parts.push(`Mobile: ${grouped.mobile.join(', ')}`)
  if (grouped.desktop.length) parts.push(`Desktop: ${grouped.desktop.join(', ')}`)

  return parts.join(' | ')
}

/**
 * Format slop indicators for the prompt
 */
function formatSlopCompact(slop: SlopIndicator[]): string {
  if (slop.length === 0) return ''

  const high = slop.filter(s => s.severity === 'high').map(s => s.type)
  const med = slop.filter(s => s.severity === 'medium').map(s => s.type)

  const parts: string[] = []
  if (high.length) parts.push(`Critical: ${high.join(', ')}`)
  if (med.length) parts.push(`Warning: ${med.join(', ')}`)

  return parts.join(' | ')
}

export async function generateAISuggestions(input: AnalysisInput): Promise<AISuggestion[]> {
  if (!input.seo && !input.lighthouse) {
    return []
  }

  // Pre-process: compress data and detect slop
  const issues = compressForAI(input.seo, input.lighthouse)
  const slop = detectSlop(input.seo)
  const issuesStr = formatIssuesCompact(issues)
  const slopStr = formatSlopCompact(slop)

  // Get key scores for context
  const mobilePerf = input.lighthouse?.mobile.performanceScore ?? '?'
  const desktopPerf = input.lighthouse?.desktop.performanceScore ?? '?'
  const seoScore = input.lighthouse?.mobile.seoScore ?? '?'
  const a11yScore = input.lighthouse?.mobile.accessibilityScore ?? '?'

  // Build compact prompt
  const prompt = `You are Lighthouse Dark — a brutally honest SEO & performance expert. Be witty but useful.

URL: ${input.url}
Scores: Perf M${mobilePerf}/D${desktopPerf}, SEO ${seoScore}, A11y ${a11yScore}
Issues: ${issuesStr}${slopStr ? `\nQuality: ${slopStr}` : ''}

Give exactly 5 prioritized recommendations. Each must have:
- name: ≤6 words, punchy (e.g., "Fix Your Embarrassingly Slow LCP")
- message: 1-2 sentences with specific action, affected metric, and expected improvement. No fluff.
- impact: high|medium|low
- effort: low|medium|high  
- category: performance|seo|accessibility|best-practices|content

Focus on high-impact issues first. If quality issues exist, address content problems.
Be specific with numbers. No generic advice.`

  try {
    const { object } = await generateObject({
      model: getOpenAI()('gpt-4o-mini'),
      temperature: 0.6,
      maxTokens: 800,
      prompt,
      schema: z.object({
        suggestions: z.array(
          z.object({
            name: z.string().max(60),
            message: z.string().max(200),
            impact: z.enum(['high', 'medium', 'low']),
            effort: z.enum(['low', 'medium', 'high']),
            category: z.enum(['performance', 'seo', 'accessibility', 'best-practices', 'content']),
          })
        ).max(5),
      }),
    })

    return object.suggestions
  } catch (e) {
    console.error('AI suggestions error:', e)

    // Return fallback suggestions based on detected issues
    return generateFallbackSuggestions(issues, slop)
  }
}

/**
 * Generate basic suggestions without AI if the API fails
 */
function generateFallbackSuggestions(
  issues: CompressedIssue[],
  slop: SlopIndicator[]
): AISuggestion[] {
  const suggestions: AISuggestion[] = []

  const issueMap: Record<string, Omit<AISuggestion, 'name'> & { name: string }> = {
    'no-title': {
      name: 'Add a Title Tag ASAP',
      message: 'Your page has no title tag. This is SEO 101 — search engines need this to understand your page.',
      impact: 'high',
      effort: 'low',
      category: 'seo',
    },
    'no-meta-desc': {
      name: 'Write a Meta Description',
      message: 'No meta description means Google will pick random text from your page. Take control of your snippet.',
      impact: 'high',
      effort: 'low',
      category: 'seo',
    },
    'slow-lcp': {
      name: 'Fix Your Slow LCP',
      message: 'Your largest content takes too long to paint. Optimize images, add preload hints, or use a CDN.',
      impact: 'high',
      effort: 'medium',
      category: 'performance',
    },
    'high-cls': {
      name: 'Stop the Layout Shifts',
      message: 'Elements are jumping around as your page loads. Add explicit dimensions to images and embeds.',
      impact: 'high',
      effort: 'medium',
      category: 'performance',
    },
    'missing-alt': {
      name: 'Add Alt Text to Images',
      message: 'Images without alt text hurt accessibility and SEO. Describe what each image shows.',
      impact: 'medium',
      effort: 'low',
      category: 'accessibility',
    },
    'no-schema': {
      name: 'Add Structured Data',
      message: 'No JSON-LD schema found. Add structured data to get rich results in search.',
      impact: 'medium',
      effort: 'medium',
      category: 'seo',
    },
  }

  // Add suggestions for detected issues
  for (const issue of issues) {
    if (issueMap[issue.type] && suggestions.length < 5) {
      suggestions.push(issueMap[issue.type])
    }
  }

  // Add slop-based suggestions
  for (const s of slop) {
    if (suggestions.length >= 5) break

    if (s.type === 'generic-title' || s.type === 'generic-description') {
      suggestions.push({
        name: 'Ditch the Template Content',
        message: 'Your content looks auto-generated or uses placeholders. Write unique, specific copy.',
        impact: 'high',
        effort: 'medium',
        category: 'content',
      })
      break
    }
    if (s.type === 'ai-content-markers') {
      suggestions.push({
        name: 'Make It Sound Human',
        message: 'Your content has telltale AI-generated phrases. Edit for authenticity and brand voice.',
        impact: 'medium',
        effort: 'medium',
        category: 'content',
      })
      break
    }
  }

  return suggestions.slice(0, 5)
}

