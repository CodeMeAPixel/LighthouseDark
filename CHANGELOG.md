# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0-beta.3] - 2026-07-11

Security hardening (SSRF protection, a real per-IP rate limiter), a fixed production server that actually listens, one-command Nixpacks deploys, and a theme-true accent refresh — pink in light, orange in dark, everywhere.

### Security

- Add SSRF protection for URL analysis: submitted URLs are validated against private, loopback, link-local, CGNAT, and cloud-metadata addresses (resolving DNS, not just string-matching), and every redirect hop is re-validated before it is fetched.
- Fix the request rate limiter, which keyed every request on a single shared `"global"` bucket — it now keys on the real client IP so one visitor can no longer exhaust everyone's quota.

### Added

- `nixpacks.toml` for one-command Nixpacks deployment on dokploy/Coolify.
- `server.mjs` Node entry (via `srvx`) that actually binds an HTTP listener for `bun run start`.
- Vitest unit tests covering the SSRF URL guard, the rate limiter, and slop detection.
- Completed neutral color scale (steps 5–10) and a theme-aware `accent` color, plus reusable `.accent-pill` and `.section-card` utilities.

### Changed

- Unified the accent color system so it is consistent per theme — pink in light mode, orange in dark mode — across the nav, analyzer form, hero, result tabs, scanner, and suggestion cards (replaced scattered hardcoded hex values with theme-aware tokens).
- Made the hero headline gradient and input focus rings theme-aware instead of hardcoded pink.
- Upgraded the Vercel AI SDK (`ai` 3 → 6, `@ai-sdk/openai` 0.0.x → 3) and adapted the `generateObject` call to the new API.
- Wired Sentry error capture into the previously-silent external-call failure paths (SEO fetch, PageSpeed, AI suggestions).
- AI suggestion failures now log a concise, actionable message and fall back immediately to rule-based suggestions instead of retrying and dumping full stack traces (common when the OpenAI key is out of quota).
- Canonicalized Tailwind v4 utility classes (`bg-gradient-to-*` → `bg-linear-to-*`).

### Fixed

- Fixed a broken production start: the built server only exported a fetch handler and never opened a listener, so `npm start` exited without serving. It now binds a real HTTP server on `PORT`/`HOST`.
- Defined the missing `light10`/`dark10` color tokens, which were rendering with the wrong inherited color on the hero tagline and the error, 404, and disclaimer pages.
- Fixed a React list-key in `StatsBar` that referenced a nonexistent field.

### Removed

- Removed leftover Cloudflare Workers deployment config (`wrangler.jsonc`, `@cloudflare/vite-plugin`, `wrangler`) that conflicted with the Node/Docker deployment target.

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
