import { serve } from "srvx";
import handler from "./dist/server/server.js";

const port = Number(process.env.PORT) || 3000;
const hostname = process.env.HOST || "0.0.0.0";

serve({
	fetch: handler.fetch,
	port,
	hostname,
});

console.log(`✅ Server listening on http://${hostname}:${port}`);
