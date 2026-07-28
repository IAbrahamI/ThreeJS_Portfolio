import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // three.js + drei + rapier are legitimately large. They're already split
    // into their own async chunk (only loaded when entering the 3D world), so
    // raise the warning limit rather than chasing an impossible sub-500 kB goal.
    chunkSizeWarningLimit: 4000,
  },
})
