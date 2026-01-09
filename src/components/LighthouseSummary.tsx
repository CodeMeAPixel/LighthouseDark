"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import * as Tabs from "@radix-ui/react-tabs"
import { ChevronDown, Gauge, Smartphone, Monitor, Zap, FileImage, Globe } from "lucide-react"
import { LighthouseData as PSIData, LighthouseMetrics } from "@/app/lib/lighthouseAnalyzer"

interface LighthouseSummaryProps {
  data: PSIData
}

const ScoreGauge = ({ score, label }: { score: number | null | undefined; label: string }) => {
  const numScore = score ?? 0
  const getColor = (s: number) => {
    if (s >= 90) return { color: '#22c55e', bg: 'bg-green-500/10' }
    if (s >= 50) return { color: '#eab308', bg: 'bg-amber-500/10' }
    return { color: '#ef4444', bg: 'bg-red-500/10' }
  }
  const { color, bg } = getColor(numScore)
  const circumference = 2 * Math.PI * 36
  const strokeDashoffset = circumference - (numScore / 100) * circumference

  return (
    <motion.div 
      className={`flex flex-col items-center rounded-xl p-4 ${bg} backdrop-blur-sm transition-all duration-300`}
      whileHover={{ scale: 1.08, y: -4 }}
    >
      <div className="relative h-20 w-20">
        <svg className="h-20 w-20 -rotate-90 transform" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
            className="text-light4 dark:text-dark4"
          />
          <motion.circle
            cx="40"
            cy="40"
            r="36"
            stroke={color}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
        >
          <span className="text-lg font-bold" style={{ color }}>
            {score ?? 'N/A'}
          </span>
        </motion.div>
      </div>
      {label && <span className="mt-2 text-xs text-light11 dark:text-dark11 font-medium">{label}</span>}
    </motion.div>
  )
}

const MetricTile = ({ 
  label, 
  value, 
  unit = '',
  threshold,
  isCLS = false
}: { 
  label: string
  value: number | string | null | undefined
  unit?: string
  threshold?: { good: number; poor: number }
  isCLS?: boolean
}) => {
  const getMetricColor = (val: number | string | null | undefined) => {
    if (val === null || val === undefined || val === 'N/A') return 'text-light11 dark:text-dark11'
    if (!threshold) return 'text-light12 dark:text-dark12'
    const numVal = typeof val === 'string' ? parseFloat(val) : val
    if (numVal <= threshold.good) return 'text-green-500'
    if (numVal <= threshold.poor) return 'text-amber-500'
    return 'text-red-500'
  }

  // Format value - for CLS show 3 decimal places, for others show as-is
  const formatValue = (val: number | string | null | undefined) => {
    if (val === null || val === undefined) return 'N/A'
    if (typeof val === 'string') return val
    if (isCLS) return val.toFixed(3)
    // For large numbers, add thousand separator
    if (val >= 1000) return val.toLocaleString()
    return val.toString()
  }

  return (
    <motion.div 
      className="rounded-xl p-4 glass-surface transition-all duration-300"
      whileHover={{ scale: 1.02, y: -2 }}
    >
      <h4 className="mb-2 text-sm font-medium text-light11 dark:text-dark11">{label}</h4>
      <div className={`text-2xl font-bold ${getMetricColor(value)}`}>
        {formatValue(value)}{value !== null && value !== undefined && unit}
      </div>
    </motion.div>
  )
}

