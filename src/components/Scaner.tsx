"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

// Fun rotating messages during analysis
const ANALYSIS_MESSAGES = [
  { text: "Scanning your site...", emoji: "🔍" },
  { text: "Checking those Core Web Vitals...", emoji: "📊" },
  { text: "Judging your CSS choices...", emoji: "🎨" },
  { text: "Measuring that LCP...", emoji: "⏱️" },
  { text: "Finding layout shifts...", emoji: "📐" },
  { text: "Analyzing SEO signals...", emoji: "🔎" },
  { text: "Preparing the roast...", emoji: "🔥" },
  { text: "Almost there...", emoji: "⚡" },
  { text: "Crunching the numbers...", emoji: "🧮" },
  { text: "Interrogating your JavaScript...", emoji: "🕵️" },
  { text: "Rating your accessibility...", emoji: "♿" },
  { text: "Inspecting third-party scripts...", emoji: "👀" },
]

// Particle effect component for background
const ScanParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-gradient-to-r from-[#FF2574]/0 via-[#FF2574] to-[#FF2574]/0 dark:from-[#FF6B00]/0 dark:via-[#FF6B00] dark:to-[#FF6B00]/0"
          initial={{
            left: `${Math.random() * 100}%`,
            top: "-10px",
            opacity: 0,
          }}
          animate={{
            top: "100%",
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2 + Math.random(),
            repeat: Infinity,
            delay: i * 0.15,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}

const ScannerWindowAnimation = () => {
  const [messageIndex, setMessageIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Rotate messages every 2.5 seconds
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % ANALYSIS_MESSAGES.length)
    }, 2500)

    // Simulate progress (goes to 95% then waits)
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95
        return prev + Math.random() * 8
      })
    }, 500)

    return () => {
      clearInterval(messageInterval)
      clearInterval(progressInterval)
    }
  }, [])

  const currentMessage = ANALYSIS_MESSAGES[messageIndex]

  return (
    <motion.div 
      className="mt-8 flex flex-col items-center justify-center gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Browser window with enhanced effects */}
      <div className="relative w-full max-w-sm">
        {/* Glow effect background */}
        <motion.div
          className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-[#FF2574]/20 to-[#FF8AB2]/20 blur-xl dark:from-[#FF6B00]/20 dark:to-[#FFC000]/20"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Main window */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-light2 shadow-2xl dark:bg-dark2">
          {/* Title bar */}
          <div className="flex h-10 items-center gap-2 border-b border-white/10 bg-light3 px-4 dark:bg-dark3">
            <div className="flex gap-1.5">
              <motion.div 
                className="h-3 w-3 rounded-full bg-red-400/80"
                whileHover={{ scale: 1.2 }}
              />
              <motion.div 
                className="h-3 w-3 rounded-full bg-amber-400/80"
                whileHover={{ scale: 1.2 }}
              />
              <motion.div 
                className="h-3 w-3 rounded-full bg-green-400/80"
                whileHover={{ scale: 1.2 }}
              />
            </div>
            <div className="ml-2 flex-1 rounded-md bg-white/10 px-3 py-1 text-xs text-light11 dark:text-dark11 backdrop-blur-sm">
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Analyzing...
              </motion.span>
            </div>
          </div>

          {/* Content area */}
          <div className="relative h-56 p-4">
            {/* Particle effect overlay */}
            <ScanParticles />

            {/* Skeleton content */}
            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-3">
                <motion.div 
                  className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#FF2574]/30 to-[#FF8AB2]/20 dark:from-[#FF6B00]/30 dark:to-[#FFC000]/20"
                  animate={{ 
                    opacity: [0.5, 0.8, 0.5],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                />
                <motion.div 
                  className="h-4 flex-1 rounded-md bg-light4 dark:bg-dark4"
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
                />
              </div>
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="h-3 rounded-md bg-gradient-to-r from-light4 to-light4/40 dark:from-dark4 dark:to-dark4/40"
                  style={{ width: `${70 + Math.random() * 30}%` }}
                  animate={{ 
                    opacity: [0.5, 0.8, 0.5],
                    x: [0, 2, 0]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 * (i + 2) }}
                />
              ))}
              <div className="mt-4 flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="h-16 flex-1 rounded-xl bg-gradient-to-br from-light4/60 to-light4/20 dark:from-dark4/60 dark:to-dark4/20"
                    animate={{ 
                      opacity: [0.5, 0.8, 0.5],
                      y: [0, -2, 0]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 * (i + 7) }}
                  />
                ))}
              </div>
            </div>

            {/* Scanning line with enhanced glow */}
            <motion.div
              className="absolute left-0 right-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#FF2574] to-transparent shadow-[0_0_30px_#FF2574] dark:via-[#FF6B00] dark:shadow-[0_0_30px_#FF6B00]"
              animate={{
                top: ["0%", "100%"],
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </div>
        </div>
      </div>

      {/* Enhanced loading text with rotating messages */}
      <div className="flex flex-col items-center gap-3 w-full max-w-sm">
        {/* Progress bar */}
        <div className="w-full h-1.5 bg-light4 dark:bg-dark4 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#FF2574] to-[#FF8AB2] dark:from-[#FF6B00] dark:to-[#FFC000]"
            initial={{ width: "0%" }}
            animate={{ width: `${Math.min(progress, 95)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Rotating message */}
        <div className="h-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={messageIndex}
              className="flex items-center gap-2 text-sm text-light11 dark:text-dark11"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <motion.span
                className="text-lg"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                {currentMessage.emoji}
              </motion.span>
              <span>{currentMessage.text}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pulsing indicator */}
        <motion.div
          className="flex items-center gap-2 text-xs text-light11/60 dark:text-dark11/60"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            className="relative h-1.5 w-1.5"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            <div className="absolute inset-0 rounded-full bg-[#FF2574] dark:bg-[#FF6B00]" />
            <motion.div
              className="absolute inset-0 rounded-full bg-[#FF2574]/40 dark:bg-[#FF6B00]/40"
              animate={{ scale: [1, 2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          </motion.div>
          <span>This usually takes 10-30 seconds</span>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default ScannerWindowAnimation
