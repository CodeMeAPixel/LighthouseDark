import dotenv from "dotenv";
import * as Sentry from "@sentry/node";
import fs from "fs";

if (process.env.NODE_ENV !== "production" && fs.existsSync(".env.local")) {
	dotenv.config({ path: ".env.local" });
}

const sentryDsn = process.env.SENTRY_DSN || process.env.VITE_SENTRY_DSN;

if (!sentryDsn) {
	console.warn("SENTRY_DSN is not defined. Sentry error tracking is disabled.");
} else {
	try {
		Sentry.init({
			dsn: sentryDsn,
			environment: process.env.NODE_ENV || "development",
			tracesSampleRate: 1.0,
			sendDefaultPii: true,
		});
		console.log("✅ Sentry initialized");

		// Attach global error handlers
		process.on("unhandledRejection", (reason) => {
			console.error("❌ Unhandled rejection:", reason);
			Sentry.captureException(reason);
		});

		process.on("uncaughtException", (error) => {
			console.error("❌ Uncaught exception:", error);
			Sentry.captureException(error);
			process.exit(1);
		});
	} catch (e) {
		console.error("❌ Failed to initialize Sentry:", e);
		// Continue anyway - don't block startup
	}
}
