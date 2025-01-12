import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/static': {
          target: env.STATIC_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/static/, '')
        }
      }
    }
  }
})
