"use client";

import { motion } from "framer-motion";
import { Sparkles, Flame } from "lucide-react";
import AnalyzerForm from "@/components/Analysis/AnalyzerForm";
import LandingSections from "@/components/Hero/LandingSections";
import { useUrlStore } from "@/lib/store";

export default function HomePage() {
	const { currentUrl, isLoading, results } = useUrlStore();
	const showLanding = !currentUrl && !isLoading && !results;

	return (
		<main className="relative min-h-screen pt-24 pb-32">
			<div className="relative z-10 mx-auto max-w-5xl px-6">
				{/* Hero Section */}
				<motion.div
					className="mb-12 text-center"
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					<div className="mb-6 flex justify-center">
						<motion.div
							className="inline-flex"
							initial={{ scale: 0, rotate: -180 }}
							animate={{ scale: 1, rotate: 0 }}
							transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
						>
							<div className="relative">
								<motion.div
									animate={{ y: [0, -5, 0] }}
									transition={{
										duration: 2,
										repeat: Infinity,
										ease: "easeInOut",
									}}
								>
									<Flame className="h-16 w-16 text-orange-500 drop-shadow-[0_0_30px_rgba(249,115,22,0.4)]" />
								</motion.div>
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
						className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-xs font-medium text-orange-400"
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.1, duration: 0.4 }}
					>
						<motion.div
							animate={{ scale: [1, 1.2, 1] }}
							transition={{ duration: 2, repeat: Infinity }}
						>
							<Sparkles className="h-3.5 w-3.5" />
						</motion.div>
						Powered by AI & Lighthouse
					</motion.div>

					<motion.h1
						className="mb-4 text-4xl font-bold tracking-tight text-light12 dark:text-dark12 sm:text-5xl lg:text-6xl"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2, duration: 0.5 }}
					>
						<span className="inline-block">Roast Your</span>{" "}
						<span className="inline-block bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
							Website
						</span>
					</motion.h1>

					<motion.p
						className="mx-auto max-w-2xl text-lg text-light11 dark:text-dark11"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3, duration: 0.5 }}
					>
						Get instant performance insights, SEO analysis, and AI-powered
						recommendations to make your website faster and more discoverable.
					</motion.p>
				</motion.div>

				{/* Analyzer Form */}
				<motion.div
					className="mb-16"
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4, duration: 0.5 }}
				>
					<AnalyzerForm />
				</motion.div>

				{/* Landing Sections (shown when not analyzing) */}
				<LandingSections />

				{/* Quick Stats */}
				{showLanding && (
					<motion.div
						className="mt-20 text-center"
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.8, duration: 0.5 }}
					>
						<p className="text-sm text-light10 dark:text-dark10">
							Trusted by developers worldwide • Free forever • No sign-up
							required
						</p>
					</motion.div>
				)}
			</div>
		</main>
	);
}
