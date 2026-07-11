"use client";

import { motion } from "framer-motion";
import {
	AlertTriangle,
	Bot,
	ImageOff,
	FileQuestion,
	Type,
	Hash,
	CheckCircle2,
	XCircle,
	AlertCircle,
	Sparkles,
} from "lucide-react";
import type { SlopIndicator } from "@/lib/aiSuggestions";

interface SlopAnalysisProps {
	indicators: SlopIndicator[];
}

const getSlopDetails = (
	type: string,
): {
	icon: React.ReactNode;
	title: string;
	description: string;
	category: string;
} => {
	switch (type) {
		case "generic-title":
			return {
				icon: <Type className="h-4 w-4" />,
				title: "Generic Title",
				description:
					"Your title looks like a template placeholder. Make it unique and descriptive.",
				category: "Content",
			};
		case "generic-description":
			return {
				icon: <FileQuestion className="h-4 w-4" />,
				title: "Generic Description",
				description:
					"Meta description appears to be placeholder text. Write compelling, unique copy.",
				category: "Content",
			};
		case "ai-content-markers":
			return {
				icon: <Bot className="h-4 w-4" />,
				title: "AI Content Detected",
				description:
					"Content contains common AI-generated phrases. Consider editing for authenticity.",
				category: "Quality",
			};
		case "stock-og-image":
			return {
				icon: <ImageOff className="h-4 w-4" />,
				title: "Stock OG Image",
				description:
					"Using stock photos for social previews looks generic. Create custom branded images.",
				category: "Branding",
			};
		case "missing-title":
			return {
				icon: <XCircle className="h-4 w-4" />,
				title: "Missing Title",
				description:
					"No title tag found. This is critical for SEO and user experience.",
				category: "SEO",
			};
		case "missing-description":
			return {
				icon: <XCircle className="h-4 w-4" />,
				title: "Missing Description",
				description:
					"No meta description. Search engines will auto-generate one from your content.",
				category: "SEO",
			};
		case "missing-h1":
			return {
				icon: <Hash className="h-4 w-4" />,
				title: "No H1 Heading",
				description:
					"Every page needs one H1 heading for proper document structure.",
				category: "SEO",
			};
		case "multiple-h1":
			return {
				icon: <AlertCircle className="h-4 w-4" />,
				title: "Multiple H1 Tags",
				description:
					"Pages should have exactly one H1. Multiple H1s confuse document hierarchy.",
				category: "SEO",
			};
		case "keyword-stuffing":
			return {
				icon: <AlertTriangle className="h-4 w-4" />,
				title: "Keyword Stuffing",
				description:
					"Same keywords repeated excessively. This can hurt rankings and readability.",
				category: "Quality",
			};
		default:
			return {
				icon: <AlertTriangle className="h-4 w-4" />,
				title: type.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
				description:
					"Quality issue detected that may affect user experience or SEO.",
				category: "Other",
			};
	}
};

const getSeverityStyles = (severity: SlopIndicator["severity"]) => {
	switch (severity) {
		case "high":
			return {
				bg: "bg-red-500/10",
				border: "border-red-500/30",
				text: "text-red-500",
				label: "Critical",
			};
		case "medium":
			return {
				bg: "bg-amber-500/10",
				border: "border-amber-500/30",
				text: "text-amber-500",
				label: "Warning",
			};
		case "low":
			return {
				bg: "bg-blue-500/10",
				border: "border-blue-500/30",
				text: "text-blue-500",
				label: "Info",
			};
	}
};

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { staggerChildren: 0.08 },
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 10 },
	visible: { opacity: 1, y: 0 },
};

