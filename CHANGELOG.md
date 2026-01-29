# Changelog

All notable changes to this project will be documented in this file.

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
