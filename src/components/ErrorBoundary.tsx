'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, Home, Flame, Bug, ExternalLink, Zap, AlertTriangle } from 'lucide-react'
import { Link } from '@tanstack/react-router'

interface ErrorBoundaryProps {
  error: Error
  reset?: () => void
  statusCode?: number
}

export default function ErrorBoundary({ error, reset, statusCode }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error('Error boundary caught:', error)
  }, [error])

  const isServerError = statusCode && statusCode >= 500
  const errorId = Date.now().toString(36).toUpperCase()

  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center px-4 py-16">
      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Flame icon with status */}
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          <motion.div
            className="relative"
            animate={{
              rotate: [0, 3, -3, 0],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatDelay: 2,
            }}
          >
            {/* Broken/tilted flame */}
            <div className="relative">
              <Flame className="h-24 w-24 text-red-500 drop-shadow-[0_0_40px_rgba(239,68,68,0.5)] md:h-32 md:w-32" strokeWidth={1.5} />
              <motion.div
                className="absolute inset-0"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Flame className="h-24 w-24 text-orange-400/40 blur-sm md:h-32 md:w-32" strokeWidth={1.5} />
              </motion.div>
              {/* Crack/warning overlay */}
              <motion.div
                className="absolute bottom-1 right-1"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <AlertTriangle className="h-6 w-6 text-yellow-400 drop-shadow-lg" />
              </motion.div>
            </div>
          </motion.div>

          {/* Status code */}
          {statusCode && (
            <motion.div
              className="absolute -bottom-4 left-1/2 -translate-x-1/2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-4xl font-black tracking-tight text-red-500 drop-shadow-lg md:text-5xl">
                {statusCode}
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Title */}
        <motion.h1
          className="mb-3 mt-4 bg-gradient-to-r from-red-400 via-orange-400 to-red-400 bg-clip-text text-center text-3xl font-bold text-transparent md:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {isServerError ? 'Server Meltdown' : 'Something Caught Fire'}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="mb-8 max-w-md text-center text-light11 dark:text-dark11"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {isServerError
            ? "Our servers got a bit too hot. We're cooling things down!"
            : "An unexpected spark caused this error. Don't worry, we're on it."}
        </motion.p>

        {/* Error details */}
        <motion.details
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 w-full max-w-lg"
        >
          <summary className="glass-surface group cursor-pointer rounded-xl p-4 transition-all hover:bg-white/10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                <Bug className="h-5 w-5 text-red-400" />
              </div>
              <div className="flex-1">
                <span className="font-semibold text-red-400">View Error Details</span>
                <p className="text-xs text-light10 dark:text-dark10">Click to expand technical information</p>
              </div>
              <Zap className="h-4 w-4 text-red-400 transition-transform group-open:rotate-90" />
            </div>
          </summary>
          <div className="mt-3 rounded-xl border border-red-500/10 bg-black/20 p-4">
            <p className="mb-2 text-sm font-medium text-red-300">
              {error.name}: {error.message}
            </p>
            {error.stack && (
              <pre className="max-h-32 overflow-auto rounded-lg bg-black/40 p-3 text-xs text-light10 dark:text-dark10">
                {error.stack}
              </pre>
            )}
          </div>
        </motion.details>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {reset && (
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-6 py-3 font-semibold text-white shadow-lg shadow-red-500/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-red-500/30"
            >
              <RefreshCw className="h-5 w-5" />
              Try Again
            </button>
          )}

          <Link
            to="/"
            className="glass-surface inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-light12 transition-all hover:bg-white/10 dark:text-dark12"
          >
            <Home className="h-5 w-5" />
            Back to Home
          </Link>
        </motion.div>

        {/* Report link */}
        <motion.a
          href="https://github.com/CodeMeAPixel/LighthouseDark/issues/new"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="glass-surface-soft mt-8 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm text-light11 transition-all hover:bg-white/10 hover:text-red-400 dark:text-dark11"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Report this issue on GitHub
        </motion.a>

        {/* Footer with error ID */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-xs text-light10 dark:text-dark10"
        >
          Error ID: <code className="rounded bg-red-500/10 px-2 py-0.5 font-mono text-red-400">{errorId}</code>
        </motion.p>
      </motion.div>
    </div>
  )
}
