"use client";

import { motion } from "framer-motion";

export default function ProductHuntBadge() {
	return (
		<motion.div
			className="flex justify-center"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.6, duration: 0.5 }}
		>
			<a
				href="https://www.producthunt.com/products/roast-lab?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-lighthouse-dark-v2"
				target="_blank"
				rel="noopener noreferrer"
				className="group inline-flex items-center gap-3 rounded-full border border-orange-500/20 bg-orange-500/5 px-4 py-2 transition-all duration-300 hover:border-orange-500/40 hover:bg-orange-500/10"
			>
				<img
					src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1070191&theme=dark&t=1769736093150"
					alt="Lighthouse Dark (v2) - The metrics Google is too polite to give you. | Product Hunt"
					width="250"
					height="54"
					className="h-[40px] w-auto transition-transform duration-300 group-hover:scale-105"
				/>
			</a>
		</motion.div>
	);
}
