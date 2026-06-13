import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://backtest-validation-guide.vercel.app',
  output: 'static',
  adapter: vercel(),
  integrations: [react(), sitemap()],

  // Code-split vendor chunks (mirrors old vite.config.ts manualChunks)
  vite: {
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
  },
});
