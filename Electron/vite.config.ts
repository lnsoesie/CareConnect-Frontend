import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import path from "node:path"

export default defineConfig(({ mode }) => ({
  base: mode === "desktop" ? "./" : "/",

  plugins: [
    react(),
    tailwindcss(),
  ],

  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    host: "0.0.0.0",
    port: parseInt(process.env.PORT || "8443"),
    strictPort: true,
  },

  preview: {
    host: "0.0.0.0",
    port: parseInt(process.env.PORT || "8443"),
  },
}))
