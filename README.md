# Lighthouse Dark

A web performance and SEO analyzer that gives you the metrics Google is too polite to share. Built with TanStack Start, deployed to Cloudflare Workers.

## What It Does

Enter a URL and get a full breakdown of Core Web Vitals, Lighthouse scores, and SEO issues for both mobile and desktop. An AI layer provides actionable recommendations based on the results.

## Features

**Performance Analysis**  
LCP, FID, CLS, and full Lighthouse audits using the Google PageSpeed Insights API.

**SEO Insights**  
Meta tags, Open Graph data, heading structure, robots directives, and indexability checks.

**AI Recommendations**  
Context-aware suggestions powered by OpenAI, prioritized by impact.

**Edge Deployment**  
Runs on Cloudflare Workers for low-latency responses worldwide.

## Setup

### Prerequisites

- Node.js 18+ or Bun
- OpenAI API key
- Google PageSpeed Insights API key

### Install

```bash
bun install
```

### Environment

Create a `.env` file:

```env
OPENAI_API_KEY=your_key
GOOGLE_PAGESPEED_API_KEY=your_key
```

### Development

```bash
bun run dev
```

Opens at [http://localhost:3000](http://localhost:3000).

### Build

```bash
bun run build
```

## Deploy to Cloudflare

Set secrets:

```bash
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put GOOGLE_PAGESPEED_API_KEY
```

Deploy:

```bash
npx wrangler deploy
```

## Stack

- TanStack Start / Router
- Zustand
- Tailwind CSS
- Framer Motion
- Vercel AI SDK
- Cloudflare Workers
