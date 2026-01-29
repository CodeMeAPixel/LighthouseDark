"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const ANALYSIS_MESSAGES = [
	{ text: "Scanning your site...", emoji: "🔍" },
	{ text: "Checking those Core Web Vitals...", emoji: "📊" },
	{ text: "Judging your CSS choices...", emoji: "🎨" },
	{ text: "Measuring that LCP...", emoji: "⏱️" },
	{ text: "Finding layout shifts...", emoji: "📐" },
	{ text: "Analyzing SEO signals...", emoji: "🔎" },
	{ text: "Preparing the roast...", emoji: "🔥" },
	{ text: "Almost there...", emoji: "⚡" },
	{ text: "Crunching the numbers...", emoji: "🧮" },
	{ text: "Interrogating your JavaScript...", emoji: "🕵️" },
	{ text: "Rating your accessibility...", emoji: "♿" },
	{ text: "Inspecting third-party scripts...", emoji: "👀" },
];

function ScanParticles() {
	const dotIds = Array.from(
		{ length: 12 },
		(_, i) => `dot-${i}-${Math.random().toString(36).slice(2, 9)}`,
	);
	return (
		<div className="absolute inset-0 overflow-hidden">
			{[...Array(12)].map((_, i) => (
				<motion.div
					key={dotIds[i]}
					className="absolute h-1 w-1 rounded-full bg-gradient-to-r from-[#FF2574]/0 via-[#FF2574] to-[#FF2574]/0 dark:from-[#FF6B00]/0 dark:via-[#FF6B00] dark:to-[#FF6B00]/0"
					initial={{
						left: `${Math.random() * 100}%`,
						top: "-10px",
						opacity: 0,
					}}
					animate={{
						top: "100%",
						opacity: [0, 1, 0],
					}}
					transition={{
						duration: 2 + Math.random(),
						repeat: Infinity,
						delay: i * 0.15,
						ease: "linear",
					}}
				/>
			))}
		</div>
	);
}

export default function Scanner() {
	const [messageIndex, setMessageIndex] = useState(0);
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const messageInterval = setInterval(() => {
			setMessageIndex((prev) => (prev + 1) % ANALYSIS_MESSAGES.length);
		}, 2500);

		const progressInterval = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 95) return 95;
				return prev + Math.random() * 8;
			});
		}, 500);

		return () => {
			clearInterval(messageInterval);
			clearInterval(progressInterval);
		};
	}, []);

	const currentMessage = ANALYSIS_MESSAGES[messageIndex];

	return (
		<motion.div
			className="mt-8 flex flex-col items-center justify-center gap-4"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<div className="relative w-full max-w-sm">
				<motion.div
					className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-[#FF2574]/20 to-[#FF8AB2]/20 blur-xl dark:from-[#FF6B00]/20 dark:to-[#FFC000]/20"
					animate={{
						opacity: [0.3, 0.6, 0.3],
					}}
					transition={{
						duration: 3,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>

				<div className="relative overflow-hidden rounded-2xl border border-white/10 bg-light2 shadow-2xl dark:bg-dark2">
					<div className="flex h-10 items-center gap-2 border-b border-white/10 bg-light3 px-4 dark:bg-dark3">
						<div className="flex gap-1.5">
							<motion.div
								className="h-3 w-3 rounded-full bg-red-400/80"
								whileHover={{ scale: 1.2 }}
							/>
							<motion.div
								className="h-3 w-3 rounded-full bg-amber-400/80"
								whileHover={{ scale: 1.2 }}
							/>
							<motion.div
								className="h-3 w-3 rounded-full bg-green-400/80"
								whileHover={{ scale: 1.2 }}
							/>
						</div>
						<div className="ml-2 flex-1 rounded-md bg-white/10 px-3 py-1 text-xs text-light11 dark:text-dark11 backdrop-blur-sm">
							<motion.span
								animate={{ opacity: [0.5, 1, 0.5] }}
								transition={{ duration: 1.5, repeat: Infinity }}
							>
								Analyzing...
							</motion.span>
						</div>
					</div>

					<div className="relative h-56 p-4">
						<ScanParticles />

						<div className="relative z-10 space-y-3">
							<div className="flex items-center gap-3">
								<motion.div
									className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#FF2574]/30 to-[#FF8AB2]/20 dark:from-[#FF6B00]/30 dark:to-[#FFC000]/20"
									animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.05, 1] }}
									transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
								/>
								<motion.div
									className="h-4 flex-1 rounded-md bg-light4 dark:bg-dark4"
									animate={{ opacity: [0.5, 0.8, 0.5] }}
									transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
								/>
							</div>
							{[...Array(5)].map((_, i) => {
								const barKey = `skeleton-${Date.now()}-${i}`;
								return (
									<motion.div
										key={barKey}
										className="h-3 rounded-md bg-light4 dark:bg-dark4"
										style={{ width: `${70 + Math.random() * 30}%` }}
										animate={{ opacity: [0.4, 0.7, 0.4] }}
										transition={{
											duration: 1.5,
											repeat: Infinity,
											delay: i * 0.15,
										}}
									/>
								);
							})}
						</div>

						<motion.div
							className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#FF2574] to-[#FF8AB2] dark:from-[#FF6B00] dark:to-[#FFC000]"
							initial={{ width: "0%" }}
							animate={{ width: `${progress}%` }}
							transition={{ duration: 0.3 }}
						/>
					</div>
				</div>
			</div>

			<motion.div
				className="flex flex-col items-center gap-2 text-center"
				key={messageIndex}
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -10 }}
				transition={{ duration: 0.3 }}
			>
				<span className="text-3xl">{currentMessage.emoji}</span>
				<p className="text-sm font-medium text-light11 dark:text-dark11">
					{currentMessage.text}
				</p>
			</motion.div>
		</motion.div>
	);
}
