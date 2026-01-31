import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          // Split Firebase into smaller chunks.
          if (id.includes('firebase/analytics')) return 'firebase-analytics';
          if (id.includes('firebase/auth')) return 'firebase-auth';
          if (id.includes('firebase/firestore')) return 'firebase-firestore';
          if (id.includes('firebase/app')) return 'firebase-core';
          if (id.includes('firebase')) return 'firebase';

          // Common vendors.
          if (id.includes('react-router')) return 'router';
          if (id.includes('react-dom')) return 'react-dom';
          if (id.includes('react')) return 'react';
          if (id.includes('lucide-react')) return 'icons';

          return 'vendor';
        },
      },
    },
  },
})
