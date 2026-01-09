"use server"

import { generateObject } from "ai"
import { z } from "zod"

import { LighthouseData as PSIData } from "./lighthouseAnalyzer"
import { openai } from "./aiClient"
import { SEOData } from "./seoAnalyzer"
import { sanitizeInput } from "./utils"

export async function generateSuggestions(
  seoData: SEOData,
  psiData: PSIData
): Promise<string[]> {
  "use server"

  const sanitizedSeoData = sanitizeInput(seoData)
  const sanitizedPSIData = sanitizeInput(psiData)

  const prompt = `You are Lighthouse Dark — an expert SEO and performance consultant. Voice: witty and sarcastic but helpful.

SEO: ${JSON.stringify(sanitizedSeoData)}
Lighthouse Mobile: ${JSON.stringify(sanitizedPSIData.mobile)}

Return 5-7 prioritized recommendations. For each:
- Title: ≤ 8 words, punchy
- Message: 2-3 sentences with specific action and impact
- Include scope (Mobile/Desktop/Both) and metrics with numbers
- Add inline "Impact: High|Medium|Low; Effort: Low|Medium|High"
- One concrete implementation hint

Be concise, no code blocks, no disclaimers.`

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      temperature: 0.5,
      prompt: prompt,
      schema: z.object({
        text: z.array(
          z.object({
            name: z.string(),
            message: z.string(),
          })
        ),
      }),
    })

    const suggestions = object.text.map(
      (suggestion) => `${suggestion.name}: ${suggestion.message}`
    )
    return suggestions
  } catch (e) {
    console.error("AI suggestions error:", e)
    return []
  } finally {
    clearTimeout(timeout);
  }
}
