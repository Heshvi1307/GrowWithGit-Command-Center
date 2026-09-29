import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/GrowWithGit-Command-Center/', // Exact repo name enclosed in slashes
  plugins: [react(), tailwindcss()],
  build: { outDir: 'dist' },
});