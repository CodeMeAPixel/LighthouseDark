# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0-beta.2] - 2026-01-29

### Changed

- Improve Sentry integration: initialize Sentry on both client and server runtimes (Cloudflare Workers) and capture errors from the app error boundary.
- Vite build: treat font assets as static assets and refine vendor chunking to reduce oversized bundles.

### Fixed

- Remove unsafe global async operations (rate limiter cleanup) that caused Cloudflare Worker runtime errors.
- Lazy-initialize OpenAI client to ensure secrets are read during request handling in preview/edge environments.
- Resolve array index key warnings in particle animations (Scanner, ParticlesBackground) with stable generated keys.
- Resolve hardcoded SVG ID warnings in Logo component by using React's `useId()` hook.
- Apply Biome formatting standards across entire codebase (quotes, semicolons, indentation).

### Added

- Placeholder font files in `public/fonts` to ensure fonts resolve at build time.
- GitHub Actions workflows for CI/CD: `test-build.yml`, `format-check.yml`, and `lint-check.yml`.


## [2.0.0-beta.1] - 2026-01-29

### Changed

- Complete rewrite from Next.js to TanStack Start
- Migrated deployment target from Vercel to Cloudflare Workers
- Replaced TanStack Store with Zustand for state management
- New glassmorphism UI with dark/light theme support
- Redesigned brand assets (logo, OG image, Twitter banner)

### Added

- Floating particles background animation
- Animated scanner effect during analysis
- SEO slop detection analysis
- Rate limiting for API requests
- Static pages for About, FAQs, and Disclaimer
- Comprehensive meta tags for SEO and social sharing
- Edge-optimized API routes

### Fixed

- SSR hydration issues with client-only components
- OG image generation for social previews

### Removed

- Server-side middleware (replaced with edge functions)
- Legacy API routes from Next.js structure
