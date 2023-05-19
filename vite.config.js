import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import {VantResolver} from "unplugin-vue-components/resolvers"

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8081,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080', // 凡是遇到 /admin 路径的请求，都映射到 target 属性
        changeOrigin: true,
      },
      '/image': {
        target: 'http://127.0.0.1:8080', // 凡是遇到 /api 路径的请求，都映射到 target 属性
        changeOrigin: true,
        rewrite: path => path.replace(/^\/image/, '/upload')
      }
    }
  },
  plugins: [
      vue(),
      Components({ resolvers: [VantResolver()] }) // UI库自动按需引入
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
