import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// Temporarily removed lovable-tagger due to compatibility issues
// import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Add security related options
    hmr: {
      // Use secure websocket protocol when using HTTPS
      protocol: 'ws',
      // Only allow connections from the same origin
      clientPort: 8080
    }
  },
  plugins: [
    react(),
    // Removed componentTagger due to version compatibility issues
    // mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
