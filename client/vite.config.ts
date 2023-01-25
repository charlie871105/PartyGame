import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // socket proxy
  server: {
    proxy: {
      '/socket.io': {
        target: 'ws://localhost/socket.io',
        ws: true
      }
    }
  },
});
