'use client'

import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate, useLocation } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { FaXTwitter, FaGithub, FaHouse, FaInfo, FaQuestion, FaFileContract, FaXmark } from 'react-icons/fa6'
import { Telescope } from 'lucide-react'
import ThemeSwitch from './ThemeSwitch'
import { useUrlStore } from '@/lib/store'

const navLinks = [
  { href: '/', label: 'Home', icon: FaHouse },
  { href: '/about', label: 'About', icon: FaInfo },
  { href: '/faqs', label: 'FAQs', icon: FaQuestion },
  { href: '/disclaimer', label: 'Disclaimer', icon: FaFileContract },
]

const socialLinks = [
  {
    href: 'https://x.com/CodeMeAPixel',
    icon: FaXTwitter,
    label: 'Twitter',
    color: 'hover:text-[#1DA1F2]',
  },
  {
    href: 'https://github.com/codemeapixel/roast-lab',
    icon: FaGithub,
    label: 'GitHub',
    color: 'hover:text-white dark:hover:text-white',
  },
]

function extractDomain(url: string): string {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`)
    return parsed.hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export default function FloatNav() {
  const [isHovered, setIsHovered] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUrl, clearResults } = useUrlStore()

  const domain = useMemo(() => (currentUrl ? extractDomain(currentUrl) : null), [currentUrl])

  const handleClearAndReturn = () => {
    clearResults()
    navigate({ to: '/' })
  }

  const currentPath = location.pathname

  return (
    <motion.nav
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      {/* Clear URL Button */}
      <AnimatePresence>
        {currentUrl && (
          <motion.button
            className="glass-button-primary flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium sm:px-4"
            onClick={handleClearAndReturn}
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={`Clear analysis for ${domain}`}
          >
            <FaXmark className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="max-w-[100px] truncate text-xs sm:max-w-[150px] sm:text-sm">{domain}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main Navigation Bar */}
      <motion.div
        className="glass-surface relative flex items-center gap-1 rounded-full px-2 py-1.5"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false)
          setActiveIndex(null)
        }}
        whileHover={{ scale: 1.02 }}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#FF2574]/20 to-[#FF8AB2]/20 blur-xl dark:from-[#FF6B00]/20 dark:to-[#FFC000]/20"
          animate={{
            opacity: isHovered ? 0.8 : 0.3,
            scale: isHovered ? 1.1 : 1,
          }}
          style={{ pointerEvents: 'none' }}
        />

        {/* Navigation Links */}
        {navLinks.map((link, index) => {
          const Icon = link.icon
          const isActive = currentPath === link.href
          return (
            <motion.div
              key={link.href}
              className="relative"
              onMouseEnter={() => setActiveIndex(index)}
            >
              <Link
                to={link.href as any}
                className={`relative flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                  isActive
                    ? 'bg-[#FF2574]/20 text-[#FF2574] dark:bg-[#FF6B00]/20 dark:text-[#FF6B00]'
                    : 'text-light11 hover:bg-white/10 hover:text-light12 dark:text-dark11 dark:hover:text-dark12'
                }`}
              >
                <Icon className="h-4 w-4" />
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-[#FF2574] dark:border-[#FF6B00]"
                    layoutId="activeNav"
                    transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
                  />
                )}
              </Link>

              {/* Tooltip */}
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-light12 px-2.5 py-1 text-xs font-medium text-white dark:bg-dark12 dark:text-black"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                  >
                    {link.label}
                    <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-light12 dark:border-t-dark12" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}

        {/* Divider */}
        <div className="mx-1 h-5 w-px bg-white/10" />

        {/* Social Links */}
        {socialLinks.map((link, index) => {
          const Icon = link.icon
          const socialIndex = navLinks.length + index
          return (
            <motion.div
              key={link.href}
              className="relative"
              onMouseEnter={() => setActiveIndex(socialIndex)}
            >
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex h-9 w-9 items-center justify-center rounded-full text-light11 transition-colors hover:bg-white/10 dark:text-dark11 ${link.color}`}
              >
                <Icon className="h-4 w-4" />
              </a>

              {/* Tooltip */}
              <AnimatePresence>
                {activeIndex === socialIndex && (
                  <motion.div
                    className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-light12 px-2.5 py-1 text-xs font-medium text-white dark:bg-dark12 dark:text-black"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                  >
                    {link.label}
                    <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-light12 dark:border-t-dark12" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}

        {/* Divider */}
        <div className="mx-1 h-5 w-px bg-white/10" />

        {/* Theme Switch */}
        <ThemeSwitch />
      </motion.div>
    </motion.nav>
  )
}
