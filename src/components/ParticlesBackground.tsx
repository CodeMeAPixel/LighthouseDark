import { motion } from "framer-motion";

interface ParticlesBackgroundProps {
	variant?: "default" | "error" | "subtle";
	particleCount?: number;
}

// This component should only be rendered on the client
// It's wrapped with ClientOnly in __root.tsx
export default function ParticlesBackground({
	variant = "default",
	particleCount = 12,
}: ParticlesBackgroundProps) {
	const colors = {
		default: {
			particles: "from-orange-500 to-yellow-400",
			glow: "from-orange-500/20 via-red-500/15 to-pink-500/20",
		},
		error: {
			particles: "from-red-500 to-orange-400",
			glow: "from-red-500/20 via-orange-500/10 to-red-500/20",
		},
		subtle: {
			particles: "from-orange-500/60 to-yellow-400/60",
			glow: "from-orange-500/10 via-red-500/5 to-pink-500/10",
		},
	};

	const { particles, glow } = colors[variant];
	const viewportHeight =
		typeof window !== "undefined" ? window.innerHeight : 800;

	return (
		<div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
			{/* Floating embers/particles */}
			{[...Array(particleCount)].map((_, i) => {
				const particleKey = `particle-${i}-${Math.random().toString(36).slice(2, 9)}`;
				return (
					<motion.div
						key={particleKey}
						className={`absolute h-1.5 w-1.5 rounded-full bg-linear-to-t ${particles}`}
						style={{
							left: `${5 + i * (90 / particleCount)}%`,
							bottom: "-5%",
						}}
						animate={{
							y: [0, -viewportHeight * 1.2],
							x: [0, Math.sin(i * 0.8) * 40, Math.sin(i * 0.8) * 60],
							opacity: [0, 0.8, 0],
							scale: [0.5, 1, 0.3],
						}}
						transition={{
							duration: 6 + i * 0.4,
							repeat: Infinity,
							delay: i * 0.5,
							ease: "easeOut",
						}}
					/>
				);
			})}

			{/* Central gradient glow */}
			<div className="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2">
				<motion.div
					className={`h-[600px] w-[600px] rounded-full bg-linear-to-r ${glow} blur-[120px]`}
					animate={{
						scale: [1, 1.15, 1],
						opacity: [0.4, 0.6, 0.4],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>
			</div>

			{/* Secondary accent glow */}
			<div className="absolute right-0 bottom-1/4 translate-x-1/2">
				<motion.div
					className={`h-[400px] w-[400px] rounded-full bg-linear-to-l ${glow} blur-[100px]`}
					animate={{
						scale: [1, 1.2, 1],
						opacity: [0.2, 0.4, 0.2],
					}}
					transition={{
						duration: 6,
						repeat: Infinity,
						ease: "easeInOut",
						delay: 2,
					}}
				/>
			</div>

			{/* Top left accent */}
			<div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2">
				<motion.div
					className={`h-[300px] w-[300px] rounded-full bg-linear-to-br ${glow} blur-[80px]`}
					animate={{
						scale: [1, 1.1, 1],
						opacity: [0.3, 0.5, 0.3],
					}}
					transition={{
						duration: 7,
						repeat: Infinity,
						ease: "easeInOut",
						delay: 1,
					}}
				/>
			</div>
		</div>
	);
}
