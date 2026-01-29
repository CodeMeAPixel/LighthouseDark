'use client'

import { useState, useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'

import { useUrlStore } from '@/lib/store'
import { normalizeUrl } from '@/lib/app-utils'
import { analyzeUrl } from '@/routes/-api.analyze'
import ResultsDisplay from './ResultsDisplay'
import Scanner from './Scanner'
import type { AnalysisResult } from '@/lib/types'

interface AnalyzerFormProps {
  minLoadingTime?: number
}

export default function AnalyzerForm({ minLoadingTime = 3000 }: AnalyzerFormProps) {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isFocused, setIsFocused] = useState(false)

  const { currentUrl, results, setUrl: updateStoreUrl, setResults, clearResults } = useUrlStore()

  const navigate = useNavigate()
  const startRef = useRef(0)

  const mutation = useMutation({
    mutationKey: ['analyze'],
    mutationFn: async (urlToAnalyze: string): Promise<AnalysisResult> => {
      const response = await analyzeUrl({ data: { url: urlToAnalyze } })
      if (response && 'error' in response) {
        throw new Error(response.error)
      }
      if (!response) {
        throw new Error('No response from server')
      }
      return response as AnalysisResult
    },
    onSuccess: async (data, urlToAnalyze) => {
      setError(null)
      setResults(data)
      updateStoreUrl(urlToAnalyze)
      const elapsedTime = Date.now() - (startRef.current || Date.now())
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime)
      await new Promise((r) => setTimeout(r, remainingTime))
      setIsLoading(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 1500)
      setShowResults(true)
      navigate({ to: '/', search: { url: urlToAnalyze } })
    },
    onError: (err: Error) => {
      console.error('Error:', err)
      setError(err.message)
      clearResults()
      setIsLoading(false)
      setShowResults(false)
    },
  })

  const handleAnalysis = async (urlToAnalyze: string) => {
    setError(null)
    setIsLoading(true)
    setShowResults(false)
    updateStoreUrl(urlToAnalyze)
    startRef.current = Date.now()
    mutation.mutate(urlToAnalyze)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return
    const normalizedUrl = normalizeUrl(url)
    handleAnalysis(normalizedUrl)
  }

  return (
    <div>
      <AnimatePresence mode="wait">
        {!currentUrl && (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="mx-auto mt-8 flex max-w-[580px] flex-col gap-3"
          >
            <motion.fieldset
              className={`relative flex w-full gap-2 rounded-2xl p-2.5 glass-surface transition-all duration-300 ${
                isFocused ? 'ring-2 ring-[#FF2574]/20 dark:ring-[#FF6B00]/20' : ''
              }`}
              animate={{ scale: isFocused ? 1.01 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2">
                <Search className="h-4 w-4 text-light11 dark:text-dark11" />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Enter website URL (e.g., example.com)"
                className="h-[44px] w-full flex-1 rounded-xl pl-10 pr-28 font-sans text-sm transition-all duration-200 glass-input"
                required
                aria-label="Website URL to analyze"
              />
              <motion.button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-[36px] min-w-[100px] items-center justify-center gap-2 overflow-hidden glass-button-primary disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoading || !url.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.span
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <motion.div
                        className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      <span className="text-[13px]">Analyzing</span>
                    </motion.span>
                  ) : (
                    <motion.span
                      key="analyze"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1.5 text-[13px] font-semibold"
                    >
                      Roast It
                      <ArrowRight className="h-3.5 w-3.5" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.fieldset>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400"
                >
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-center text-xs text-light11 dark:text-dark11">
              Paste any public URL to get a detailed SEO and performance analysis
            </p>
          </motion.form>
        )}
      </AnimatePresence>

      {isLoading && <Scanner />}

      {/* Success toast notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed top-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-xl bg-green-500/90 px-5 py-3 shadow-xl backdrop-blur-sm dark:bg-green-600/90"
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 400 }}
            >
              <CheckCircle2 className="h-5 w-5 text-white" />
            </motion.div>
            <span className="font-medium text-white">Analysis complete! 🚀</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showResults && results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ResultsDisplay results={results} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
