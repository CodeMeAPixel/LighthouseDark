import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";
import { fileURLToPath, URL } from "node:url";

import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	assetsInclude: ["**/*.woff", "**/*.woff2"],
	server: {
		port: 3008,
		host: "0.0.0.0",
		allowedHosts: [
			"roastlab.lol",
			"www.roastlab.lol",
			"www.lighthousedark.org",
			"lighthousedark.org",
		],
	},

	optimizeDeps: {
		include: ["lucide-react"],
	},

	ssr: {
		noExternal: ["lucide-react"],
	},

	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},

	plugins: [
		devtools(),
		viteTsConfigPaths({ projects: ["./tsconfig.json"] }),
		tailwindcss(),
		tanstackStart(),
		viteReact(),
	],

	build: {
		rollupOptions: {
			output: {
				manualChunks: undefined,
			},
		},
		chunkSizeWarningLimit: 700,
	},
});
