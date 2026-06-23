import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Mantém a porta local que o teu front usava
  },
  define: {
    // Este truque impede que tenhas de mudar 'process.env' para 'import.meta.env' em todas as páginas!
    'process.env': {}
  }
});