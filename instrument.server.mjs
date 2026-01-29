import * as Sentry from "@sentry/node";

const sentryDsn = process.env.SENTRY_DSN || process.env.VITE_SENTRY_DSN;

if (!sentryDsn) {
	console.warn("SENTRY_DSN is not defined. Sentry error tracking is disabled.");
} else {
	Sentry.init({
		dsn: sentryDsn,
		environment: process.env.NODE_ENV || "development",
		tracesSampleRate: 1.0,
		sendDefaultPii: true,
	});

	// Attach global error handlers
	process.on("unhandledRejection", (reason) => {
		Sentry.captureException(reason);
	});

	process.on("uncaughtException", (error) => {
		Sentry.captureException(error);
		process.exit(1);
	});
}
