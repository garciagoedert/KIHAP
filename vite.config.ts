import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Otimizações para produção
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Mantém console.logs para debug
      },
    },
  },
  // Configuração para desenvolvimento local
  server: {
    host: true, // Permite acesso externo
    port: 5173,
    strictPort: true,
  },
  // Configuração de proxy para desenvolvimento
  preview: {
    port: 5173,
    host: true,
  }
});
