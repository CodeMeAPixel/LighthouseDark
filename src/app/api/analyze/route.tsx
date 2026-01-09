import { NextRequest, NextResponse } from "next/server"

import { generateSuggestions } from "@/app/lib/aiSuggestions"
import { analyzeLighthouse } from "@/app/lib/lighthouseAnalyzer"
import { checkRateLimit } from "@/app/lib/rateLimiter"
import { analyzeSEO } from "@/app/lib/seoAnalyzer"
import { isValidUrl, sanitizeInput, normalizeUrl } from "@/app/lib/utils"

// Simple in-memory cache with TTL (60 seconds)
interface CacheEntry {
  data: any
  timestamp: number
}
const analysisCache = new Map<string, CacheEntry>();
const CACHE_TTL = 60000; // 60 seconds

function getCachedResult(url: string) {
  const cached = analysisCache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  analysisCache.delete(url);
  return null;
}

function setCachedResult(url: string, data: any) {
  analysisCache.set(url, { data, timestamp: Date.now() });
}

async function handleRequest(url: string, ip: string) {
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })
  }

  if (!url || !isValidUrl(url)) {
    return NextResponse.json({ error: "Invalid URL provided" }, { status: 400 })
  }

  // Normalize URL (add protocol if missing)
  const normalizedUrl = normalizeUrl(url.trim());
  const sanitizedUrl = sanitizeInput(normalizedUrl)

  // Check cache first
  const cached = getCachedResult(sanitizedUrl);
  if (cached) {
    return NextResponse.json(cached);
  }

  const [seoData, psiData] = await Promise.all([
    analyzeSEO(sanitizedUrl),
    analyzeLighthouse(sanitizedUrl),
  ])

  const suggestions = await generateSuggestions(seoData!, psiData!)

  const result = { seoData, psiData, suggestions };
  setCachedResult(sanitizedUrl, result);

  return NextResponse.json(result)
}

export async function GET(request: NextRequest) {
  const ip = request.ip || "unknown"
  const url = request.nextUrl.searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "No URL provided" }, { status: 400 })
  }

  try {
    return await handleRequest(url, ip)
  } catch (error) {
    console.error("Error during analysis:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const ip = request.ip || "unknown"

  try {
    const { url } = await request.json()
    return await handleRequest(url, ip)
  } catch (error) {
    console.error("Error during analysis:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
