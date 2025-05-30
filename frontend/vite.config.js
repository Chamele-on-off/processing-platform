import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue' // если используете Vue

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
