import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// The base path is load-bearing: the Pages workflow builds this app at /mockent/adit/.
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react()],
  server: { fs: { allow: ['..'] } },
  build: { target: 'es2022', sourcemap: false },
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
});
