import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Base path for GitHub Pages
  base: '/cat-oscillator-sync/',
  
  server: {
    port: 5173,
  },
  
  build: {
    // Output to /docs at repository root for GitHub Pages
    outDir: resolve(__dirname, '../../../docs'),
    assetsDir: 'assets',
    sourcemap: true,
    // Clean the output directory before building
    emptyOutDir: true,
  },
});
