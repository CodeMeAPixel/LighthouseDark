"use client"

import { motion } from "framer-motion"
import { CheckCircle2, Zap, Brain, ArrowRight } from "lucide-react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function AboutPage() {
  return (
    <motion.section 
      className="container mx-auto max-w-3xl px-4 pt-28 lg:pt-36 text-light12 dark:text-dark12 mb-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Main intro card */}
      <motion.div 
        className="glass-surface rounded-2xl p-8"
        variants={itemVariants}
        whileHover={{ scale: 1.02, y: -4 }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="mb-4 text-4xl font-bold bg-gradient-to-r from-[#FF2574] to-[#FF8AB2] dark:from-[#FF6B00] dark:to-[#FFC000] bg-clip-text text-transparent">About Lighthouse Dark</h1>
        </motion.div>
        <p className="opacity-80 text-lg leading-relaxed">
          Lighthouse Dark gives you a blunt, helpful critique of your site using real-user data and on-page signals.
          It blends Chrome UX Report (CrUX), SEO parsing, and an AI assistant to prioritize fixes that matter.
        </p>
      </motion.div>

      {/* Feature grid */}
      <motion.div 
        className="mt-8 grid gap-5 md:grid-cols-2"
        variants={containerVariants}
      >
        {/* What it checks */}
        <motion.div 
          className="group rounded-xl border border-white/10 dark:border-white/5 p-6 backdrop-blur-sm transition-all hover:border-white/20 dark:hover:border-white/10 hover:bg-white/5"
          variants={itemVariants}
          whileHover={{ scale: 1.05, y: -4 }}
        >
          <motion.div 
            className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF2574]/20 to-[#FF8AB2]/10 dark:from-[#FF6B00]/20 dark:to-[#FFC000]/10"
            whileHover={{ scale: 1.2, rotate: 10 }}
          >
            <CheckCircle2 className="h-5 w-5 text-[#FF2574] dark:text-[#FF6B00]" />
          </motion.div>
          <h2 className="mb-4 text-xl font-semibold">What it checks</h2>
          <ul className="space-y-2 opacity-90">
            {[
              "Core Web Vitals from CrUX (Mobile & Desktop)",
              "SEO basics (title, description, keywords/tags)",
              "Robots directives and canonical hints",
              "Headings and basic content structure",
            ].map((item, idx) => (
              <motion.li 
                key={idx} 
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#FF2574] dark:text-[#FF6B00]" />
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* How it works */}
        <motion.div 
          className="group rounded-xl border border-white/10 dark:border-white/5 p-6 backdrop-blur-sm transition-all hover:border-white/20 dark:hover:border-white/10 hover:bg-white/5"
          variants={itemVariants}
          whileHover={{ scale: 1.05, y: -4 }}
        >
          <motion.div 
            className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF2574]/20 to-[#FF8AB2]/10 dark:from-[#FF6B00]/20 dark:to-[#FFC000]/10"
            whileHover={{ scale: 1.2, rotate: 10 }}
          >
            <Zap className="h-5 w-5 text-[#FF2574] dark:text-[#FF6B00]" />
          </motion.div>
          <h2 className="mb-4 text-xl font-semibold">How it works</h2>
          <ol className="space-y-2 opacity-90">
            {[
              "Fetches your page HTML (no JS execution)",
              "Queries CrUX for field data (URL then origin fallback)",
              "Generates prioritized suggestions with AI",
              "Shows quick wins first",
            ].map((item, idx) => (
              <motion.li 
                key={idx} 
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#FF2574]/10 dark:bg-[#FF6B00]/10 text-sm font-semibold text-[#FF2574] dark:text-[#FF6B00]">{idx + 1}</span>
                <span className="mt-0.5">{item}</span>
              </motion.li>
            ))}
          </ol>
        </motion.div>
      </motion.div>

      {/* Roadmap section */}
      <motion.div 
        className="mt-8 rounded-xl border border-white/10 dark:border-white/5 p-6 backdrop-blur-sm"
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
      >
        <motion.div 
          className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF2574]/20 to-[#FF8AB2]/10 dark:from-[#FF6B00]/20 dark:to-[#FFC000]/10"
          whileHover={{ scale: 1.2, rotate: 10 }}
        >
          <Brain className="h-5 w-5 text-[#FF2574] dark:text-[#FF6B00]" />
        </motion.div>
        <h2 className="mb-4 text-xl font-semibold">Roadmap</h2>
        <ul className="space-y-2 opacity-90">
          {[
            "Deeper metadata and link audit",
            "Screenshot-based LCP heuristics",
            "Exportable checklists",
          ].map((item, idx) => (
            <motion.li 
              key={idx} 
              className="flex items-start gap-2"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, delay: idx * 0.5 }}
              >
                <Zap className="h-4 w-4 flex-shrink-0 text-[#FF2574] dark:text-[#FF6B00]" />
              </motion.div>
              <span>{item}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Credits section */}
      <motion.div 
        className="mt-4 glass-surface rounded-2xl p-6 text-center"
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
      >
        <h3 className="text-xl font-semibold mb-3">Built with ❤️</h3>
        <p className="opacity-90 mb-4">
          Built by{" "}
          <motion.a 
            className="relative inline-flex items-center gap-1 font-semibold text-[#FF2574] dark:text-[#FF6B00] hover:opacity-80 transition-opacity"
            href="https://codemeapixel.dev" 
            target="_blank" 
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
          >
            CodeMeAPixel
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🔥
            </motion.span>
          </motion.a>
        </p>
      </motion.div>
    </motion.section>
  )
}
