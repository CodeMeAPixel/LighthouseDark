import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import * as TanstackQuery from './integrations/tanstack-query/root-provider'

import * as Sentry from '@sentry/tanstackstart-react'

import { routeTree } from './routeTree.gen'

export const getRouter = () => {
  const rqContext = TanstackQuery.getContext()

  const router = createRouter({
    routeTree,
    context: {
      ...rqContext,
    },

    defaultPreload: 'intent',
  })

  setupRouterSsrQueryIntegration({ router, queryClient: rqContext.queryClient })

  if (!router.isServer) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [],
      tracesSampleRate: 1.0,
      sendDefaultPii: true,
    })
  }

  // Initialize Sentry on the server runtime as well (Cloudflare Workers / SSR)
  if (router.isServer) {
    try {
      const serverDsn = process.env.SENTRY_DSN || process.env.VITE_SENTRY_DSN
      if (serverDsn) {
        Sentry.init({
          dsn: serverDsn,
          integrations: [],
          tracesSampleRate: 1.0,
          sendDefaultPii: true,
          environment: process.env.NODE_ENV || 'production',
        })
      }
      // Attach global handlers when supported (Node-like runtimes)
      if (typeof process !== 'undefined' && typeof process.on === 'function') {
        try {
          process.on('unhandledRejection', (reason) => {
            try {
              Sentry.captureException(reason)
            } catch {}
          })
          process.on('uncaughtException', (err) => {
            try {
              Sentry.captureException(err)
            } catch {}
          })
        } catch (e) {
          /* ignore attach errors */
        }
      }
    } catch (e) {
      // Don't throw during router creation if Sentry init fails
      // Log to console so build/runtime teams can diagnose
      // eslint-disable-next-line no-console
      console.error('Sentry server init failed:', e)
    }
  }

  return router
}
