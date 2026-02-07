import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    devtools({
      injectSource: { enabled: false },
      enhancedLogs: { enabled: false },
    }),
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    watch: {
      usePolling: true,
    },
    hmr: {
      protocol: "ws",
      host: "localhost",
      port: 3000,
    },
  },
});
