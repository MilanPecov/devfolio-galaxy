
import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { exec } from 'child_process';

// Detect GitHub Pages Deployment
const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const BASE_URL = isGitHubPages ? "/devfolio-galaxy/" : "/";

/**
 * Custom Vite plugin to generate blog data before the build process
 */
function generateBlogDataPlugin(): Plugin {
  return {
    name: 'generate-blog-data',
    buildStart() {
      return new Promise<void>((resolve, reject) => {
        exec('node src/apps/blog/scripts/build.js', (error, stdout, stderr) => {
          if (error) {
            console.error(`Blog data generation error: ${error.message}`);
            console.error(stderr);
            reject(error);
            return;
          }
          console.log(stdout);
          resolve();
        });
      });
    }
  };
}

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
    mode === "development" ? componentTagger() : false,
    generateBlogDataPlugin(),
  ].filter(Boolean) as Plugin[],
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
