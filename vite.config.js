import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'deploy',
    emptyOutDir: true,
  },
  server: {
    port: 8000,
  },
  assetsInclude: ['**/*.obj', '**/*.mtl'],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        includePaths: ['node_modules'],
      },
    },
  },
})
