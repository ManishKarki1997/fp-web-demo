/// <reference types="vitest" />
import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'c8',
      enabled: true,
      reporter: ['text'],
    },
  },
  server: {
    host: '0.0.0.0',
    port:3335
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
