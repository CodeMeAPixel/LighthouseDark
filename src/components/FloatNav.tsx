"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { Trash2, Home, Info, HelpCircle, AlertTriangle } from "lucide-react"
import { FaGithub, FaDiscord, FaXTwitter } from "react-icons/fa6"

import useUrlStore from "@/components/AppContext"
import { ThemeSwitch } from "@/components/ThemeSwitch"

export function FloatNav() {
  const currentUrl = useUrlStore((state) => state.currentUrl)
  const clearState = useUrlStore((state) => state.clearState)
  const router = useRouter()

  const handleClick = () => {
    clearState()
    router.push("/", undefined)
    router.refresh()
  }

  const formattedUrl = currentUrl
    ? currentUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : ""

  return (
    <motion.nav 
      className="fixed bottom-5 right-3.5 z-50 flex -translate-x-1/2 items-center justify-center gap-1 rounded-2xl border border-white/15 bg-white/40 px-2 py-2 shadow-lg backdrop-blur-2xl transition dark:border-white/10 dark:bg-white/5 sm:gap-2 sm:px-3 sm:py-2.5"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
    >
      {/* URL Button - hidden on smallest screens */}
      <AnimatePresence>
        {currentUrl && (
          <motion.button
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative flex cursor-pointer items-center gap-2 overflow-hidden rounded-xl bg-[#FF2574]/10 px-3 py-1.5 font-mono text-[12px] text-[#FF2574] transition-all hover:bg-[#FF2574]/20 dark:bg-[#FF6B00]/10 dark:text-[#FF6B00] dark:hover:bg-[#FF6B00]/20"
            onClick={handleClick}
            aria-label="Clear current analysis"
          >
            {/* Shine effect on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.4 }}
              style={{ pointerEvents: "none" }}
            />
            <motion.div whileHover={{ rotate: 90 }} transition={{ type: "spring" }}>
              <Trash2 size={14} />
            </motion.div>
            <span className="max-w-[120px] truncate">results</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Divider after URL - only on sm+ when URL present */}
      {currentUrl && (
        <div className="hidden h-5 w-px bg-white/20 dark:bg-white/10 sm:block" />
      )}

      {/* Navigation Links */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {/* Home */}
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/"
            className="group relative flex h-8 w-8 items-center justify-center rounded-lg text-light12 transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2574]/50 dark:text-dark12 dark:hover:bg-white/10"
            aria-label="Home"
            title="Home"
          >
            <Home size={16} />
            <motion.div
              className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-white/0 opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.2 }}
              style={{ pointerEvents: "none" }}
            />
          </Link>
        </motion.div>

        {/* About */}
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/about"
            className="group relative flex h-8 w-8 md:w-auto md:px-3 items-center justify-center rounded-lg text-light12 transition-colors hover:bg-white/20 dark:text-dark12 dark:hover:bg-white/10"
            aria-label="About"
            title="About"
          >
            <Info size={16} className="md:hidden" />
            <span className="hidden md:inline text-sm">About</span>
            <motion.div
              className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-white/0 opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.2 }}
              style={{ pointerEvents: "none" }}
            />
          </Link>
        </motion.div>

        {/* FAQs */}
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/faqs"
            className="group relative flex h-8 w-8 md:w-auto md:px-3 items-center justify-center rounded-lg text-light12 transition-colors hover:bg-white/20 dark:text-dark12 dark:hover:bg-white/10"
            aria-label="FAQs"
            title="FAQs"
          >
            <HelpCircle size={16} className="md:hidden" />
            <span className="hidden md:inline text-sm">FAQs</span>
            <motion.div
              className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-white/0 opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.2 }}
              style={{ pointerEvents: "none" }}
            />
          </Link>
        </motion.div>

        {/* Disclaimer */}
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/disclaimer"
            className="group relative flex h-8 w-8 md:w-auto md:px-3 items-center justify-center rounded-lg text-light12 transition-colors hover:bg-white/20 dark:text-dark12 dark:hover:bg-white/10"
            aria-label="Disclaimer"
            title="Disclaimer"
          >
            <AlertTriangle size={16} className="md:hidden" />
            <span className="hidden md:inline text-sm">Disclaimer</span>
            <motion.div
              className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-white/0 opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.2 }}
              style={{ pointerEvents: "none" }}
            />
          </Link>
        </motion.div>

        {/* Social links and theme switch */}
        <div className="mx-1 hidden h-5 w-px bg-white/20 dark:bg-white/10 sm:block" />

        {/* GitHub */}
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <a
            href="https://github.com/CodeMeAPixel/LighthouseDark"
            aria-label="GitHub Repository"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex h-8 w-8 items-center justify-center rounded-lg text-light12 transition-colors hover:bg-white/20 dark:text-dark12 dark:hover:bg-white/10"
          >
            <FaGithub size={16} />
            <motion.div
              className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-white/0 opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.2 }}
              style={{ pointerEvents: "none" }}
            />
          </a>
        </motion.div>

        {/* Discord */}
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <a
            href="https://discord.gg/Vv2bdC44Ge"
            aria-label="Join us on Discord"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-white/20 dark:hover:bg-white/10"
          >
            <FaDiscord size={16} className="text-[#5865F2]" />
            <motion.div
              className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-white/0 opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.2 }}
              style={{ pointerEvents: "none" }}
            />
          </a>
        </motion.div>

        {/* X/Twitter */}
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <a
            href="https://x.com/LighthouseDarkApp"
            aria-label="Find us on X"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex h-8 w-8 items-center justify-center rounded-lg text-light12 transition-colors hover:bg-white/20 dark:text-dark12 dark:hover:bg-white/10"
          >
            <FaXTwitter size={14} />
            <motion.div
              className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-white/0 opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.2 }}
              style={{ pointerEvents: "none" }}
            />
          </a>
        </motion.div>

        <div className="mx-1 h-5 w-px bg-white/20 dark:bg-white/10" />

        {/* Theme Switch */}
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <ThemeSwitch />
        </motion.div>
      </div>
    </motion.nav>
  )
}
