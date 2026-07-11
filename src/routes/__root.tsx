import {
	HeadContent,
	Scripts,
	createRootRouteWithContext,
} from "@tanstack/react-router";
import { lazy, Suspense } from "react";

import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";

import NavPill from "../components/Static/NavPill";
import FloatNav from "../components/Static/FloatNav";
import NotFound from "../components/Feedback/NotFound";
import ErrorBoundary from "../components/Feedback/ErrorBoundary";

// Lazy load ParticlesBackground to ensure it only renders on client
const ParticlesBackground = lazy(
	() => import("../components/ui/ParticlesBackground"),
);

import appCss from "../styles.css?url";

import type { QueryClient } from "@tanstack/react-query";

interface MyRouterContext {
	queryClient: QueryClient;
}

const SITE_URL = "https://lighthousedark.org";
const SITE_NAME = "Lighthouse Dark";
const SITE_TITLE =
	"Lighthouse Dark - The metrics Google is too polite to give you";
const SITE_DESCRIPTION =
	"Get a blunt, witty critique of your website's SEO and Core Web Vitals with real data and actionable fixes. Free AI-powered performance analysis.";

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			// Basic
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover",
			},
			{ title: SITE_TITLE },
			{ name: "description", content: SITE_DESCRIPTION },

			// Extended Keywords (comprehensive for SEO)
			{
				name: "keywords",
				content:
					"Lighthouse, SEO, Web Vitals, Performance, Website Analysis, Core Web Vitals, CrUX, PageSpeed Insights, Web Performance, SEO Analyzer, Performance Testing, Website Speed, LCP, FID, CLS, INP, TTFB, FCP, Largest Contentful Paint, First Input Delay, Cumulative Layout Shift, Interaction to Next Paint, Time to First Byte, First Contentful Paint, Google Lighthouse, Chrome UX Report, Page Experience, Mobile Performance, Desktop Performance, Web Accessibility, Best Practices Audit, SEO Audit, Technical SEO, Site Speed Test, Performance Monitoring, Real User Metrics, Lab Data, Field Data, Web Developer Tools, Website Optimization, Page Load Speed, Render Performance, JavaScript Performance, CSS Performance, Image Optimization, Lazy Loading, Code Splitting, Bundle Size, Server Response Time, CDN Performance, Caching Strategy, HTTP/2, HTTP/3, Resource Hints, Preload, Prefetch, DNS Prefetch, Performance Budget",
			},

			// Author & Generator
			{ name: "author", content: "Tyler H" },
			{ name: "creator", content: "CodeMeAPixel" },
			{ name: "publisher", content: "Lighthouse Dark" },
			{ name: "generator", content: "TanStack Start" },

			// Theme & Color Scheme
			{
				name: "theme-color",
				content: "#0f0f10",
				media: "(prefers-color-scheme: dark)",
			},
			{
				name: "theme-color",
				content: "#ffffff",
				media: "(prefers-color-scheme: light)",
			},
			{ name: "color-scheme", content: "dark light" },

			// Robots & Indexing
			{
				name: "robots",
				content:
					"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
			},
			{
				name: "googlebot",
				content:
					"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
			},
			{ name: "bingbot", content: "index, follow" },

			// Open Graph
			{ property: "og:type", content: "website" },
			{ property: "og:url", content: SITE_URL },
			{ property: "og:site_name", content: SITE_NAME },
			{ property: "og:title", content: SITE_TITLE },
			{ property: "og:description", content: SITE_DESCRIPTION },
			{ property: "og:image", content: `${SITE_URL}/og.png` },
			{ property: "og:image:secure_url", content: `${SITE_URL}/og.png` },
			{ property: "og:image:width", content: "1200" },
			{ property: "og:image:height", content: "630" },
			{
				property: "og:image:alt",
				content:
					"Lighthouse Dark - The metrics Google is too polite to give you",
			},
			{ property: "og:image:type", content: "image/png" },
			{ property: "og:locale", content: "en_US" },
			{ property: "og:determiner", content: "the" },

			// Twitter Card
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:site", content: "@FixMyShipwreck" },
			{ name: "twitter:creator", content: "@FixMyShipwreck" },
			{ name: "twitter:url", content: SITE_URL },
			{ name: "twitter:title", content: SITE_TITLE },
			{ name: "twitter:description", content: SITE_DESCRIPTION },
			{ name: "twitter:image", content: `${SITE_URL}/og.png` },
			{
				name: "twitter:image:alt",
				content:
					"Lighthouse Dark - The metrics Google is too polite to give you",
			},
			{ name: "twitter:dnt", content: "on" },

			// Facebook/Meta
			{ property: "fb:app_id", content: "" }, // Add your FB App ID if you have one

			// Mobile Web App
			{ name: "mobile-web-app-capable", content: "yes" },
			{ name: "apple-mobile-web-app-capable", content: "yes" },
			{
				name: "apple-mobile-web-app-status-bar-style",
				content: "black-translucent",
			},
			{ name: "apple-mobile-web-app-title", content: SITE_NAME },
			{ name: "application-name", content: SITE_NAME },

			// MS Application
			{ name: "msapplication-TileColor", content: "#0f0f10" },
			{ name: "msapplication-config", content: "/browserconfig.xml" },
			{ name: "msapplication-tooltip", content: SITE_DESCRIPTION },
			{ name: "msapplication-starturl", content: "/" },
			{ name: "msapplication-navbutton-color", content: "#FF6B00" },

			// Format Detection (prevent auto-linking)
			{ name: "format-detection", content: "telephone=no" },
			{ name: "format-detection", content: "address=no" },
			{ name: "format-detection", content: "email=no" },

			// Referrer Policy
			{ name: "referrer", content: "strict-origin-when-cross-origin" },

			// Content Security
			{ httpEquiv: "X-UA-Compatible", content: "IE=edge" },
			{ httpEquiv: "x-dns-prefetch-control", content: "on" },

			// App Links (for deep linking)
			{ property: "al:web:url", content: SITE_URL },

			// Dublin Core Metadata
			{ name: "DC.title", content: SITE_TITLE },
			{ name: "DC.creator", content: "Tyler H" },
			{ name: "DC.subject", content: "Web Performance, SEO, Core Web Vitals" },
			{ name: "DC.description", content: SITE_DESCRIPTION },
			{ name: "DC.publisher", content: "Lighthouse Dark" },
			{ name: "DC.type", content: "Software" },
			{ name: "DC.format", content: "text/html" },
			{ name: "DC.language", content: "en" },
			{ name: "DC.rights", content: "All Rights Reserved" },

			// Geo Tags (optional - add your location)
			// { name: 'geo.region', content: 'US' },
			// { name: 'geo.placename', content: 'City Name' },

			// ICBM (geographic coordinates - optional)
			// { name: 'ICBM', content: 'latitude, longitude' },

			// Revisit frequency hint
			{ name: "revisit-after", content: "7 days" },

			// Rating
			{ name: "rating", content: "general" },

			// Classification
			{ name: "classification", content: "Developer Tools" },
			{ name: "category", content: "Technology" },

			// Copyright
			{
				name: "copyright",
				content: `© ${new Date().getFullYear()} Lighthouse Dark. All Rights Reserved.`,
			},

			// Verification (add your own)
			// { name: 'google-site-verification', content: 'your-verification-code' },
			// { name: 'msvalidate.01', content: 'your-bing-verification' },
			// { name: 'yandex-verification', content: 'your-yandex-verification' },
			// { name: 'p:domain_verify', content: 'your-pinterest-verification' },
		],
		links: [
			// Stylesheet
			{ rel: "stylesheet", href: appCss },

			// Canonical URL
			{ rel: "canonical", href: SITE_URL },

			// Favicons (comprehensive)
			{ rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
			{ rel: "icon", href: "/favicon.ico", sizes: "32x32" },
			{ rel: "icon", href: "/favicon.ico", sizes: "16x16" },
			{
				rel: "apple-touch-icon",
				href: "/apple-touch-icon.png",
				sizes: "180x180",
			},
			{ rel: "apple-touch-icon-precomposed", href: "/apple-touch-icon.png" },
			{ rel: "mask-icon", href: "/mask-icon.svg", color: "#FF6B00" },
			{ rel: "shortcut icon", href: "/favicon.ico" },

			// Manifest
			{ rel: "manifest", href: "/manifest.json" },

			// Alternate formats
			{
				rel: "alternate",
				type: "application/rss+xml",
				href: "/feed.xml",
				title: "Lighthouse Dark RSS Feed",
			},

			// Humans.txt & Machine-readable files
			{ rel: "author", href: "/humans.txt", type: "text/plain" },

			// Preconnect for performance
			{ rel: "preconnect", href: "https://fonts.googleapis.com" },
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous",
			},

			// DNS Prefetch
			{ rel: "dns-prefetch", href: "https://www.googletagmanager.com" },
			{ rel: "dns-prefetch", href: "https://www.google-analytics.com" },
			{ rel: "dns-prefetch", href: "https://pagespeedonline.googleapis.com" },

			// Preload critical assets (add specific fonts/images as needed)
			// { rel: 'preload', href: '/fonts/main.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },

			// Me/Author links
			{ rel: "me", href: "https://github.com/CodeMeAPixel" },
			{ rel: "me", href: "https://x.com/FixMyShipwreck" },

			// Repository
			{
				rel: "repository",
				href: "https://github.com/CodeMeAPixel/LighthouseDark",
			},

			// Search
			{
				rel: "search",
				type: "application/opensearchdescription+xml",
				href: "/opensearch.xml",
				title: "Lighthouse Dark",
			},
		],
		scripts: [
			// Theme initialization (runs before hydration)
			{
				children: `(function(){try{var d=document.documentElement;var s=localStorage.getItem('theme');var m=window.matchMedia('(prefers-color-scheme: dark)');if(s==='dark'||(!s&&m.matches)){d.classList.add('dark');}else{d.classList.remove('dark');}}catch(e){}})();`,
			},
			// JSON-LD Structured Data
			{
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@graph": [
						{
							"@type": "WebSite",
							"@id": `${SITE_URL}/#website`,
							url: SITE_URL,
							name: SITE_NAME,
							description: SITE_DESCRIPTION,
							publisher: { "@id": `${SITE_URL}/#organization` },
							inLanguage: "en-US",
							potentialAction: {
								"@type": "SearchAction",
								target: {
									"@type": "EntryPoint",
									urlTemplate: `${SITE_URL}/?url={search_term_string}`,
								},
								"query-input": "required name=search_term_string",
							},
						},
						{
							"@type": "Organization",
							"@id": `${SITE_URL}/#organization`,
							name: SITE_NAME,
							url: SITE_URL,
							logo: {
								"@type": "ImageObject",
								url: `${SITE_URL}/logo.png`,
								width: 512,
								height: 512,
							},
							sameAs: [
								"https://x.com/FixMyShipwreck",
								"https://github.com/CodeMeAPixel/LighthouseDark",
							],
						},
						{
							"@type": "WebApplication",
							"@id": `${SITE_URL}/#webapp`,
							name: SITE_NAME,
							url: SITE_URL,
							description: SITE_DESCRIPTION,
							applicationCategory: "DeveloperApplication",
							operatingSystem: "Any",
							offers: {
								"@type": "Offer",
								price: "0",
								priceCurrency: "USD",
							},
							featureList: [
								"SEO Analysis",
								"Core Web Vitals Testing",
								"Lighthouse Score Reports",
								"AI-Powered Recommendations",
								"Performance Monitoring",
							],
						},
					],
				}),
			},
		],
	}),

	errorComponent: ({ error }) => {
		return (
			<ErrorBoundary error={error} reset={() => window.location.reload()} />
		);
	},

	notFoundComponent: () => {
		return <NotFound />;
	},

	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body className="min-h-screen bg-light1 text-light12 antialiased transition-colors dark:bg-dark1 dark:text-dark12">
				{/* Global particles background - lazy loaded for client-only rendering */}
				<Suspense
					fallback={
						<div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
							<div className="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2">
								<div className="h-[600px] w-[600px] rounded-full bg-linear-to-r from-orange-500/10 via-red-500/5 to-pink-500/10 blur-[120px] opacity-50" />
							</div>
						</div>
					}
				>
					<ParticlesBackground variant="subtle" particleCount={8} />
				</Suspense>

				{/* Blur overlays for top/bottom */}
				<div className="fixed inset-x-0 top-0 isolate z-[10] h-[50px] pointer-events-none">
					<div className="gradient-mask-b-0 absolute inset-0 backdrop-blur-[1px]" />
					<div className="gradient-mask-b-0 absolute inset-0 backdrop-blur-[2px]" />
					<div className="gradient-mask-b-0 absolute inset-0 backdrop-blur-[3px]" />
				</div>
				<div className="fixed inset-x-0 bottom-0 isolate z-[10] h-[100px] pointer-events-none">
					<div className="gradient-mask-t-0 absolute inset-0 backdrop-blur-[1px]" />
					<div className="gradient-mask-t-0 absolute inset-0 backdrop-blur-[2px]" />
					<div className="gradient-mask-t-0 absolute inset-0 backdrop-blur-[3px]" />
				</div>

				<NavPill />
				<div className="mx-auto w-[90%] overflow-hidden md:w-full">
					{children}
				</div>
				<FloatNav />
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						TanStackQueryDevtools,
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