const CollapsibleSection = ({ 
  title, 
  icon, 
  children,
  defaultOpen = false
}: { 
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="rounded-xl glass-surface overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-white/5"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-semibold">{title}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/10 p-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Single device metrics panel
const DeviceMetricsPanel = ({ 
  metrics, 
  deviceType 
}: { 
  metrics: LighthouseMetrics & {
    largestAssets: Array<{ url: string; size: number; type: string }>
    thirdPartySummary: Array<{ domain: string; requests: number; bytes: number }>
    opportunities: Array<{ id: string; title: string; savingsMs: number }>
    screenshot: string | null
  }
  deviceType: "mobile" | "desktop"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Score Overview */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <ScoreGauge score={metrics.performanceScore} label="Performance" />
        <ScoreGauge score={metrics.accessibilityScore} label="Accessibility" />
        <ScoreGauge score={metrics.bestPracticesScore} label="Best Practices" />
        <ScoreGauge score={metrics.seoScore} label="SEO" />
        <ScoreGauge score={metrics.pwaScore} label="PWA" />
      </div>

      {/* Core Web Vitals */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-light11 dark:text-dark11 uppercase tracking-wide">Core Web Vitals</h4>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <MetricTile 
            label="LCP" 
            value={metrics.lcp}
            unit=" ms"
            threshold={{ good: 2500, poor: 4000 }}
          />
          <MetricTile 
            label="CLS" 
            value={metrics.cls}
            threshold={{ good: 0.1, poor: 0.25 }}
            isCLS={true}
          />
          <MetricTile 
            label="FCP" 
            value={metrics.fcp}
            unit=" ms"
            threshold={{ good: 1800, poor: 3000 }}
          />
          <MetricTile 
            label="TBT" 
            value={metrics.tbt}
            unit=" ms"
            threshold={{ good: 200, poor: 600 }}
          />
          <MetricTile 
            label="Speed Index" 
            value={metrics.speedIndex}
            unit=" ms"
            threshold={{ good: 3400, poor: 5800 }}
          />
          <MetricTile 
            label="TTFB" 
            value={metrics.ttfb}
            unit=" ms"
            threshold={{ good: 800, poor: 1800 }}
          />
        </div>
      </div>

      {/* Network Stats */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-light11 dark:text-dark11 uppercase tracking-wide">Network</h4>
        <div className="grid grid-cols-2 gap-3">
          <MetricTile label="Requests" value={metrics.networkRequests} />
          <MetricTile 
            label="Total Size" 
            value={metrics.totalByteWeight != null ? Math.round(metrics.totalByteWeight / 1024) : null}
            unit=" KB"
          />
        </div>
      </div>

      {/* Collapsible Sections */}
      <div className="space-y-3">
        {metrics.opportunities.length > 0 && (
          <CollapsibleSection 
            title="Top Opportunities" 
            icon={<Zap className="h-4 w-4 text-green-500" />}
            defaultOpen={true}
          >
            <ul className="space-y-2">
              {metrics.opportunities.map((o) => (
                <li key={o.id} className="rounded-lg bg-green-500/10 p-3">
                  <div className="font-medium text-green-600 dark:text-green-400">{o.title}</div>
                  <div className="text-sm text-light11 dark:text-dark11">
                    Potential savings: ~{o.savingsMs} ms
                  </div>
                </li>
              ))}
            </ul>
          </CollapsibleSection>
        )}

        {metrics.largestAssets.length > 0 && (
          <CollapsibleSection 
            title="Largest Assets" 
            icon={<FileImage className="h-4 w-4 text-amber-500" />}
          >
            <ul className="space-y-1 text-sm">
              {metrics.largestAssets.map((a, i) => (
                <li key={i} className="flex items-center justify-between rounded-lg bg-white/5 p-2">
                  <span className="truncate text-light11 dark:text-dark11">{a.type}</span>
                  <span className="font-medium">{Math.round(a.size / 1024)} KB</span>
                </li>
              ))}
            </ul>
          </CollapsibleSection>
        )}

        {metrics.thirdPartySummary.length > 0 && (
          <CollapsibleSection 
            title="Third-Party Domains" 
            icon={<Globe className="h-4 w-4 text-blue-500" />}
          >
            <ul className="space-y-1 text-sm">
              {metrics.thirdPartySummary.map((t, i) => (
                <li key={i} className="flex items-center justify-between rounded-lg bg-white/5 p-2">
                  <span className="truncate text-light11 dark:text-dark11">{t.domain}</span>
                  <span className="font-medium">{t.requests} req • {Math.round(t.bytes / 1024)} KB</span>
                </li>
              ))}
            </ul>
          </CollapsibleSection>
        )}
      </div>

      {/* Screenshot */}
      {metrics.screenshot && (
        <div className="rounded-xl p-4 glass-surface">
          <h4 className="mb-3 font-semibold">Page Screenshot</h4>
          <img 
            src={metrics.screenshot} 
            alt={`${deviceType} screenshot`}
            className="w-full max-w-sm rounded-lg border border-white/10 mx-auto" 
          />
        </div>
      )}
    </motion.div>
  )
}

export default function LighthouseSummary({ data }: LighthouseSummaryProps) {
  const [activeTab, setActiveTab] = useState<"mobile" | "desktop">("mobile")

  const m = {
    ...data.mobile,
    largestAssets: Array.isArray(data.mobile?.largestAssets) ? data.mobile.largestAssets : [],
    thirdPartySummary: Array.isArray(data.mobile?.thirdPartySummary) ? data.mobile.thirdPartySummary : [],
    opportunities: Array.isArray(data.mobile?.opportunities) ? data.mobile.opportunities : [],
    screenshot: typeof data.mobile?.screenshot === "string" ? data.mobile.screenshot : null,
  }
  const d = {
    ...data.desktop,
    largestAssets: Array.isArray(data.desktop?.largestAssets) ? data.desktop.largestAssets : [],
    thirdPartySummary: Array.isArray(data.desktop?.thirdPartySummary) ? data.desktop.thirdPartySummary : [],
    opportunities: Array.isArray(data.desktop?.opportunities) ? data.desktop.opportunities : [],
    screenshot: typeof data.desktop?.screenshot === "string" ? data.desktop.screenshot : null,
  }

  return (
    <motion.div 
      className="mb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-4 flex items-center gap-2">
        <Gauge className="h-5 w-5 text-[#FF2574] dark:text-[#FF6B00]" />
        <h3 className="text-lg font-semibold">PageSpeed Insights</h3>
      </div>

      {/* Device Tabs */}
      <Tabs.Root value={activeTab} onValueChange={(v) => setActiveTab(v as "mobile" | "desktop")}>
        <Tabs.List className="mb-6 flex gap-2 rounded-xl p-1.5 glass-surface">
          <Tabs.Trigger
            value="mobile"
            className="group relative flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 data-[state=active]:bg-[#FF2574]/10 dark:data-[state=active]:bg-[#FF6B00]/10"
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Smartphone className="h-4 w-4" />
            </motion.div>
            <span>Mobile</span>
            <motion.span 
              className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#FF2574] to-[#FF8AB2] transition-all duration-300 group-data-[state=active]:w-12 dark:from-[#FF6B00] dark:to-[#FFC000]"
            />
          </Tabs.Trigger>
          <Tabs.Trigger
            value="desktop"
            className="group relative flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 data-[state=active]:bg-[#FF2574]/10 dark:data-[state=active]:bg-[#FF6B00]/10"
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Monitor className="h-4 w-4" />
            </motion.div>
            <span>Desktop</span>
            <motion.span 
              className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#FF2574] to-[#FF8AB2] transition-all duration-300 group-data-[state=active]:w-12 dark:from-[#FF6B00] dark:to-[#FFC000]"
            />
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="mobile" forceMount>
          <AnimatePresence mode="wait">
            {activeTab === "mobile" && (
              <DeviceMetricsPanel key="mobile" metrics={m} deviceType="mobile" />
            )}
          </AnimatePresence>
        </Tabs.Content>
        <Tabs.Content value="desktop" forceMount>
          <AnimatePresence mode="wait">
            {activeTab === "desktop" && (
              <DeviceMetricsPanel key="desktop" metrics={d} deviceType="desktop" />
            )}
          </AnimatePresence>
        </Tabs.Content>
      </Tabs.Root>
    </motion.div>
  )
}
