import { defineConfig } from "vite"

export default defineConfig({
  css: {
    postcss: {},
  },
  server: {
    host: true,
    hmr: {
      overlay: false,
    },
  },
})
