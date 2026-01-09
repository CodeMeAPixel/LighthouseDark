"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Home, RefreshCw, ServerCrash } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body className="bg-light1 text-light12 dark:bg-dark1 dark:text-dark12">
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
          {/* Animated background elements */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute left-1/4 top-1/3 h-96 w-96 rounded-full bg-gradient-to-br from-red-600/30 to-transparent blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-1/3 right-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-orange-600/30 to-transparent blur-3xl"
              animate={{
                scale: [1.3, 1, 1.3],
                opacity: [0.6, 0.4, 0.6],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Server Crash Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
              className="mb-6"
            >
              <motion.div
                className="flex h-32 w-32 items-center justify-center rounded-full bg-red-500/20 sm:h-40 sm:w-40"
                animate={{
                  rotate: [0, -5, 5, -5, 0],
                }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
              >
                <ServerCrash className="h-16 w-16 text-red-500 sm:h-20 sm:w-20" />
              </motion.div>
            </motion.div>

            {/* Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="space-y-3"
            >
              <h1 className="text-2xl font-bold sm:text-4xl">
                Critical Error
              </h1>
              <p className="max-w-md opacity-70">
                Our servers decided to take an unscheduled break. 
                We&apos;re working on getting them back to roasting websites.
              </p>
            </motion.div>

            {/* Error digest */}
            {error.digest && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 font-mono text-xs opacity-50"
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
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={reset}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF2574] to-[#FF8AB2] px-6 py-3 font-semibold text-white shadow-lg"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Try Again</span>
              </motion.button>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/"
                  className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 font-semibold backdrop-blur-sm"
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
              className="mt-12 text-sm italic opacity-50"
            >
              &quot;Houston, we have a problem.&quot;
            </motion.p>
          </div>
        </div>
      </body>
    </html>
  )
}
