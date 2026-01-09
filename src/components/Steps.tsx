"use client"

import { motion } from "framer-motion"
import { CheckCircle2, Link2, ScanSearch } from "lucide-react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
}

export default function Steps() {
  const steps = [
    {
      title: "Drop a URL",
      body: "Any public site. We sanitize inputs for safety.",
      icon: <Link2 className="h-5 w-5" />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "We analyze",
      body: "Fetch HTML, parse SEO, and pull field data from CrUX.",
      icon: <ScanSearch className="h-5 w-5" />,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Get the roast",
      body: "Clear fixes with a spicy tone. Prioritized and pragmatic.",
      icon: <CheckCircle2 className="h-5 w-5" />,
      color: "from-[#FF2574] to-[#FF8AB2] dark:from-[#FF6B00] dark:to-[#FFC000]",
    },
  ]

  return (
    <section className="mx-auto w-full max-w-4xl px-4 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mb-2 text-center text-xl font-semibold">How it works</h2>
        <p className="mb-6 text-center text-sm text-light11 dark:text-dark11">
          Three simple steps to get actionable insights
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {steps.map((s, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="group relative glass-surface-soft rounded-2xl p-6"
          >
            {/* Connection line on desktop */}
            {i < steps.length - 1 && (
              <div className="absolute -right-3 top-1/2 hidden h-px w-6 bg-gradient-to-r from-light4 to-transparent dark:from-dark4 md:block" />
            )}

            <div className="mb-4 flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-white shadow-lg`}>
                <span className="text-sm font-bold">{i + 1}</span>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/30 text-light12 dark:border-white/10 dark:bg-white/10 dark:text-dark12">
                {s.icon}
              </div>
            </div>

            <h3 className="mb-2 text-base font-semibold">{s.title}</h3>
            <p className="text-sm leading-relaxed text-light11 dark:text-dark11">{s.body}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
