import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom', // Simula el DOM del navegador
    globals: true,        // Permite usar describe, test, expect sin importarlos en cada archivo
  },
});