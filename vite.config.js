import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from "vite-plugin-pwa";


// https://vitejs.dev/config/
export default defineConfig({
  base: "/ReddiPod",
  // plugins: [react(), VitePWA(manifestForPlugin)],
  plugins: [react()],
  tailwindcss: {},
  autoprefixer: {},
  postcss: './postcss.config.js',
})