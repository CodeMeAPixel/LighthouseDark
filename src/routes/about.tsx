import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Zap, Target, Sparkles, BarChart3, Globe, ArrowLeft, Flame, Github, Heart } from 'lucide-react'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

const features = [
  {
    icon: BarChart3,
    title: 'Performance Analysis',
    description: 'Get detailed Core Web Vitals and Lighthouse scores for both mobile and desktop devices.',
  },
  {
    icon: Target,
    title: 'SEO Insights',
    description: 'Analyze meta tags, Open Graph data, robots directives, and more for better search visibility.',
  },
  {
    icon: Sparkles,
    title: 'AI Recommendations',
    description: 'Receive personalized, actionable suggestions powered by GPT-4 to improve your website.',
  },
  {
    icon: Globe,
    title: 'Real-World Testing',
    description: 'Uses Google PageSpeed Insights API for accurate, real-world performance data.',
  },
]

const techStack = [
  { name: 'TanStack Start', description: 'Full-stack React framework' },
  { name: 'Google PageSpeed Insights', description: 'Real-world performance data' },
  { name: 'OpenAI GPT-4', description: 'AI-powered recommendations' },
  { name: 'Cloudflare Workers', description: 'Edge deployment' },
  { name: 'Tailwind CSS', description: 'Modern styling' },
]

function AboutPage() {
  return (
    <main className="relative min-h-screen pt-24 pb-32">
      <div className="relative z-10 mx-auto max-w-4xl px-6">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-light11 transition-colors hover:text-orange-400 dark:text-dark11"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          className="mt-8 mb-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 flex justify-center">
            <motion.div
              className="inline-flex"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 100, delay: 0.1 }}
            >
              <div className="relative">
                <Flame className="h-16 w-16 text-orange-500 drop-shadow-[0_0_30px_rgba(249,115,22,0.4)]" />
                <motion.div
                  className="absolute inset-0"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Flame className="h-16 w-16 text-yellow-400/40 blur-sm" />
                </motion.div>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-xs font-medium text-orange-400"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Zap className="h-3.5 w-3.5" />
            About Us
          </motion.div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight text-light12 dark:text-dark12 sm:text-5xl">
            About{' '}
            <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
              Lighthouse Dark
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-light11 dark:text-dark11">
            A modern web performance and SEO analysis tool designed to help developers and site owners 
            understand and improve their websites.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          className="glass-surface mb-8 rounded-2xl p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20">
              <Heart className="h-6 w-6 text-orange-400" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-light12 dark:text-dark12 mb-2">Our Mission</h2>
              <p className="text-light11 dark:text-dark11">
                Lighthouse Dark was created with a simple goal: make web performance analysis accessible, 
                beautiful, and actionable. We believe that every website deserves to be fast, and every 
                developer should have the tools to make it happen.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold text-light12 dark:text-dark12 mb-6 text-center">What We Offer</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  className="glass-surface group rounded-xl p-5 transition-all hover:bg-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20 transition-all group-hover:from-orange-500/30 group-hover:to-red-500/30">
                    <Icon className="h-5 w-5 text-orange-400" />
                  </div>
                  <h3 className="text-base font-semibold text-light12 dark:text-dark12 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-light11 dark:text-dark11">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          className="glass-surface mb-8 rounded-2xl p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold text-light12 dark:text-dark12 mb-6">Built With</h2>
          <div className="flex flex-wrap gap-3">
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.name}
                className="group relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
              >
                <div className="rounded-full border border-orange-500/20 bg-orange-500/5 px-4 py-2 text-sm font-medium text-light12 transition-all group-hover:border-orange-500/40 group-hover:bg-orange-500/10 dark:text-dark12">
                  {tech.name}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Open Source CTA */}
        <motion.div
          className="glass-surface rounded-2xl p-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20">
            <Github className="h-7 w-7 text-orange-400" />
          </div>
          <h2 className="text-2xl font-semibold text-light12 dark:text-dark12 mb-3">Open Source</h2>
          <p className="mb-6 text-light11 dark:text-dark11 max-w-lg mx-auto">
            Lighthouse Dark is open source. We welcome contributions, bug reports, and feature requests from the community.
          </p>
          <a
            href="https://github.com/codemeapixel/roast-lab"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-orange-500/30"
          >
            <Github className="h-5 w-5" />
            View on GitHub
          </a>
        </motion.div>
      </div>
    </main>
  )
}
