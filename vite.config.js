import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
})

console.log('> 🔧 LIGHTNING_CSS_RUNTIME =', process.env.LIGHTNING_CSS_RUNTIME);
