import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Automatically set base for GitHub Pages
const isGitHubPages = process.env.NODE_ENV === "production";
const BASE_URL = isGitHubPages ? "/devfolio-galaxy/" : "/";

export default defineConfig(({ mode }) => ({
  base: BASE_URL,
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "dist",
    assetsDir: "assets", // Ensures assets are inside dist/assets
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
