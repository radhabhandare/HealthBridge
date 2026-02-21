import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // This ensures all unknown routes fallback to index.html
    fs: {
      strict: false,
    },
  },
  build: {
    rollupOptions: {
      input: "/index.html",
    },
  },
});
