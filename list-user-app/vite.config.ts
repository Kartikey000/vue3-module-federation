import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { federation } from '@module-federation/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode`
  const env = loadEnv(mode, process.cwd(), '')
  
  // Helper function to normalize URL (remove trailing slash)
  const normalizeUrl = (url: string) => url.replace(/\/$/, '')
  
  // Get host URL from environment variables with fallback
  const hostAppUrl = normalizeUrl(env.HOST_APP_URL || 'http://localhost:5000')
  
  // Get the app's own URL for production builds
  const appUrl = normalizeUrl(env.APP_URL || '')

  return {
    // Set base URL for production - critical for Module Federation
    base: mode === 'production' && appUrl ? appUrl : '/',
    plugins: [
      vue({
        template: {
          compilerOptions: {
            // Ensure proper CSS injection for Module Federation
            isCustomElement: (tag) => false
          }
        }
      }),
      vueDevTools(),
      federation({
        name: 'listUserApp',
        filename: 'remoteEntry.js',
        exposes: {
          './ListUser': './src/components/ListUser.vue',
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
    port: 5001,
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
    port: 5001,
    strictPort: true,
    cors: true,
  },
  // Build Configuration for Production
  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'esbuild', // Use esbuild for faster minification
    cssCodeSplit: false, // Disable for Module Federation - CSS bundled with JS
    sourcemap: false, // Set to true for debugging production
    cssTarget: 'chrome61', // Ensure modern CSS injection
    rollupOptions: {
      output: {
        manualChunks: undefined,
        // Ensure CSS is inlined in JS chunks
        inlineDynamicImports: false,
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable CSS minification
    cssMinify: true,
  },
    // Optimization
    optimizeDeps: {
      include: ['vue', 'vuex'],
      exclude: [],
    },
  }
})
