"use client"

import { motion } from "framer-motion"
import { AlertTriangle, Shield, Info, Zap } from "lucide-react"

interface DisclaimerItem {
  title: string
  description: string
  icon: React.ReactNode
}

const disclaimers: DisclaimerItem[] = [
  {
    title: "Not Associated with Google or Lighthouse",
    description:
      "Lighthouse Dark is an independent tool and is not affiliated with, endorsed by, or associated with Google, the Lighthouse project, or Chrome UX Report (CrUX). We are a third-party analysis tool that uses publicly available CrUX data.",
    icon: <Shield className="h-5 w-5" />,
  },
  {
    title: "Informational Purposes Only",
    description:
      "The information provided by Lighthouse Dark is for informational purposes only and may not reflect your full production environment. Always validate changes with your own lab and field data before deployment.",
    icon: <Info className="h-5 w-5" />,
  },
  {
    title: "Data Limitations",
    description: "CrUX data availability varies by URL and origin. On-page parsing does not execute client-side JavaScript, so some SPA-specific metadata may not appear.",
    icon: <AlertTriangle className="h-5 w-5" />,
  },
  {
    title: "AI Generated Content",
    description: "AI-generated roasts may contain inaccuracies or misinterpretations. Always review recommendations carefully before implementing changes to your site.",
    icon: <Zap className="h-5 w-5" />,
  },
  {
    title: "No Professional Advice",
    description: "Nothing provided here constitutes legal, security, accessibility, or compliance advice. Consult with qualified professionals for such matters.",
    icon: <AlertTriangle className="h-5 w-5" />,
  },
]

export default function DisclaimerPage() {
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

  return (
    <motion.section
      className="container mx-auto max-w-3xl px-4 pt-28 lg:pt-36 text-light12 dark:text-dark12 mb-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="glass-surface rounded-2xl p-8 mb-8"
        variants={itemVariants}
        whileHover={{ scale: 1.02, y: -4 }}
      >
        <h1 className="mb-3 text-4xl font-bold bg-gradient-to-r from-[#FF2574] to-[#FF8AB2] dark:from-[#FF6B00] dark:to-[#FFC000] bg-clip-text text-transparent">
          Disclaimer
        </h1>
        <p className="opacity-80 text-lg">
          Please read our important disclaimers and limitations before using Lighthouse Dark.
        </p>
      </motion.div>

      {/* Disclaimer Items */}
      <motion.div className="space-y-4" variants={containerVariants}>
        {disclaimers.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="group relative overflow-hidden rounded-xl glass-surface p-6"
          >
            {/* Background shine on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.5 }}
              style={{ pointerEvents: "none" }}
            />

            <div className="relative flex gap-4">
              <motion.div
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF2574]/20 to-[#FF8AB2]/10 dark:from-[#FF6B00]/20 dark:to-[#FFC000]/10 text-[#FF2574] dark:text-[#FF6B00]"
                whileHover={{ scale: 1.2, rotate: 10 }}
              >
                {item.icon}
              </motion.div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="opacity-90 leading-relaxed">{item.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Fun disclaimer */}
      <motion.div
        className="mt-8 glass-surface rounded-2xl p-6 border-l-4 border-[#FF2574] dark:border-[#FF6B00]"
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
      >
        <p className="opacity-90 leading-relaxed">
          <span className="font-semibold">The Roast is Playful, The Fixes are Serious:</span> We do not accept responsibility for hurt feelings, singed egos, or dramatic gasps. Our tone is witty and direct, but every recommendation is backed by real performance data and best practices. Take the sass with a grain of salt—and take the fixes to the bank.
        </p>
      </motion.div>

      {/* Credits section */}
      <motion.div
        className="mt-8 glass-surface rounded-2xl p-6 text-center"
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
      >
        <h3 className="text-xl font-semibold mb-3">Built with passion</h3>
        <p className="opacity-90 mb-4">
          Crafted by{" "}
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
