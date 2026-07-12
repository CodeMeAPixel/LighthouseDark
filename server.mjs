import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { serve } from "srvx";
import { serveStatic } from "srvx/static";
import handler from "./dist/server/server.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT) || 3000;
const hostname = process.env.HOST || "0.0.0.0";

serve({
	fetch: handler.fetch,
	middleware: [serveStatic({ dir: join(__dirname, "dist/client") })],
	port,
	hostname,
});

console.log(`✅ Server listening on http://${hostname}:${port}`);
