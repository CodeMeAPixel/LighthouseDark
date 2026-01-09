"use client"

import { motion } from "framer-motion"
import { Bot, GaugeCircle, Search, Sparkles, Share2, ShieldCheck } from "lucide-react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

export default function FeatureGrid() {
  const features = [
    {
      icon: <Search className="h-5 w-5" />,
      title: "SEO scan",
      body: "Titles, descriptions, headings, robots - the stuff that actually matters.",
      accent: "group-hover:text-blue-500 group-hover:bg-blue-500/10",
    },
    {
      icon: <GaugeCircle className="h-5 w-5" />,
      title: "Core Web Vitals",
      body: "Real-user CrUX data for LCP, CLS, and INP on mobile and desktop.",
      accent: "group-hover:text-green-500 group-hover:bg-green-500/10",
    },
    {
      icon: <Bot className="h-5 w-5" />,
      title: "AI roast",
      body: "Blunt, actionable feedback with steps you can ship today.",
      accent: "group-hover:text-purple-500 group-hover:bg-purple-500/10",
    },
    {
      icon: <Sparkles className="h-5 w-5" />,
      title: "No setup",
      body: "Paste a URL. We'll do the rest. No extensions. No fluff.",
      accent: "group-hover:text-amber-500 group-hover:bg-amber-500/10",
    },
    {
      icon: <Share2 className="h-5 w-5" />,
      title: "Shareable link",
      body: "Bookmark or share results with the ?url= parameter.",
      accent: "group-hover:text-cyan-500 group-hover:bg-cyan-500/10",
    },
    {
      icon: <ShieldCheck className="h-5 w-5" />,
      title: "Privacy first",
      body: "No login, no storage. Analysis runs server-side.",
      accent: "group-hover:text-emerald-500 group-hover:bg-emerald-500/10",
    },
  ]

  return (
    <section className="mx-auto w-full max-w-6xl px-4 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mb-2 text-center text-xl font-semibold">What you get</h2>
        <p className="mb-6 text-center text-sm text-light11 dark:text-dark11">
          Everything you need to improve your site's performance
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {features.map((f, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="group glass-surface-soft rounded-2xl p-5 transition-all duration-300"
          >
            <div className={`${f.accent} mb-3 inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/30 p-2.5 text-light12 transition-all duration-300 dark:border-white/10 dark:bg-white/10 dark:text-dark12`}>
              {f.icon}
            </div>
            <h3 className="mb-1 text-base font-semibold">{f.title}</h3>
            <p className="text-sm leading-relaxed text-light11 dark:text-dark11">{f.body}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
