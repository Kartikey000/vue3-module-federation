import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { federation } from '@module-federation/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  // Helper function to normalize URL (remove trailing slash)
  const normalizeUrl = (url: string) => url.replace(/\/$/, '')
  
  // Get remote URLs from environment variables with fallbacks
  const listUserAppUrl = normalizeUrl(env.LIST_USER_APP_URL || 'http://localhost:5001')
  const createUserAppUrl = normalizeUrl(env.CREATE_USER_APP_URL || 'http://localhost:5002')

  return {
    plugins: [
      vue(),
      vueDevTools(),
      federation({
        name: 'host',
        filename: 'remoteEntry.js',
        exposes: {
          './store': './src/store/index.ts',
        },
        remotes: {
          listUserApp: {
            type: 'module',
            name: 'listUserApp',
            entry: `${listUserAppUrl}/remoteEntry.js`,
            entryGlobalName: 'listUserApp',
            shareScope: 'default',
          },
          createUserApp: {
            type: 'module',
            name: 'createUserApp',
            entry: `${createUserAppUrl}/remoteEntry.js`,
            entryGlobalName: 'createUserApp',
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
    port: 5000,
    strictPort: true, // Exit if port is already in use
    cors: true,
    open: false, // Don't auto-open browser
    hmr: {
      overlay: true, // Show error overlay
    },
    watch: {
      usePolling: false,
    },
  },
  // Preview Server Configuration (for production build preview)
  preview: {
    host: true,
    port: 5000,
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
      external: ['@newrelic/browser-agent/loaders/browser-agent'],
      output: {
        manualChunks: undefined,
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1500,
    // Enable CSS code splitting
    cssMinify: true,
  },
    // Optimization
    optimizeDeps: {
      include: ['vue', 'vue-router', 'vuex'],
      exclude: [],
    },
  }
})
