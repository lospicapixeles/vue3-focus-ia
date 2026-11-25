import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    proxy: {
      // Evita CORS: el navegador habla con Vite; Vite reenvía a Laravel local
      '/api': {
        target: 'http://127.0.0.1:9001',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      vue: fileURLToPath(new URL('./node_modules/vue/dist/vue.esm-bundler.js', import.meta.url)),
    },
    dedupe: ['vue'],
  },
  optimizeDeps: {
    include: ['vue', 'primevue', 'pinia', 'vue-router'],
  },
})
