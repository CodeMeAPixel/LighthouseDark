"use client"

import { useEffect, useId, useMemo, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { Download, Copy, Check } from "lucide-react"

export default function ImageDemon() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [copiedSVG, setCopiedSVG] = useState(false)
  const [copiedPNG, setCopiedPNG] = useState(false)
  const uid = useId()

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = theme === "dark"
  const svgRef = useRef<SVGSVGElement>(null)

  const gradientId = useMemo(() => `wr-gradient-${uid}`.replace(/[:]/g, ""), [uid])
  const flameGradientId = useMemo(
    () => `wr-flame-${uid}`.replace(/[:]/g, ""),
    [uid]
  )

  if (!mounted) return null

  const handleDownloadSVG = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svg);
    // Add XML declaration for compatibility
    if (!source.startsWith("<?xml")) {
      source = `<?xml version="1.0" encoding="UTF-8"?>\n` + source;
    }
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lighthouse-dark.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setCopiedSVG(true);
    setTimeout(() => setCopiedSVG(false), 2000);
  };

  const handleDownloadPNG = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svg);
    // Create image from SVG string
    const img = new window.Image();
    const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const pngUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = pngUrl;
            a.download = "lighthouse-dark.png";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(pngUrl), 1000);
            setCopiedPNG(true);
            setTimeout(() => setCopiedPNG(false), 2000);
          }
        }, "image/png");
      }
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <div className="flex flex-col items-center">
      {/* SVG with entrance animation */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        {/* Animated glow background */}
        <motion.div
          className="absolute -inset-8 rounded-3xl bg-gradient-to-r from-[#FF2574]/20 to-[#FF8AB2]/20 blur-2xl dark:from-[#FF6B00]/20 dark:to-[#FFC000]/20"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <svg
          ref={svgRef}
          role="img"
          aria-label="Lighthouse Dark illustration"
          viewBox="0 0 640 480"
          className="relative z-10 mx-auto w-[400px] select-none drop-shadow-2xl"
        >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            {isDark ? (
              <>
                <stop offset="0%" stopColor="#FF6B00" />
                <stop offset="100%" stopColor="#FFC000" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#FF2574" />
                <stop offset="100%" stopColor="#FF8AB2" />
              </>
            )}
          </linearGradient>
          <linearGradient id={flameGradientId} x1="0" y1="0" x2="0" y2="1">
            {isDark ? (
              <>
                <stop offset="0%" stopColor="#FF6B00" />
                <stop offset="100%" stopColor="#8A2C00" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#FF2574" />
                <stop offset="100%" stopColor="#8A0E3B" />
              </>
            )}
          </linearGradient>
          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          </filter>
        </defs>

        {/* Background glow */}
        <ellipse
          cx="320"
          cy="360"
          rx="220"
          ry="60"
          fill={isDark ? "#00000055" : "#00000010"}
        />

        {/* Browser card */}
        <g>
          <rect
            x="80"
            y="80"
            width="480"
            height="300"
            rx="18"
            fill={isDark ? "#0f0f10" : "#fafafa"}
            stroke={`url(#${gradientId})`}
            strokeWidth="2.5"
          />
          {/* top bar */}
          <rect
            x="80"
            y="80"
            width="480"
            height="42"
            rx="18"
            fill={isDark ? "#141415" : "#f1f1f1"}
          />
          {/* window dots */}
          <circle cx="108" cy="101" r="6" fill={isDark ? "#3f3f46" : "#d4d4d8"} />
          <circle cx="128" cy="101" r="6" fill={isDark ? "#3f3f46" : "#d4d4d8"} />
          <circle cx="148" cy="101" r="6" fill={isDark ? "#3f3f46" : "#d4d4d8"} />
        </g>

        {/* grid */}
        <g opacity={isDark ? 0.25 : 0.15}>
          {Array.from({ length: 6 }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1={100}
              x2={540}
              y1={140 + i * 40}
              y2={140 + i * 40}
              stroke={isDark ? "#ffffff" : "#000000"}
              strokeWidth="1"
            />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <line
              key={`v-${i}`}
              y1={140}
              y2={340}
              x1={100 + i * 44}
              x2={100 + i * 44}
              stroke={isDark ? "#ffffff" : "#000000"}
              strokeWidth="1"
            />
          ))}
        </g>

        {/* line chart */}
        <path
          d="M100 320 L160 300 L200 310 L250 270 L300 285 L340 250 L380 260 L420 220 L460 240 L540 200"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* chart nodes */}
        {[160, 200, 250, 300, 340, 380, 420, 460].map((x, idx) => (
          <circle
            key={`n-${idx}`}
            cx={x}
            cy={idx === 0 ? 300 : idx === 1 ? 310 : idx === 2 ? 270 : idx === 3 ? 285 : idx === 4 ? 250 : idx === 5 ? 260 : idx === 6 ? 220 : 240}
            r="4.5"
            fill={isDark ? "#1f2937" : "#e5e7eb"}
            stroke={`url(#${gradientId})`}
            strokeWidth="3"
          />
        ))}

        {/* flame mark */}
        <g transform="translate(420 140)">
          <path
            d="M70 120c0-28-22-42-22-66 0-12 6-24 6-24s-30 12-36 42c-14-10-20-26-20-42 0-8 2-16 2-16s-40 28-40 70c0 44 34 72 76 72 32 0 56-18 56-36 0-22-14-30-22-30z"
            fill={`url(#${flameGradientId})`}
            opacity={0.9}
            filter="url(#soft)"
          />
          <path
            d="M42 170c-28 0-50-18-50-40 0-20 12-30 12-30s-2 8-2 14c0 20 14 34 34 34 18 0 34-10 34-24 0-14-10-18-10-18s20 8 20 26c0 20-20 38-38 38z"
            fill={isDark ? "#2b0f00" : "#2b0010"}
            opacity={0.7}
          />
        </g>

        {/* title text */}
        <g>
          <text
            x="100"
            y="130"
            fontFamily="system-ui, -apple-system, Segoe UI, Roboto, Inter, sans-serif"
            fontSize="22"
            fontWeight={700}
            fill={isDark ? "#e5e7eb" : "#111827"}
            opacity={0.9}
          >
            Lighthouse Dark
          </text>
          <text
            x="100"
            y="360"
            fontFamily="system-ui, -apple-system, Segoe UI, Roboto, Inter, sans-serif"
            fontSize="14"
            fill={isDark ? "#9ca3af" : "#4b5563"}
          >
            SEO + Core Web Vitals insight, with a spicy roast.
          </text>
        </g>
      </svg>
      </motion.div>

      {/* Enhanced button group with animations */}
      <motion.div 
        className="mt-8 flex flex-wrap gap-3 justify-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <motion.button
          type="button"
          onClick={handleDownloadSVG}
          className="group relative inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#FF2574] to-[#FF8AB2] px-4 py-2.5 font-medium text-white shadow-lg transition-all dark:from-[#FF6B00] dark:to-[#FFC000] hover:shadow-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {!copiedSVG ? (
            <>
              <Download className="h-4 w-4" />
              <span>Download SVG</span>
            </>
          ) : (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Check className="h-4 w-4" />
              </motion.div>
              <span>Downloaded!</span>
            </>
          )}
          
          {/* Shine effect on hover */}
          <motion.div
            className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/0 via-white/20 to-white/0"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.5 }}
            style={{ pointerEvents: "none" }}
          />
        </motion.button>

        <motion.button
          type="button"
          onClick={handleDownloadPNG}
          className="group relative inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#FF2574] to-[#FF8AB2] px-4 py-2.5 font-medium text-white shadow-lg transition-all dark:from-[#FF6B00] dark:to-[#FFC000] hover:shadow-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {!copiedPNG ? (
            <>
              <Download className="h-4 w-4" />
              <span>Download PNG</span>
            </>
          ) : (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Check className="h-4 w-4" />
              </motion.div>
              <span>Downloaded!</span>
            </>
          )}

          {/* Shine effect on hover */}
          <motion.div
            className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/0 via-white/20 to-white/0"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.5 }}
            style={{ pointerEvents: "none" }}
          />
        </motion.button>
      </motion.div>
    </div>
  )
}
