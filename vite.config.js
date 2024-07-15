import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import commonjs from '@rollup/plugin-commonjs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), commonjs()],
  server: {
    port: 8081,
    watch: {
      // Use polling instead of fs events for file watching
      usePolling: true,
      // Decrease the polling interval to reduce CPU usage
      interval: 300
    }
  }
})
