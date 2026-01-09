"use client"

import { motion } from "framer-motion"
import { BarChart3, Clock, CheckCircle } from "lucide-react"

export default function StatsBar() {
  const stats = [
    { 
      k: "SEO checks", 
      v: "12+", 
      icon: <CheckCircle className="h-4 w-4" />,
      color: "text-green-500"
    },
    { 
      k: "Core metrics", 
      v: "3", 
      icon: <BarChart3 className="h-4 w-4" />,
      color: "text-blue-500"
    },
    { 
      k: "Time to insight", 
      v: "~3s", 
      icon: <Clock className="h-4 w-4" />,
      color: "text-amber-500"
    },
  ]

  return (
    <motion.section 
      className="mx-auto w-full max-w-3xl px-4 lg:px-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="glass-surface-soft rounded-2xl px-6 py-5">
        <ul className="grid grid-cols-3 divide-x divide-white/10 dark:divide-white/5">
          {stats.map((s, i) => (
            <motion.li 
              key={i} 
              className="flex flex-col items-center justify-center px-2 py-2"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 * i }}
            >
              <div className={`mb-2 ${s.color}`}>
                {s.icon}
              </div>
              <span className="text-2xl font-bold tracking-tight">{s.v}</span>
              <span className="mt-0.5 text-xs text-light11 dark:text-dark11">{s.k}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.section>
  )
}