export default function SlopAnalysis({ indicators }: SlopAnalysisProps) {
	const highCount = indicators.filter((i) => i.severity === "high").length;
	const mediumCount = indicators.filter((i) => i.severity === "medium").length;
	const lowCount = indicators.filter((i) => i.severity === "low").length;

	const getOverallScore = () => {
		if (indicators.length === 0)
			return { score: 100, label: "Excellent", color: "text-green-500" };
		if (highCount > 2)
			return { score: 20, label: "Poor", color: "text-red-500" };
		if (highCount > 0)
			return { score: 40, label: "Needs Work", color: "text-orange-500" };
		if (mediumCount > 2)
			return { score: 60, label: "Fair", color: "text-amber-500" };
		if (mediumCount > 0)
			return { score: 75, label: "Good", color: "text-yellow-500" };
		return { score: 90, label: "Great", color: "text-green-500" };
	};

	const overall = getOverallScore();

	return (
		<motion.div
			variants={containerVariants}
			initial="hidden"
			animate="visible"
			className="space-y-6"
		>
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-purple-500 to-pink-500">
						<Sparkles className="h-5 w-5 text-white" />
					</div>
					<div>
						<h3 className="text-lg font-semibold">Content Quality Analysis</h3>
						<p className="text-sm text-light11 dark:text-dark11">
							Detecting generic content, AI slop, and quality issues
						</p>
					</div>
				</div>

				{/* Score badge */}
				<div
					className={`flex items-center gap-2 rounded-full px-4 py-2 ${overall.score >= 75 ? "bg-green-500/10" : overall.score >= 50 ? "bg-amber-500/10" : "bg-red-500/10"}`}
				>
					<span className={`text-2xl font-bold ${overall.color}`}>
						{overall.score}
					</span>
					<div className="text-left">
						<span className={`block text-sm font-medium ${overall.color}`}>
							{overall.label}
						</span>
						<span className="block text-xs text-light11 dark:text-dark11">
							Quality Score
						</span>
					</div>
				</div>
			</div>

			{/* Summary stats */}
			{indicators.length > 0 && (
				<motion.div variants={itemVariants} className="flex gap-4">
					{highCount > 0 && (
						<div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-1.5">
							<XCircle className="h-4 w-4 text-red-500" />
							<span className="text-sm font-medium text-red-500">
								{highCount} Critical
							</span>
						</div>
					)}
					{mediumCount > 0 && (
						<div className="flex items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-1.5">
							<AlertTriangle className="h-4 w-4 text-amber-500" />
							<span className="text-sm font-medium text-amber-500">
								{mediumCount} Warning
							</span>
						</div>
					)}
					{lowCount > 0 && (
						<div className="flex items-center gap-2 rounded-lg bg-blue-500/10 px-3 py-1.5">
							<AlertCircle className="h-4 w-4 text-blue-500" />
							<span className="text-sm font-medium text-blue-500">
								{lowCount} Info
							</span>
						</div>
					)}
				</motion.div>
			)}

			{/* No issues state */}
			{indicators.length === 0 && (
				<motion.div
					variants={itemVariants}
					className="flex flex-col items-center justify-center rounded-xl border border-green-500/30 bg-green-500/5 p-8 text-center"
				>
					<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
						<CheckCircle2 className="h-8 w-8 text-green-500" />
					</div>
					<h4 className="mb-2 text-lg font-semibold text-green-500">
						No Quality Issues Found
					</h4>
					<p className="max-w-md text-sm text-light11 dark:text-dark11">
						Great job! Your content appears to be original, well-structured, and
						free from common quality issues.
					</p>
				</motion.div>
			)}

			{/* Issues list */}
			{indicators.length > 0 && (
				<div className="space-y-3">
					{indicators.map((indicator, index) => {
						const details = getSlopDetails(indicator.type);
						const severity = getSeverityStyles(indicator.severity);

						return (
							<motion.div
								key={`slop-${index}-${indicator.type}`}
								variants={itemVariants}
								className={`relative overflow-hidden rounded-xl border ${severity.border} ${severity.bg} p-4 transition-all hover:shadow-md`}
							>
								<div className="flex items-start gap-4">
									{/* Icon */}
									<div
										className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${severity.bg} ${severity.text}`}
									>
										{details.icon}
									</div>

									{/* Content */}
									<div className="flex-1 min-w-0">
										<div className="mb-1 flex items-center gap-2 flex-wrap">
											<h4 className="font-semibold text-light12 dark:text-dark12">
												{details.title}
											</h4>
											<span
												className={`rounded-full px-2 py-0.5 text-xs font-medium ${severity.bg} ${severity.text}`}
											>
												{severity.label}
											</span>
											<span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-light11 dark:text-dark11">
												{details.category}
											</span>
										</div>
										<p className="text-sm text-light11 dark:text-dark11">
											{details.description}
										</p>
										{indicator.evidence && (
											<p className="mt-2 rounded-lg bg-black/10 px-3 py-1.5 text-xs font-mono text-light11 dark:bg-white/5 dark:text-dark11">
												Evidence: {indicator.evidence}
											</p>
										)}
									</div>
								</div>
							</motion.div>
						);
					})}
				</div>
			)}

			{/* Footer tip */}
			<motion.div
				variants={itemVariants}
				className="rounded-xl bg-linear-to-r from-purple-500/10 to-pink-500/10 p-4"
			>
				<div className="flex items-center gap-3">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 dark:bg-white/10">
						<Bot className="h-4 w-4 text-purple-500" />
					</div>
					<div>
						<p className="text-sm font-medium">Why does this matter?</p>
						<p className="text-xs text-light11 dark:text-dark11">
							Search engines and users can detect low-quality content. Original,
							authentic content ranks better and converts more.
						</p>
					</div>
				</div>
			</motion.div>
		</motion.div>
	);
}
