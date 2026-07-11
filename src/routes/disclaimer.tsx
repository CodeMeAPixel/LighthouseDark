import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
	FileWarning,
	ArrowLeft,
	AlertTriangle,
	Flame,
	Shield,
	Scale,
	Database,
	Users,
	RefreshCw,
	Mail,
} from "lucide-react";

export const Route = createFileRoute("/disclaimer")({
	component: DisclaimerPage,
});

const sections = [
	{
		icon: Scale,
		title: "Accuracy of Information",
		content: `While we strive to provide accurate and up-to-date information, Lighthouse Dark makes no warranties or representations about the accuracy, completeness, or reliability of the analysis results. Performance scores and recommendations are based on automated testing and may vary depending on network conditions, server response times, third-party services, caching configurations, and geographic location.`,
	},
	{
		icon: Shield,
		title: "AI-Generated Content",
		content: `The AI-powered suggestions and "roasts" provided by Lighthouse Dark are generated using artificial intelligence (OpenAI GPT-4). These suggestions are for informational purposes only and should not be considered professional advice. Always verify recommendations before implementing changes to your website.`,
	},
	{
		icon: Users,
		title: "Third-Party Services",
		content: `Lighthouse Dark relies on third-party services including Google PageSpeed Insights API and OpenAI. We are not responsible for any changes, outages, or inaccuracies in these services. The availability and functionality of our tool may be affected by these external dependencies.`,
	},
	{
		icon: AlertTriangle,
		title: "Limitation of Liability",
		content: `Lighthouse Dark and its creators shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from the use of this service. This includes, but is not limited to, damages for loss of profits, goodwill, data, or other intangible losses.`,
	},
	{
		icon: Database,
		title: "Privacy",
		content: `We do not store your analysis results or personal data. URLs analyzed are temporarily processed to generate results and are not retained. However, third-party services we use may have their own data retention policies. Please review Google's and OpenAI's privacy policies for more information.`,
	},
	{
		icon: RefreshCw,
		title: "Changes to This Disclaimer",
		content: `We reserve the right to modify this disclaimer at any time. Continued use of Lighthouse Dark after changes constitutes acceptance of the updated terms.`,
	},
];

function DisclaimerPage() {
	return (
		<main className="relative min-h-screen pt-24 pb-32">
			<div className="relative z-10 mx-auto max-w-3xl px-6">
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
							transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
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
						className="accent-pill mb-4"
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.1 }}
					>
						<FileWarning className="h-3.5 w-3.5" />
						Legal
					</motion.div>

					<h1 className="mb-4 text-4xl font-bold tracking-tight text-light12 dark:text-dark12 sm:text-5xl">
						Disclaimer
					</h1>

					<p className="mx-auto max-w-xl text-lg text-light11 dark:text-dark11">
						Important information about the use of Lighthouse Dark.
					</p>
				</motion.div>

				{/* Warning Banner */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="mb-8 flex items-start gap-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-5"
				>
					<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-yellow-500/20">
						<AlertTriangle className="h-5 w-5 text-yellow-400" />
					</div>
					<div>
						<p className="font-medium text-yellow-300 mb-1">
							Please Read Carefully
						</p>
						<p className="text-sm text-yellow-200/80">
							By using Lighthouse Dark, you agree to these terms. Please read
							this disclaimer carefully before using our service.
						</p>
					</div>
				</motion.div>

				{/* Sections */}
				<div className="space-y-4">
					{sections.map((section, index) => {
						const Icon = section.icon;
						return (
							<motion.div
								key={section.title}
								className="glass-surface rounded-xl p-6"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3 + index * 0.05 }}
							>
								<div className="flex items-start gap-4">
									<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-orange-500/20 to-red-500/20">
										<Icon className="h-5 w-5 text-orange-400" />
									</div>
									<div>
										<h2 className="text-lg font-semibold text-light12 dark:text-dark12 mb-2">
											{section.title}
										</h2>
										<p className="text-sm leading-relaxed text-light11 dark:text-dark11">
											{section.content}
										</p>
									</div>
								</div>
							</motion.div>
						);
					})}
				</div>

				{/* Contact Section */}
				<motion.div
					className="glass-surface mt-8 rounded-xl p-6 text-center"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6 }}
				>
					<div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-orange-500/20 to-red-500/20">
						<Mail className="h-6 w-6 text-orange-400" />
					</div>
					<h3 className="mb-2 text-lg font-semibold text-light12 dark:text-dark12">
						Questions?
					</h3>
					<p className="mb-4 text-sm text-light11 dark:text-dark11">
						If you have any questions about this disclaimer, please contact us
						through our GitHub repository.
					</p>
					<a
						href="https://github.com/CodeMeAPixel/LighthouseDark"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-orange-500 to-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-105"
					>
						Contact Us
					</a>
				</motion.div>

				{/* Last Updated */}
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.7 }}
					className="mt-8 text-center text-sm text-light10 dark:text-dark10"
				>
					Last updated:{" "}
					{new Date().toLocaleDateString("en-US", {
						year: "numeric",
						month: "long",
						day: "numeric",
					})}
				</motion.p>
			</div>
		</main>
	);
}
