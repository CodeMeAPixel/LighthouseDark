import type { LighthouseData } from './lighthouseAnalyzer'
import type { SEOData } from './seoAnalyzer'
import type { AISuggestion, SlopIndicator } from './aiSuggestions'

export interface AnalysisResult {
  seo: SEOData | null
  lighthouse: LighthouseData | null
  aiSuggestions: AISuggestion[]
  slopIndicators: SlopIndicator[]
}
