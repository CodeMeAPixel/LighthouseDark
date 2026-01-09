import { LighthouseData as PSIData } from "@/app/lib/lighthouseAnalyzer"
import { SEOData } from "@/app/lib/seoAnalyzer"

export interface AnalysisResult {
  seoData: SEOData
  psiData: PSIData
  suggestions: string[]
}
