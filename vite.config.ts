import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // For GitHub Pages, set base to '/<repo-name>/' e.g., '/eleanor-grammar/'
  base: "/grammaroll/",
});
