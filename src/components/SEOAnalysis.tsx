"use client"

import { motion } from "framer-motion"
import { 
  FileText, 
  Hash, 
  Image as ImageIcon, 
  Globe, 
  Bot, 
  Link2, 
  Eye, 
  Languages,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react"
import { SEOData } from "@/app/lib/seoAnalyzer"

interface SEOAnalysisProps {
  data: SEOData
}

const StatusBadge = ({ status, label }: { status: boolean | null; label: string }) => {
  if (status === null) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gray-500/10 px-2 py-0.5 text-xs text-gray-500">
        <AlertTriangle className="h-3 w-3" />
        {label}: Unknown
      </span>
    )
  }
  return status ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-600 dark:text-green-400">
      <CheckCircle className="h-3 w-3" />
      {label}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-xs text-red-600 dark:text-red-400">
      <XCircle className="h-3 w-3" />
      {label}
    </span>
  )
}

const LengthIndicator = ({ length, optimal }: { length: number; optimal: { min: number; max: number } }) => {
  const isOptimal = length >= optimal.min && length <= optimal.max
  const isTooShort = length < optimal.min
  const isTooLong = length > optimal.max

  return (
    <div className="mt-2 flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-light4 dark:bg-dark4">
        <div 
          className={`h-full transition-all ${
            isOptimal ? 'bg-green-500' : isTooShort ? 'bg-amber-500' : 'bg-red-500'
          }`}
          style={{ width: `${Math.min((length / optimal.max) * 100, 100)}%` }}
        />
      </div>
      <span className={`text-xs font-medium ${
        isOptimal ? 'text-green-500' : isTooShort ? 'text-amber-500' : 'text-red-500'
      }`}>
        {length}/{optimal.max}
      </span>
    </div>
  )
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
}

