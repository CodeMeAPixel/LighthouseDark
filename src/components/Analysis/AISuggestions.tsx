import { motion } from "framer-motion";
import {
	Lightbulb,
	AlertTriangle,
	CheckCircle2,
	Flame,
	ArrowRight,
	Zap,
	Search,
	Eye,
	Shield,
	FileText,
	Clock,
	Wrench,
} from "lucide-react";
import type { AISuggestion } from "@/lib/aiSuggestions";

interface AISuggestionsProps {
	suggestions: AISuggestion[];
}

const getImpactStyles = (impact: AISuggestion["impact"]) => {
	switch (impact) {
		case "high":
			return {
				label: "High Impact",
				color: "text-red-500",
				bg: "bg-red-500/10",
				border: "border-red-500/30",
				icon: <Flame className="h-4 w-4" />,
			};
		case "medium":
			return {
				label: "Medium Impact",
				color: "text-amber-500",
				bg: "bg-amber-500/10",
				border: "border-amber-500/30",
				icon: <AlertTriangle className="h-4 w-4" />,
			};
		case "low":
			return {
				label: "Low Impact",
				color: "text-green-500",
				bg: "bg-green-500/10",
				border: "border-green-500/30",
				icon: <CheckCircle2 className="h-4 w-4" />,
			};
	}
};

const getEffortStyles = (effort: AISuggestion["effort"]) => {
	switch (effort) {
		case "low":
			return {
				label: "Quick Fix",
				color: "text-emerald-500",
				icon: <Zap className="h-3 w-3" />,
			};
		case "medium":
			return {
				label: "Some Work",
				color: "text-amber-500",
				icon: <Wrench className="h-3 w-3" />,
			};
		case "high":
			return {
				label: "Major Effort",
				color: "text-red-400",
				icon: <Clock className="h-3 w-3" />,
			};
	}
};

const getCategoryIcon = (category: AISuggestion["category"]) => {
	switch (category) {
		case "performance":
			return <Zap className="h-3.5 w-3.5" />;
		case "seo":
			return <Search className="h-3.5 w-3.5" />;
		case "accessibility":
			return <Eye className="h-3.5 w-3.5" />;
		case "best-practices":
			return <Shield className="h-3.5 w-3.5" />;
		case "content":
			return <FileText className="h-3.5 w-3.5" />;
	}
};

const getCategoryLabel = (category: AISuggestion["category"]) => {
	switch (category) {
		case "performance":
			return "Performance";
		case "seo":
			return "SEO";
		case "accessibility":
			return "Accessibility";
		case "best-practices":
			return "Best Practices";
		case "content":
			return "Content";
	}
};

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { staggerChildren: 0.1 },
	},
};

const itemVariants = {
	hidden: { opacity: 0, x: -20 },
	visible: { opacity: 1, x: 0 },
};

export default function AISuggestions({ suggestions }: AISuggestionsProps) {
	return (
		<motion.div variants={containerVariants} initial="hidden" animate="visible">
			<div className="mb-6 flex items-center gap-3">
				<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF2574] to-[#FF8AB2] dark:from-[#FF6B00] dark:to-[#FFC000]">
					<Lightbulb className="h-5 w-5 text-white" />
				</div>
				<div>
					<h3 className="text-lg font-semibold">AI Roast & Recommendations</h3>
					<p className="text-sm text-light11 dark:text-dark11">
						{suggestions.length} actionable insight
						{suggestions.length !== 1 ? "s" : ""} found
					</p>
				</div>
			</div>

			<div className="space-y-4">
				{suggestions.map((suggestion, index) => {
					// Use the actual impact from the suggestion, with fallback for legacy data
					const impact =
						suggestion.impact ||
						(index < 2 ? "high" : index < 4 ? "medium" : "low");
					const effort = suggestion.effort || "medium";
					const category = suggestion.category || "seo";

					const impactStyles = getImpactStyles(impact);
					const effortStyles = getEffortStyles(effort);

					return (
						<motion.div
							key={`suggestion-${index}-${suggestion.name}`}
							variants={itemVariants}
							className={`group relative overflow-hidden rounded-xl glass-surface transition-all duration-300 hover:shadow-lg border ${impactStyles.border}`}
						>
							<div
								className={`absolute left-0 top-0 h-full w-1 ${impactStyles.bg.replace("/10", "")}`}
							/>

							<div className="p-5 pl-6">
								{/* Top row: Impact badge, Category, and number */}
								<div className="mb-3 flex items-center justify-between flex-wrap gap-2">
									<div className="flex items-center gap-2">
										<div
											className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${impactStyles.bg} ${impactStyles.color}`}
										>
											{impactStyles.icon}
											{impactStyles.label}
										</div>
										<div className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-xs text-light11 dark:text-dark11">
											{getCategoryIcon(category)}
											<span>{getCategoryLabel(category)}</span>
										</div>
									</div>
									<span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-light11 dark:text-dark11">
										#{index + 1}
									</span>
								</div>

								<h4 className="font-semibold text-light12 dark:text-dark12 mb-2">
									{suggestion.name}
								</h4>
								<p className="text-sm leading-relaxed text-light11 dark:text-dark11">
									{suggestion.message}
								</p>

								{/* Bottom row: Effort indicator and action hint */}
								<div className="mt-4 flex items-center justify-between">
									<div
										className={`flex items-center gap-1.5 text-xs ${effortStyles.color}`}
									>
										{effortStyles.icon}
										<span>{effortStyles.label}</span>
									</div>
									<div className="flex items-center gap-2 text-xs text-[#FF2574] opacity-0 transition-opacity group-hover:opacity-100 dark:text-[#FF6B00]">
										<ArrowRight className="h-3 w-3" />
										<span>Take action</span>
									</div>
								</div>
							</div>
						</motion.div>
					);
				})}
			</div>

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
	);
}
