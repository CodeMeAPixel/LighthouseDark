import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";
import { fileURLToPath, URL } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
	assetsInclude: ["**/*.woff", "**/*.woff2"],
	server: {
		port: 3008,
		host: "0.0.0.0",
		allowedHosts: [
			"roastlab.lol",
			"www.lighthousedark.org",
			"lighthousedark.org",
		],
	},

	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},

	plugins: [
		devtools(),
		cloudflare({ viteEnvironment: { name: "ssr" } }),
		viteTsConfigPaths({ projects: ["./tsconfig.json"] }),
		tailwindcss(),
		tanstackStart(),
		viteReact(),
	],

	build: {
		rollupOptions: {
			output: {
				manualChunks: (id) => {
					if (!id || !id.includes("node_modules")) return undefined;

					if (id.includes("react-dom") || id.match(/node_modules\/react($|\/)/))
						return "vendor-react";
					if (id.includes("@tanstack") || id.includes("tanstack"))
						return "vendor-tanstack";
					if (id.includes("framer-motion")) return "vendor-framer-motion";
					if (id.includes("@sentry")) return "vendor-sentry";

					return "vendor";
				},
			},
		},
		chunkSizeWarningLimit: 700,
	},
});