export default function SEOAnalysis({ data }: SEOAnalysisProps) {
  return (
    <motion.div 
      className="mb-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mb-4 flex items-center gap-2">
        <FileText className="h-5 w-5 text-[#FF2574] dark:text-[#FF6B00]" />
        <h3 className="text-lg font-semibold">SEO Analysis</h3>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Title */}
        <motion.div variants={itemVariants} className="rounded-xl p-4 glass-surface">
          <div className="mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-500" />
            <h4 className="font-semibold">Title</h4>
          </div>
          <p className="break-words text-sm">{data.title || "Not found"}</p>
          {typeof data.titleLength === "number" && (
            <LengthIndicator length={data.titleLength} optimal={{ min: 30, max: 60 }} />
          )}
        </motion.div>

        {/* Description */}
        <motion.div variants={itemVariants} className="rounded-xl p-4 glass-surface">
          <div className="mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4 text-purple-500" />
            <h4 className="font-semibold">Description</h4>
          </div>
          <p className="line-clamp-3 break-words text-sm">{data.metaDescription || "Not found"}</p>
          {typeof data.descriptionLength === "number" && (
            <LengthIndicator length={data.descriptionLength} optimal={{ min: 120, max: 160 }} />
          )}
        </motion.div>

        {/* Keywords */}
        <motion.div variants={itemVariants} className="rounded-xl p-4 glass-surface">
          <div className="mb-2 flex items-center gap-2">
            <Hash className="h-4 w-4 text-cyan-500" />
            <h4 className="font-semibold">Keywords</h4>
          </div>
          <p className="max-h-20 overflow-y-auto break-words text-sm pr-1">
            {data.keywords || <span className="text-light11 dark:text-dark11">Not specified</span>}
          </p>
        </motion.div>

        {/* Open Graph Image */}
        <motion.div variants={itemVariants} className="rounded-xl p-4 glass-surface md:col-span-2 lg:col-span-1">
          <div className="mb-2 flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-pink-500" />
            <h4 className="font-semibold">OG Image</h4>
          </div>
          {data.ogImg ? (
            <img
              src={data.ogImg}
              alt={data.title || "Open Graph Image"}
              className="w-full max-w-[300px] rounded-lg border border-white/10"
            />
          ) : (
            <p className="text-sm text-light11 dark:text-dark11">Not found</p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <StatusBadge status={data.hasOgBasic} label="OG basics" />
            <StatusBadge status={data.hasTwitterCard} label="Twitter card" />
          </div>
        </motion.div>

        {/* Headings */}
        <motion.div variants={itemVariants} className="rounded-xl p-4 glass-surface">
          <div className="mb-2 flex items-center gap-2">
            <Hash className="h-4 w-4 text-amber-500" />
            <h4 className="font-semibold">Headings</h4>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">H1 tags</span>
              <span className={`font-semibold ${data.h1Count === 1 ? 'text-green-500' : data.h1Count === 0 ? 'text-red-500' : 'text-amber-500'}`}>
                {data.h1Count}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">H2 tags</span>
              <span className="font-semibold">{data.h2Count}</span>
            </div>
            {data.firstH1 && (
              <p className="mt-2 rounded-lg bg-white/10 p-2 text-xs text-light11 dark:text-dark11">
                First H1: {data.firstH1}
              </p>
            )}
          </div>
        </motion.div>

        {/* Robots */}
        <motion.div variants={itemVariants} className="rounded-xl p-4 glass-surface">
          <div className="mb-2 flex items-center gap-2">
            <Bot className="h-4 w-4 text-green-500" />
            <h4 className="font-semibold">Robots & Indexing</h4>
          </div>
          <p className="mb-2 break-words text-sm">
            {data.robots || <span className="text-light11 dark:text-dark11">Not specified</span>}
          </p>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={data.indexable} label="Indexable" />
            <StatusBadge status={data.follow} label="Follow" />
          </div>
          {data.googlebot && (
            <p className="mt-2 rounded-lg bg-white/10 p-2 text-xs">
              Googlebot: {data.googlebot}
            </p>
          )}
        </motion.div>

        {/* Canonical & URL */}
        <motion.div variants={itemVariants} className="rounded-xl p-4 glass-surface">
          <div className="mb-2 flex items-center gap-2">
            <Link2 className="h-4 w-4 text-indigo-500" />
            <h4 className="font-semibold">Canonical & URL</h4>
          </div>
          <div className="space-y-1 text-sm">
            <p className="truncate">
              <span className="text-light11 dark:text-dark11">Final:</span> {data.finalUrl}
            </p>
            <p className="truncate">
              <span className="text-light11 dark:text-dark11">Canonical:</span> {data.canonical || "N/A"}
            </p>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <StatusBadge status={data.canonicalIsSelf} label="Self-referential" />
            <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs text-blue-600 dark:text-blue-400">
              Status: {data.status}
            </span>
          </div>
        </motion.div>

        {/* Viewport & Theme */}
        <motion.div variants={itemVariants} className="rounded-xl p-4 glass-surface">
          <div className="mb-2 flex items-center gap-2">
            <Eye className="h-4 w-4 text-teal-500" />
            <h4 className="font-semibold">Viewport & Theme</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={!!data.viewport} label="Viewport" />
            <StatusBadge status={data.viewportIsResponsive} label="Responsive" />
          </div>
          <div className="mt-2 space-y-1 text-sm">
            <p>
              <span className="text-light11 dark:text-dark11">Theme:</span>{" "}
              {data.metaThemeColor ? (
                <span className="inline-flex items-center gap-1">
                  <span 
                    className="inline-block h-3 w-3 rounded-full border border-white/20" 
                    style={{ backgroundColor: data.metaThemeColor }}
                  />
                  {data.metaThemeColor}
                </span>
              ) : "N/A"}
            </p>
            <p><span className="text-light11 dark:text-dark11">Lang:</span> {data.lang || "N/A"}</p>
          </div>
        </motion.div>

        {/* Resources */}
        <motion.div variants={itemVariants} className="rounded-xl p-4 glass-surface">
          <div className="mb-2 flex items-center gap-2">
            <Globe className="h-4 w-4 text-rose-500" />
            <h4 className="font-semibold">Resources & Intl</h4>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1">
              <StatusBadge status={data.hasFavicon} label="Favicon" />
            </div>
            <div><span className="text-light11 dark:text-dark11">JSON-LD:</span> {data.jsonLdCount}</div>
            <div><span className="text-light11 dark:text-dark11">Hreflang:</span> {data.hreflangCount}</div>
            <div><span className="text-light11 dark:text-dark11">Preconnect:</span> {data.preconnectCount}</div>
            <div><span className="text-light11 dark:text-dark11">Preload:</span> {data.preloadCount}</div>
            <div><span className="text-light11 dark:text-dark11">Charset:</span> {data.metaCharset || "N/A"}</div>
          </div>
        </motion.div>

        {/* Images */}
        <motion.div variants={itemVariants} className="rounded-xl p-4 glass-surface">
          <div className="mb-2 flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-orange-500" />
            <h4 className="font-semibold">Images</h4>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{data.imgCount}</div>
              <div className="text-xs text-light11 dark:text-dark11">Total</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${data.imgWithoutAlt > 0 ? 'text-red-500' : 'text-green-500'}`}>
                {data.imgWithoutAlt}
              </div>
              <div className="text-xs text-light11 dark:text-dark11">Missing alt</div>
            </div>
          </div>
          {data.imgWithoutAlt > 0 && (
            <p className="mt-2 rounded-lg bg-red-500/10 p-2 text-xs text-red-600 dark:text-red-400">
              {data.imgWithoutAlt} image{data.imgWithoutAlt > 1 ? 's' : ''} missing alt text
            </p>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
