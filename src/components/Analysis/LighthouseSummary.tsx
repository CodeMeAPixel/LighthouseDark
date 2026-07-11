"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Tabs from "@radix-ui/react-tabs";
import { ChevronDown, Smartphone, Monitor } from "lucide-react";
import type {
	LighthouseData,
	LighthouseMetrics,
} from "@/lib/lighthouseAnalyzer";

interface LighthouseSummaryProps {
	data: LighthouseData;
}

function ScoreGauge({
	score,
	label,
}: {
	score: number | null | undefined;
	label: string;
}) {
	const numScore = score ?? 0;
	const getColor = (s: number) => {
		if (s >= 90) return { color: "#22c55e", bg: "bg-green-500/10" };
		if (s >= 50) return { color: "#eab308", bg: "bg-amber-500/10" };
		return { color: "#ef4444", bg: "bg-red-500/10" };
	};
	const { color, bg } = getColor(numScore);
	const circumference = 2 * Math.PI * 36;
	const strokeDashoffset = circumference - (numScore / 100) * circumference;

	return (
		<motion.div
			className={`flex flex-col items-center rounded-xl p-4 ${bg} backdrop-blur-sm transition-all duration-300`}
			whileHover={{ scale: 1.08, y: -4 }}
		>
			<div className="relative h-20 w-20">
				<svg
					className="h-20 w-20 -rotate-90 transform"
					viewBox="0 0 80 80"
					role="img"
					aria-label="Lighthouse score visualization"
				>
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
						{score ?? "N/A"}
					</span>
				</motion.div>
			</div>
			{label && (
				<span className="mt-2 text-xs text-light11 dark:text-dark11 font-medium">
					{label}
				</span>
			)}
		</motion.div>
	);
}

function MetricTile({
	label,
	value,
	unit = "",
	threshold,
	isCLS = false,
}: {
	label: string;
	value: number | string | null | undefined;
	unit?: string;
	threshold?: { good: number; poor: number };
	isCLS?: boolean;
}) {
	const getMetricColor = (val: number | string | null | undefined) => {
		if (val === null || val === undefined || val === "N/A")
			return "text-light11 dark:text-dark11";
		if (!threshold) return "text-light12 dark:text-dark12";
		const numVal = typeof val === "string" ? parseFloat(val) : val;
		if (numVal <= threshold.good) return "text-green-500";
		if (numVal <= threshold.poor) return "text-amber-500";
		return "text-red-500";
	};

	const formatValue = (val: number | string | null | undefined) => {
		if (val === null || val === undefined) return "N/A";
		if (typeof val === "string") return val;
		if (isCLS) return val.toFixed(3);
		if (val >= 1000) return val.toLocaleString();
		return val.toString();
	};

	return (
		<motion.div
			className="rounded-xl p-4 glass-surface transition-all duration-300"
			whileHover={{ scale: 1.02, y: -2 }}
		>
			<h4 className="mb-2 text-sm font-medium text-light11 dark:text-dark11">
				{label}
			</h4>
			<div className={`text-2xl font-bold ${getMetricColor(value)}`}>
				{formatValue(value)}
				{value !== null && value !== undefined && unit}
			</div>
		</motion.div>
	);
}

function CollapsibleSection({
	title,
	icon,
	children,
	defaultOpen = false,
}: {
	title: string;
	icon: React.ReactNode;
	children: React.ReactNode;
	defaultOpen?: boolean;
}) {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	return (
		<div className="rounded-xl glass-surface overflow-hidden">
			<button
				type="button"
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
						<div className="border-t border-white/10 p-4">{children}</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

function DeviceMetricsPanel({
	metrics,
}: {
	metrics: LighthouseMetrics;
	deviceType: "mobile" | "desktop";
}) {
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
				<h4 className="mb-3 text-sm font-semibold text-light11 dark:text-dark11 uppercase tracking-wide">
					Core Web Vitals
				</h4>
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
					<MetricTile
						label="LCP"
						value={metrics.lcp}
						unit="ms"
						threshold={{ good: 2500, poor: 4000 }}
					/>
					<MetricTile
						label="CLS"
						value={metrics.cls}
						threshold={{ good: 0.1, poor: 0.25 }}
						isCLS
					/>
					<MetricTile
						label="TBT"
						value={metrics.tbt}
						unit="ms"
						threshold={{ good: 200, poor: 600 }}
					/>
				</div>
			</div>

			{/* Additional Metrics */}
			<CollapsibleSection
				title="Additional Metrics"
				icon={null}
				defaultOpen={false}
			>
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
					<MetricTile
						label="FCP"
						value={metrics.fcp}
						unit="ms"
						threshold={{ good: 1800, poor: 3000 }}
					/>
					<MetricTile
						label="Speed Index"
						value={metrics.speedIndex}
						unit="ms"
						threshold={{ good: 3400, poor: 5800 }}
					/>
					<MetricTile
						label="TTFB"
						value={metrics.ttfb}
						unit="ms"
						threshold={{ good: 800, poor: 1800 }}
					/>
					<MetricTile
						label="Total Bytes"
						value={metrics.totalByteWeight}
						unit=" B"
					/>
					<MetricTile label="Requests" value={metrics.networkRequests} />
				</div>
			</CollapsibleSection>

			{/* Opportunities */}
			{metrics.opportunities.length > 0 && (
				<CollapsibleSection
					title="Opportunities"
					icon={null}
					defaultOpen={true}
				>
					<div className="space-y-2">
						{metrics.opportunities.map((opp, i) => (
							<div
								key={`opp-${i}-${opp.title}`}
								className="flex items-center justify-between rounded-lg bg-white/5 p-3"
							>
								<span className="text-sm">{opp.title}</span>
								<span className="text-sm font-medium text-amber-500">
									~{opp.savingsMs}ms
								</span>
							</div>
						))}
					</div>
				</CollapsibleSection>
			)}
		</motion.div>
	);
}

export default function LighthouseSummary({ data }: LighthouseSummaryProps) {
	return (
		<div className="space-y-4">
			<Tabs.Root defaultValue="mobile">
				<Tabs.List className="glass-tabbar mb-4 flex shrink-0 gap-1 rounded-xl p-1.5">
					<Tabs.Trigger
						className="group relative flex h-10 flex-1 cursor-pointer select-none items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium outline-none transition-all duration-200 data-[state=active]:bg-accent/10 data-[state=active]:text-accent"
						value="mobile"
					>
						<Smartphone className="h-4 w-4" />
						<span>Mobile</span>
					</Tabs.Trigger>
					<Tabs.Trigger
						className="group relative flex h-10 flex-1 cursor-pointer select-none items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium outline-none transition-all duration-200 data-[state=active]:bg-accent/10 data-[state=active]:text-accent"
						value="desktop"
					>
						<Monitor className="h-4 w-4" />
						<span>Desktop</span>
					</Tabs.Trigger>
				</Tabs.List>

				<Tabs.Content value="mobile">
					<DeviceMetricsPanel metrics={data.mobile} deviceType="mobile" />
				</Tabs.Content>

				<Tabs.Content value="desktop">
					<DeviceMetricsPanel metrics={data.desktop} deviceType="desktop" />
				</Tabs.Content>
			</Tabs.Root>
		</div>
	);
}
