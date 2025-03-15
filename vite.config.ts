
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Detect GitHub Pages Deployment
const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
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
      "buffer": "buffer/",
    },
  },
  define: {
    global: "window",
  },
}));
