import { useId } from "react";

interface LogoProps {
	size?: number;
	className?: string;
}

export default function Logo({ size = 40, className = "" }: LogoProps) {
	const rayGradientId = useId();
	const bodyGradientId = useId();
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 512 512"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
			aria-label="Lighthouse Dark Logo"
		>
			<title>Lighthouse Dark Logo</title>
			<defs>
				{/* Main gradient for rays - uses CSS variables for theme support */}
				<linearGradient id={rayGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
					<stop
						offset="0%"
						className="[stop-color:#FF6B00] dark:[stop-color:#FF6B00]"
						style={{ stopColor: "var(--logo-primary, #FF6B00)" }}
					/>
					<stop
						offset="100%"
						className="[stop-color:#FF2574] dark:[stop-color:#FF2574]"
						style={{ stopColor: "var(--logo-secondary, #FF2574)" }}
					/>
				</linearGradient>

				{/* Lighthouse body - adapts to theme */}
				<linearGradient id={bodyGradientId} x1="0%" y1="100%" x2="0%" y2="0%">
					<stop
						offset="0%"
						className="dark:[stop-color:#1a1a1a] [stop-color:#f5f5f5]"
						style={{ stopColor: "var(--logo-body-dark, #1a1a1a)" }}
					/>
					<stop
						offset="100%"
						className="dark:[stop-color:#2a2a2a] [stop-color:#ffffff]"
						style={{ stopColor: "var(--logo-body-light, #2a2a2a)" }}
					/>
				</linearGradient>
			</defs>

			{/* Light rays emanating from top */}
			<g
				transform="translate(256, 140)"
				className="fill-[#FF6B00] dark:fill-[#FF6B00]"
			>
				<rect
					x="-8"
					y="-120"
					width="16"
					height="60"
					rx="8"
					transform="rotate(0)"
				/>
				<rect
					x="-8"
					y="-120"
					width="16"
					height="50"
					rx="8"
					transform="rotate(25)"
				/>
				<rect
					x="-8"
					y="-120"
					width="16"
					height="55"
					rx="8"
					transform="rotate(50)"
				/>
				<rect
					x="-8"
					y="-120"
					width="16"
					height="45"
					rx="8"
					transform="rotate(75)"
				/>
				<rect
					x="-8"
					y="-120"
					width="16"
					height="50"
					rx="8"
					transform="rotate(100)"
				/>
				<rect
					x="-8"
					y="-120"
					width="16"
					height="55"
					rx="8"
					transform="rotate(125)"
				/>
				<rect
					x="-8"
					y="-120"
					width="16"
					height="45"
					rx="8"
					transform="rotate(155)"
				/>
				<rect
					x="-8"
					y="-120"
					width="16"
					height="60"
					rx="8"
					transform="rotate(180)"
				/>
				<rect
					x="-8"
					y="-120"
					width="16"
					height="45"
					rx="8"
					transform="rotate(-155)"
				/>
				<rect
					x="-8"
					y="-120"
					width="16"
					height="55"
					rx="8"
					transform="rotate(-125)"
				/>
				<rect
					x="-8"
					y="-120"
					width="16"
					height="50"
					rx="8"
					transform="rotate(-100)"
				/>
				<rect
					x="-8"
					y="-120"
					width="16"
					height="45"
					rx="8"
					transform="rotate(-75)"
				/>
				<rect
					x="-8"
					y="-120"
					width="16"
					height="55"
					rx="8"
					transform="rotate(-50)"
				/>
				<rect
					x="-8"
					y="-120"
					width="16"
					height="50"
					rx="8"
					transform="rotate(-25)"
				/>
			</g>

			{/* Lighthouse structure */}
			<g transform="translate(256, 256)">
				{/* Base/platform */}
				<rect
					x="-100"
					y="140"
					width="200"
					height="20"
					rx="4"
					className="fill-[#FF6B00]"
				/>

				{/* Main tower body */}
				<path
					d="M-60 140 L-40 -20 L40 -20 L60 140 Z"
					className="fill-white dark:fill-[#1a1a1a] stroke-[#FF6B00]"
					strokeWidth="3"
				/>

				{/* Stripes on tower */}
				<rect
					x="-55"
					y="100"
					width="110"
					height="20"
					className="fill-[#FF6B00]"
					opacity="0.8"
				/>
				<rect
					x="-48"
					y="40"
					width="96"
					height="20"
					className="fill-[#FF6B00]"
					opacity="0.8"
				/>

				{/* Light housing */}
				<rect
					x="-45"
					y="-60"
					width="90"
					height="45"
					rx="4"
					className="fill-white dark:fill-[#2a2a2a] stroke-[#FF6B00]"
					strokeWidth="3"
				/>

				{/* Light window/lens */}
				<rect
					x="-30"
					y="-52"
					width="60"
					height="30"
					rx="2"
					className="fill-[#FFC000]"
				/>
				<rect
					x="-20"
					y="-48"
					width="8"
					height="22"
					className="fill-black/20 dark:fill-black/30"
				/>
				<rect
					x="-4"
					y="-48"
					width="8"
					height="22"
					className="fill-black/20 dark:fill-black/30"
				/>
				<rect
					x="12"
					y="-48"
					width="8"
					height="22"
					className="fill-black/20 dark:fill-black/30"
				/>

				{/* Roof/dome */}
				<path d="M-50 -60 L0 -95 L50 -60 Z" className="fill-[#FF6B00]" />
				<circle cx="0" cy="-95" r="8" className="fill-[#FFC000]" />
			</g>

			{/* Wave at bottom */}
			<path
				d="M80 430 Q120 400, 160 430 Q200 460, 240 430 Q280 400, 320 430 Q360 460, 400 430 Q440 400, 480 430 L480 480 L80 480 Z"
				className="fill-[#FF6B00]/30"
			/>
		</svg>
	);
}
