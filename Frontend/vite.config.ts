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
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true,
    },
    hmr: {
      host: "localhost",
      port: 5173,
    },
  },
});
