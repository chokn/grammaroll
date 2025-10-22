import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
// Use VITE_BASE when provided (e.g., by CI for GitHub Pages), otherwise default to '/'
const base = "/";

export default defineConfig({
  plugins: [react()],
  base,
});
