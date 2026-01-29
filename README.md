# Lighthouse Dark

A web performance and SEO analyzer that gives you the metrics Google is too polite to share. Think of it as a brutally honest friend for your website.

## What It Does

Enter a URL and get a full breakdown of Core Web Vitals, Lighthouse scores, and SEO issues for both mobile and desktop. The AI layer delivers context-aware recommendations with a bit of attitude.

## Features

**Performance Analysis**  
LCP, FID, CLS, and full Lighthouse audits via the Google PageSpeed Insights API. We'll tell you if your site loads like a sloth on sedatives.

**SEO Insights**  
Meta tags, Open Graph data, heading structure, robots directives, and indexability checks. Because yes, meta tags are still a thing.

**AI Roasts**  
Sarcastic, actionable suggestions powered by OpenAI. Our AI has a PhD in Sass.

**Node.js Deployment**  
Runs on Node.js/Express for deployment on dokploy, coolify, or any Docker container.

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

## Deploy to Production

Set environment variables:

```bash
export OPENAI_API_KEY=your_key
export GOOGLE_PAGESPEED_API_KEY=your_key
export SENTRY_DSN=your_sentry_dsn  # optional
```

Run:

```bash
bun run start
```

Or deploy to dokploy/coolify and let them handle the container startup.

## Stack

- TanStack Start / Router
- Zustand
- Tailwind CSS
- Framer Motion
- Vercel AI SDK
- Sentry (error tracking)
- Node.js / Express

## Contributing

Found a bug? Want to add more sass to the roasts? Pull requests welcome.

## License

AGPL-3.0
