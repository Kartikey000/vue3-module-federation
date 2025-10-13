import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { federation } from '@module-federation/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode`
  const env = loadEnv(mode, process.cwd(), '')
  
  // Get host URL from environment variables with fallback
  const hostAppUrl = env.VITE_HOST_APP_URL || 'http://localhost:5000'

  return {
    plugins: [
      vue(),
      vueDevTools(),
      federation({
        name: 'createUserApp',
        filename: 'remoteEntry.js',
        exposes: {
          './CreateUpdateUser': './src/components/CreateUpdateUser.vue',
        },
        remotes: {
          host: {
            type: 'module',
            name: 'host',
            entry: `${hostAppUrl}/remoteEntry.js`,
            entryGlobalName: 'host',
            shareScope: 'default',
          },
        },
        shared: {
          vue: {
            singleton: true,
          },
          vuex: {
            singleton: true,
          },
        },
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
  // Development Server Configuration
  server: {
    host: true, // Listen on all addresses
    port: 5002,
    strictPort: true, // Exit if port is already in use
    cors: true,
    open: false, // Don't auto-open browser
    hmr: {
      overlay: true, // Show error overlay
    },
    watch: {
      usePolling: false,
    },
    // Proxy configuration (if needed for API calls)
    proxy: {
      // Example: '/api': 'http://localhost:3000'
    },
  },
  // Preview Server Configuration (for production build preview)
  preview: {
    host: true,
    port: 5002,
    strictPort: true,
    cors: true,
  },
  // Build Configuration for Production
  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'esbuild', // Use esbuild for faster minification
    cssCodeSplit: true,
    sourcemap: false, // Set to true for debugging production
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable CSS code splitting
    cssMinify: true,
  },
    // Optimization
    optimizeDeps: {
      include: ['vue', 'vuex'],
      exclude: [],
    },
  }
})
