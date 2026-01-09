"use client"

import { motion, AnimatePresence } from "framer-motion"
import * as Tabs from "@radix-ui/react-tabs"
import { BarChart3, Sparkles, TrendingUp } from "lucide-react"

import AISuggestions from "@/components/AISuggestions"
import SEOAnalysis from "@/components/SEOAnalysis"
import LighthouseSummary from "@/components/LighthouseSummary"
import { AnalysisResult } from "@/app/types"

interface ResultsDisplayProps {
  results: AnalysisResult
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  const { seoData, psiData, suggestions } = results

  const suggestionsArray = Array.isArray(suggestions) ? suggestions : []

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header with enhanced visual */}
      <motion.div 
        className="my-6 flex items-center justify-center gap-4 md:my-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#FF2574]/50 to-transparent dark:via-[#FF6B00]/50" />
        <motion.div
          className="flex items-center gap-3"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <TrendingUp className="h-5 w-5 text-[#FF2574] dark:text-[#FF6B00]" />
          </motion.div>
          <h2 className="text-center text-xl font-bold md:text-2xl">Analysis Results</h2>
        </motion.div>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#FF2574]/50 to-transparent dark:via-[#FF6B00]/50" />
      </motion.div>

      <div className="flex flex-row gap-4">
        <Tabs.Root className="flex w-full flex-col" defaultValue="seo">
          <Tabs.List
            className="glass-tabbar mb-1 flex shrink-0 gap-1 rounded-xl p-1.5 bg-gradient-to-r from-white/5 to-white/2 dark:from-white/5 dark:to-white/2"
            aria-label="Analysis results tabs"
          >
            <Tabs.Trigger
              className="group relative flex h-[44px] flex-1 cursor-pointer select-none items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium outline-none transition-all duration-200 data-[state=active]:cursor-default data-[state=inactive]:hover:bg-white/10"
              value="seo"
            >
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <BarChart3 className="h-4 w-4" />
              </motion.div>
              <span>Web Vitals</span>
              <span className="absolute inset-0 rounded-lg bg-[#FF2574]/10 opacity-0 transition-opacity group-data-[state=active]:opacity-100 dark:bg-[#FF6B00]/10" />
              <motion.span 
                className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#FF2574] to-[#FF8AB2] transition-all duration-500 group-data-[state=active]:w-12 dark:from-[#FF6B00] dark:to-[#FFC000]"
                layoutId="tab-underline"
              />
            </Tabs.Trigger>
            <Tabs.Trigger
              className="group relative flex h-[44px] flex-1 cursor-pointer select-none items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium outline-none transition-all duration-200 data-[state=active]:cursor-default data-[state=inactive]:hover:bg-white/10"
              value="ai"
            >
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className="h-4 w-4" />
              </motion.div>
              <span>AI Roast</span>
              <span className="absolute inset-0 rounded-lg bg-[#FF2574]/10 opacity-0 transition-opacity group-data-[state=active]:opacity-100 dark:bg-[#FF6B00]/10" />
              <motion.span 
                className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#FF2574] to-[#FF8AB2] transition-all duration-500 group-data-[state=active]:w-12 dark:from-[#FF6B00] dark:to-[#FFC000]"
                layoutId="tab-underline"
              />
            </Tabs.Trigger>
          </Tabs.List>

          <AnimatePresence mode="wait">
            <Tabs.Content
              key="seo-content"
              className="grow rounded-xl p-5 outline-none glass-surface"
              value="seo"
              asChild
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col gap-6">
                  {seoData ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <SEOAnalysis data={seoData} />
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="rounded-xl bg-amber-500/10 p-4 text-center text-amber-600 dark:text-amber-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      No SEO data available
                    </motion.div>
                  )}
                  {psiData ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <LighthouseSummary data={psiData} />
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="rounded-xl bg-amber-500/10 p-4 text-center text-amber-600 dark:text-amber-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      No Lighthouse data available
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </Tabs.Content>

            <Tabs.Content
              key="ai-content"
              className="grow rounded-xl p-5 outline-none glass-surface"
              value="ai"
              asChild
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {suggestionsArray.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <AISuggestions suggestions={suggestionsArray} />
                  </motion.div>
                ) : (
                  <motion.div 
                    className="rounded-xl bg-amber-500/10 p-4 text-center text-amber-600 dark:text-amber-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    No suggestions available
                  </motion.div>
                )}
              </motion.div>
            </Tabs.Content>
          </AnimatePresence>
        </Tabs.Root>
      </div>
    </motion.div>
  )
}
