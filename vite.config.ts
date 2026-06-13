import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/katex')) return 'vendor-katex';
          if (id.includes('/node_modules/recharts') || id.includes('/node_modules/d3-')) return 'vendor-recharts';
          if (id.includes('/node_modules/react-dom') || id.includes('/node_modules/react/')) return 'vendor-react';
        },
      },
    },
  },
});
