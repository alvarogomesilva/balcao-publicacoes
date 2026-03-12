import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    open: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return undefined;
          }

          if (id.includes("@chakra-ui") || id.includes("@emotion")) {
            return "chakra";
          }

          if (id.includes("firebase")) {
            return "firebase";
          }

          if (
            id.includes("react-hook-form") ||
            id.includes("@hookform") ||
            id.includes("zod")
          ) {
            return "forms";
          }

          if (id.includes("@tanstack/react-query")) {
            return "react-query";
          }

          if (id.includes("react-router")) {
            return "router";
          }

          if (id.includes("react-dom") || id.includes("\\react\\") || id.includes("/react/")) {
            return "react";
          }

          if (
            id.includes("react-icons") ||
            id.includes("sonner") ||
            id.includes("next-themes") ||
            id.includes("zustand")
          ) {
            return "ui-vendor";
          }

          return "vendor";
        },
      },
    },
  },
})
