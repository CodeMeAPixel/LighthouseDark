"use client"

import { motion } from "framer-motion"
import { 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle2, 
  Flame,
  ArrowRight
} from "lucide-react"

interface AISuggestionsProps {
  suggestions: string[]
}

const getPriorityFromIndex = (index: number) => {
  if (index < 2) return { label: "High Priority", color: "text-red-500", bg: "bg-red-500/10", icon: <Flame className="h-4 w-4" /> }
  if (index < 4) return { label: "Medium Priority", color: "text-amber-500", bg: "bg-amber-500/10", icon: <AlertTriangle className="h-4 w-4" /> }
  return { label: "Good to Have", color: "text-green-500", bg: "bg-green-500/10", icon: <CheckCircle2 className="h-4 w-4" /> }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
}

export default function AISuggestions({ suggestions }: AISuggestionsProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF2574] to-[#FF8AB2] dark:from-[#FF6B00] dark:to-[#FFC000]">
          <Lightbulb className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">AI Roast & Recommendations</h3>
          <p className="text-sm text-light11 dark:text-dark11">
            {suggestions.length} actionable insight{suggestions.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {suggestions.map((suggestion, index) => {
          const priority = getPriorityFromIndex(index)
          
          return (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative overflow-hidden rounded-xl glass-surface transition-all duration-300 hover:shadow-lg"
            >
              {/* Priority indicator bar */}
              <div className={`absolute left-0 top-0 h-full w-1 ${priority.bg.replace('/10', '')}`} />
              
              <div className="p-5 pl-6">
                <div className="mb-3 flex items-center justify-between">
                  <div className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${priority.bg} ${priority.color}`}>
                    {priority.icon}
                    {priority.label}
                  </div>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-light11 dark:text-dark11">
                    #{index + 1}
                  </span>
                </div>
                
                <p className="text-sm leading-relaxed">{suggestion}</p>
                
                <div className="mt-4 flex items-center gap-2 text-xs text-[#FF2574] opacity-0 transition-opacity group-hover:opacity-100 dark:text-[#FF6B00]">
                  <ArrowRight className="h-3 w-3" />
                  <span>Take action on this recommendation</span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Summary footer */}
      <motion.div 
        variants={itemVariants}
        className="mt-6 rounded-xl bg-gradient-to-r from-[#FF2574]/10 to-[#FF8AB2]/10 p-4 dark:from-[#FF6B00]/10 dark:to-[#FFC000]/10"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 dark:bg-white/10">
            <Flame className="h-4 w-4 text-[#FF2574] dark:text-[#FF6B00]" />
          </div>
          <div>
            <p className="text-sm font-medium">Ready to improve your site?</p>
            <p className="text-xs text-light11 dark:text-dark11">
              Start with the high-priority items for maximum impact
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
