import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:5000',
    //     changeOrigin: true,
    //     secure: false,
    //   },
    // },
  },
  resolve: {
    alias: {
      '@common': path.resolve(__dirname, './src/common'),
      '@icons': path.resolve(__dirname, './src/common/icons'),
      '@features': path.resolve(__dirname, './src/features'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@theme': path.resolve(__dirname, './src/theme'),
      '@store': path.resolve(__dirname, './src/store'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@routes': path.resolve(__dirname, './src/routes'),
    },
  },
})
