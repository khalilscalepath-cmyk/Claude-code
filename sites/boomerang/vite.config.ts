import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base is the GitHub Pages sub-path this is published under; a leading-slash
// build would look for /assets at the domain root and serve a blank page.
export default defineConfig({
  plugins: [react()],
  base: './',
});
