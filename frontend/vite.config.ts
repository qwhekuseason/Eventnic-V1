import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
  },
  plugins: [react(), tailwindcss()],
  build: {
    // Optimize build output
    target: 'esnext',
    rollupOptions: {
      output: {
        // Split code into chunks for better caching
        manualChunks: (id) => {
          if (id.includes('framer-motion')) return 'framer-motion';
          if (id.includes('react')) return 'react-vendor';
          if (id.includes('react-router-dom')) return 'router';
        },
      },
    },
    // Increase chunk size warning threshold (some pages are large)
    chunkSizeWarningLimit: 1000,
    // Enable code splitting
    reportCompressedSize: false,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
  },
})
