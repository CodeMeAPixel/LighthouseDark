import type { Metadata } from "next"
import { Inter } from "next/font/google"
import localFont from "next/font/local"
import { ThemeProvider } from "next-themes"
import Script from "next/script"

import { Analytics } from "@/components/Analytics"

import "./globals.css"

import { FloatNav } from "@/components/FloatNav"
import { NavPill } from "@/components/NavPill"
import QueryProvider from "@/components/QueryProvider"

const inter = Inter({ subsets: ["latin"] })
const pramukhRounded = localFont({
  src: "./fonts/PramukhRounded-Variable.woff",
})
export const metadata: Metadata = {
  metadataBase: new URL("https://lighthousedark.org/"),
  title: {
    default: "Lighthouse Dark - The metrics Google is too polite to give you",
    template: "%s | Lighthouse Dark",
  },
  description:
    "The metrics Google is too polite to give you. Get a blunt, witty critique of your website's SEO and Core Web Vitals with real data and actionable fixes.",
  keywords: [
    "Lighthouse",
    "SEO",
    "Web Vitals",
    "Performance",
    "Website Analysis",
    "Core Web Vitals",
    "CrUX",
    "PageSpeed Insights",
    "Web Performance",
  ],
  openGraph: {
    title: "Lighthouse Dark",
    description:
      "The metrics Google is too polite to give you. Get a blunt analysis of your site's SEO and Web Vitals.",
    url: "https://lighthousedark.org/",
    siteName: "Lighthouse Dark",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Lighthouse Dark - The metrics Google is too polite to give you",
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "Lighthouse Dark - The metrics Google is too polite to give you",
    description: "Get a blunt analysis of your website's SEO and Core Web Vitals performance.",
    creator: "@CodeMeAPixel",
    site: "@LighthouseDarkApp",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/favicon.svg" }],
    other: [{ rel: "mask-icon", url: "/mask-icon.svg", color: "#FF6B00" }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="dark light" />
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var d=document.documentElement;var s=localStorage.getItem('theme');var m=window.matchMedia('(prefers-color-scheme: dark)');if(s==='dark'||(!s&&m.matches)){d.classList.add('dark');}else{d.classList.remove('dark');}}catch(e){}})();`}
        </Script>
      </head>
      <body
        className={`bg-light1 antialiased transition dark:bg-dark1 ${inter.className} `}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
          <div className="relative mb-16">
            <div className="fixed inset-x-0 top-0 isolate z-[10] h-[50px]">
              <div className="gradient-mask-b-0 absolute inset-0 backdrop-blur-[1px]" />
              <div className="gradient-mask-b-0 absolute inset-0 backdrop-blur-[2px]" />
              <div className="gradient-mask-b-0 absolute inset-0 backdrop-blur-[3px]" />
              <div className="gradient-mask-b-0 absolute inset-0 backdrop-blur-[6px]" />
              <div className="gradient-mask-b-0 absolute inset-0 backdrop-blur-[12px]" />
            </div>
            <div className="fixed inset-x-0 bottom-0 isolate z-[10] h-[100px]">
              <div className="gradient-mask-t-0 absolute inset-0 backdrop-blur-[1px]" />
              <div className="gradient-mask-t-0 absolute inset-0 backdrop-blur-[2px]" />
              <div className="gradient-mask-t-0 absolute inset-0 backdrop-blur-[3px]" />
              <div className="gradient-mask-t-0 absolute inset-0 backdrop-blur-[6px]" />
              <div className="gradient-mask-t-0 absolute inset-0 backdrop-blur-[12px]" />
            </div>
            <main>
              <div className="mx-auto w-[90%] overflow-hidden md:w-full">
                {children}
              </div>
            </main>
            <NavPill />
            <FloatNav />
          </div>
          <Analytics />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
