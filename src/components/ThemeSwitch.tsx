"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"

export const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  const otherTheme = theme === "dark" ? "light" : "dark"

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex h-8 w-8 items-center justify-center">
        <div className="h-4 w-4 animate-pulse rounded-full bg-light4 dark:bg-dark4" />
      </div>
    )
  }

  const handleButtonClick = () => {
    setTheme(otherTheme)
  }

  return (
    <motion.button
      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-light12 transition-colors hover:bg-white/20 dark:text-dark12 dark:hover:bg-white/10"
      aria-label={`Switch to ${otherTheme} theme`}
      onClick={handleButtonClick}
      whileTap={{ scale: 0.9 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === "dark" ? (
          <motion.div
            key="moon"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Moon size={16} className="fill-dark12" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Sun size={16} className="fill-light12 stroke-light12" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
