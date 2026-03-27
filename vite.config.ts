import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — tiny, loads first
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          // Firebase — loaded only when auth/db is needed
          "vendor-firebase": [
            "firebase/app",
            "firebase/auth",
            "firebase/firestore",
            "firebase/functions",
          ],
          // Mapbox — only needed on map pages
          "vendor-mapbox": ["mapbox-gl"],
        },
      },
    },
    // Raise the warning threshold now that chunks are intentionally split
    chunkSizeWarningLimit: 600,
  },
});
