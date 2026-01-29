"use client";

import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
	Home,
	ArrowLeft,
	Flame,
	Compass,
	MapPin,
	Sparkles,
} from "lucide-react";

export default function NotFound() {
	return (
		<div className="relative flex min-h-[80vh] flex-col items-center justify-center px-4 py-16">
			{/* Main content */}
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="relative z-10 flex flex-col items-center"
			>
				{/* Flame Icon with 404 */}
				<motion.div
					className="relative mb-8 flex justify-center w-full"
					initial={{ scale: 0.5, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ type: "spring", stiffness: 100 }}
				>
					<motion.div
						className="relative"
						animate={{
							y: [0, -8, 0],
						}}
						transition={{
							duration: 2,
							repeat: Infinity,
							ease: "easeInOut",
						}}
					>
						<Flame
							className="h-28 w-28 text-orange-500 drop-shadow-[0_0_40px_rgba(249,115,22,0.5)] md:h-36 md:w-36"
							strokeWidth={1.5}
						/>
						<motion.div
							className="absolute inset-0 flex items-center justify-center"
							animate={{ opacity: [0.5, 1, 0.5] }}
							transition={{ duration: 1.5, repeat: Infinity }}
						>
							<Flame
								className="h-28 w-28 text-yellow-400/50 blur-sm md:h-36 md:w-36"
								strokeWidth={1.5}
							/>
						</motion.div>
					</motion.div>

					{/* 404 text overlay */}
					<motion.div
						className="absolute -bottom-3 left-1/2 -translate-x-1/2"
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
					>
						<span className="text-4xl font-black tracking-tight text-white drop-shadow-lg md:text-5xl">
							404
						</span>
					</motion.div>
				</motion.div>

				{/* Title */}
				<motion.h1
					className="mb-3 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-center text-3xl font-bold text-transparent md:text-4xl"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					Page Got Roasted
				</motion.h1>

				{/* Subtitle */}
				<motion.p
					className="mb-8 max-w-md text-center text-light11 dark:text-dark11"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
				>
					This page was burned to a crisp. It either never existed, moved
					somewhere else, or got a little too close to the flame.
				</motion.p>

				{/* Helpful hints */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className="mb-8 w-full max-w-md"
				>
					<div className="glass-surface rounded-2xl p-5">
						<div className="mb-4 flex items-center gap-2 text-orange-400">
							<Compass className="h-5 w-5" />
							<span className="font-semibold">Lost? Here's a map:</span>
						</div>
						<div className="space-y-2">
							{[
								{
									icon: Home,
									text: "Head back home to analyze a new site",
									to: "/",
								},
								{
									icon: MapPin,
									text: "Check out the About page",
									to: "/about",
								},
								{
									icon: Sparkles,
									text: "Read our FAQs for guidance",
									to: "/faqs",
								},
							].map((item) => (
								<Link
									key={item.to}
									to={item.to}
									className="group flex items-center gap-3 rounded-xl p-2.5 transition-all hover:bg-white/5"
								>
									<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20 transition-all group-hover:from-orange-500/30 group-hover:to-red-500/30">
										<item.icon className="h-4 w-4 text-orange-400" />
									</div>
									<span className="text-sm text-light11 transition-colors group-hover:text-orange-300 dark:text-dark11">
										{item.text}
									</span>
								</Link>
							))}
						</div>
					</div>
				</motion.div>

				{/* Action buttons */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
					className="flex flex-wrap justify-center gap-4"
				>
					<Link
						to="/"
						className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-orange-500/30"
					>
						<Home className="h-5 w-5" />
						Back to Home
					</Link>

					<button
						type="button"
						onClick={() => window.history.back()}
						className="glass-surface inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-light12 transition-all hover:bg-white/10 dark:text-dark12"
					>
						<ArrowLeft className="h-5 w-5" />
						Go Back
					</button>
				</motion.div>

				{/* Footer */}
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.7 }}
					className="mt-12 text-xs text-light10 dark:text-dark10"
				>
					Error 404 • Page not found
				</motion.p>
			</motion.div>
		</div>
	);
}
