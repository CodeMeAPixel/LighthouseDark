"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Zap } from "lucide-react"

export function NavPill() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Hide when scrolled down, show when at top
      setIsScrolled(currentScrollY > 50)
      
      // Hide when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      
      lastScrollY = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          className="fixed left-0 right-0 top-4 z-50 flex items-center justify-center"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Glow effect */}
          <motion.div
            className="absolute h-20 w-64 rounded-full bg-gradient-to-r from-[#FF2574]/30 to-[#FF8AB2]/20 blur-3xl dark:from-[#FF6B00]/30 dark:to-[#FFC000]/20"
            animate={{
              opacity: isHovered ? 0.8 : 0.4,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.3 }}
            style={{ pointerEvents: "none" }}
          />

          <motion.div
            className="relative flex items-center gap-4 rounded-full border border-white/15 bg-white/40 px-6 py-2.5 shadow-lg backdrop-blur-2xl transition-all dark:border-white/10 dark:bg-white/5 hover:border-white/30 dark:hover:border-white/20"
            animate={{ 
              scale: isScrolled ? 0.95 : 1,
            }}
            whileHover={{ scale: 1.05, y: -4 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            transition={{ duration: 0.2 }}
          >
            <motion.div className="flex items-center gap-2.5">
              <motion.div 
                className="flex h-7 w-7 items-center justify-center rounded-full overflow-hidden"
                whileHover={{ scale: 1.15, rotate: 15 }}
              >
                <Image 
                  src="/logo.png" 
                  alt="Lighthouse Dark" 
                  width={28} 
                  height={28}
                  className="object-contain"
                />
              </motion.div>
              <span className="text-sm font-semibold text-light12 dark:text-dark12">
                Lighthouse Dark
              </span>
              <motion.span 
                className="flex items-center gap-1 rounded-full bg-[#FF2574]/10 px-2.5 py-0.5 text-[10px] font-medium text-[#FF2574] dark:bg-[#FF6B00]/10 dark:text-[#FF6B00]"
                whileHover={{ scale: 1.1 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Zap className="h-2.5 w-2.5" />
                </motion.div>
                Beta
              </motion.span>
            </motion.div>
          </motion.div>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}

