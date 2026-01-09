"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, HelpCircle, AlertCircle, Lock, Zap } from "lucide-react"

interface FAQItem {
  question: string
  answer: string
  icon: React.ReactNode
}

const faqs: FAQItem[] = [
  {
    question: "What data do you use?",
    answer: "Chrome UX Report (CrUX) field data and on-page SEO signals.",
    icon: <Zap className="h-5 w-5" />,
  },
  {
    question: "Does it run JavaScript?",
    answer: "No pages are parsed as static HTML. Some SPA only meta may not appear.",
    icon: <AlertCircle className="h-5 w-5" />,
  },
  {
    question: "Will AI hallucinate?",
    answer: "We constrain the prompt and map outputs to a fixed schema to reduce fluff.",
    icon: <HelpCircle className="h-5 w-5" />,
  },
  {
    question: "Do you store my URLs?",
    answer: "No persistent storage is used in this app.",
    icon: <Lock className="h-5 w-5" />,
  },
  {
    question: "Is the roast mean? Will it hurt feelings?",
    answer: "The tone is witty and blunt, but the goal is to help you ship fixes not to insult anyone. If the sass stings, take the win and apply the advice. We're not responsible for bruised egos.",
    icon: <span className="text-lg">🔥</span>,
  },
  {
    question: "Why don't I see data for my URL?",
    answer: "CrUX may lack URL level data. We automatically fall back to origin level data when possible.",
    icon: <AlertCircle className="h-5 w-5" />,
  },
  {
    question: "Can I use this in production audits?",
    answer: "Use it as a starting point. Always validate with your own lab tests, Lighthouse runs, and RUM before deploying changes.",
    icon: <Zap className="h-5 w-5" />,
  },
]

export default function FaqsPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

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
          Frequently Asked Questions
        </h1>
        <p className="opacity-80 text-lg">
          Have a question? We've got answers to help you make the most of Lighthouse Dark.
        </p>
      </motion.div>

      {/* FAQ Items */}
      <motion.div 
        className="space-y-3"
        variants={containerVariants}
      >
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <motion.button
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              className="w-full group relative overflow-hidden rounded-xl glass-surface p-5 text-left transition-all hover:bg-white/10"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Background shine on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
                style={{ pointerEvents: "none" }}
              />

              <div className="relative flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF2574]/20 to-[#FF8AB2]/10 dark:from-[#FF6B00]/20 dark:to-[#FFC000]/10 text-[#FF2574] dark:text-[#FF6B00]"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                  >
                    {faq.icon}
                  </motion.div>
                  <h2 className="font-semibold text-lg">{faq.question}</h2>
                </div>
                <motion.div
                  animate={{ rotate: expandedIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="h-5 w-5 text-light11 dark:text-dark11" />
                </motion.div>
              </div>
            </motion.button>

            {/* Answer */}
            <AnimatePresence>
              {expandedIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <motion.div
                    initial={{ y: -10 }}
                    animate={{ y: 0 }}
                    className="rounded-b-xl border-t border-white/10 dark:border-white/5 bg-white/5 p-5 dark:bg-white/2.5"
                  >
                    <p className="opacity-90 leading-relaxed">{faq.answer}</p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>

      {/* Credits section */}
      <motion.div 
        className="mt-8 glass-surface rounded-2xl p-6 text-center"
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
      >
        <h3 className="text-xl font-semibold mb-3">Still have questions?</h3>
        <p className="opacity-90 mb-4">
          Reach out to{" "}
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
