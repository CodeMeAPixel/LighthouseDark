import { create } from 'zustand'
import type { AnalysisResult } from './types'

interface UrlState {
  currentUrl: string | null
  results: AnalysisResult | null
  isLoading: boolean
  error: string | null
}

interface UrlActions {
  setUrl: (url: string) => void
  setResults: (results: AnalysisResult) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  clearResults: () => void
}

export const useUrlStore = create<UrlState & UrlActions>((set) => ({
  currentUrl: null,
  results: null,
  isLoading: false,
  error: null,

  setUrl: (url: string) => {
    set({ currentUrl: url })
  },

  setResults: (results: AnalysisResult) => {
    set({ results })
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading })
  },

  setError: (error: string | null) => {
    set({ error })
  },

  clearResults: () => {
    set({
      currentUrl: null,
      results: null,
      isLoading: false,
      error: null,
    })
  },
}))

export default useUrlStore
