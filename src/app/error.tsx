"use client"

import { useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Home, RefreshCw, AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      {/* Animated background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute left-1/4 top-1/3 h-96 w-96 rounded-full bg-gradient-to-br from-red-500/20 to-transparent blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-orange-500/20 to-transparent blur-3xl"
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Warning Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          className="mb-6"
        >
          <motion.div
            className="flex h-28 w-28 items-center justify-center rounded-full bg-red-500/10 sm:h-36 sm:w-36"
            animate={{ 
              boxShadow: [
                "0 0 0 0 rgba(239, 68, 68, 0.4)",
                "0 0 0 20px rgba(239, 68, 68, 0)",
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <AlertTriangle className="h-14 w-14 text-red-500 sm:h-20 sm:w-20" />
          </motion.div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="space-y-3"
        >
          <h1 className="text-2xl font-bold text-light12 dark:text-dark12 sm:text-3xl">
            Something Went Wrong
          </h1>
          <p className="max-w-md text-light11 dark:text-dark11">
            Oops! Our roasting machine overheated. 
            Don&apos;t worry, we&apos;re cooling it down. Try again in a moment.
          </p>
        </motion.div>

        {/* Error digest for debugging */}
        {error.digest && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 font-mono text-xs text-light10 dark:text-dark10"
          >
            Error ID: {error.digest}
          </motion.p>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button
              onClick={reset}
              className="glass-button-primary flex items-center gap-2 px-6 py-3"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Try Again</span>
            </button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/"
              className="glass-button flex items-center gap-2 px-6 py-3"
            >
              <Home className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Fun message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.4 }}
          className="mt-12 text-sm italic text-light10 dark:text-dark10"
        >
          &quot;Even the best websites have bad days. This is ours.&quot;
        </motion.p>
      </div>
    </div>
  )
}
