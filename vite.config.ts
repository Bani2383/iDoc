import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    target: 'es2015',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
    cssCodeSplit: true,
    sourcemap: false,
    chunkSizeWarningLimit: 600,
  },
  esbuild: {
    drop: ['console', 'debugger'],
  },
  server: {
    proxy: {
      '/supabase': {
        target: 'https://ffujpjaaramwhtmzqhlx.supabase.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/supabase/, ''),
        secure: true,
      },
    },
  },
});
