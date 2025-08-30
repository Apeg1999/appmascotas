import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // Esta línea es crucial para que Vite sepa dónde está tu proyecto en GitHub Pages
  base: "/appmascotas/",
  plugins: [react()],
});