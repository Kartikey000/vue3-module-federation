# Vite Configuration Guide

## 📋 Configuration Overview

All three applications (host-app, list-user-app, create-user-app) now have comprehensive development and production configurations.

## 🔧 Development Server Configuration

### Common Settings Across All Apps

```typescript
server: {
  host: true,              // Listen on all network addresses (0.0.0.0)
  port: 5000/5001/5002,    // Different port for each app
  strictPort: true,        // Exit if port is already in use
  cors: true,              // Enable CORS for module federation
  open: false,             // Don't auto-open browser (manual control)
  hmr: {
    overlay: true,         // Show error overlay on the page
  },
  watch: {
    usePolling: false,     // Use native file watching (faster)
  },
}
```

### Port Assignment

| Application | Port | URL |
|------------|------|-----|
| host-app | 5000 | http://localhost:5000 |
| list-user-app | 5001 | http://localhost:5001 |
| create-user-app | 5002 | http://localhost:5002 |

### Key Features

#### `host: true`
- Makes the server accessible from other devices on your network
- Useful for testing on mobile devices or other computers
- Server will be available at `http://[your-ip]:5000`

#### `strictPort: true`
- Prevents Vite from trying alternative ports
- Ensures consistent port numbers for Module Federation
- Server will fail to start if port is already in use (prevents confusion)

#### `cors: true`
- Essential for Module Federation
- Allows cross-origin requests between micro-frontends
- Required for remoteEntry.js loading

#### `hmr.overlay: true`
- Shows build errors directly on the page
- Helpful for quick debugging during development

#### `watch.usePolling: false`
- Uses native file system events (faster)
- Set to `true` if file watching doesn't work (e.g., in Docker, WSL)

### Proxy Configuration (Remote Apps)

List-user-app and create-user-app include proxy configuration for API calls:

```typescript
proxy: {
  // Example: '/api': 'http://localhost:3000'
}
```

**Usage Example:**
```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

## 🚀 Preview Server Configuration

Used for previewing production builds locally:

```typescript
preview: {
  host: true,
  port: 5000/5001/5002,
  strictPort: true,
  cors: true,
}
```

**Usage:**
```bash
# Build and preview
npm run build
npm run preview
```

## 🏗️ Production Build Configuration

### Build Settings

```typescript
build: {
  target: 'esnext',           // Target modern browsers
  outDir: 'dist',             // Output directory
  assetsDir: 'assets',        // Assets subdirectory
  minify: 'esbuild',          // Fast minification with esbuild
  cssCodeSplit: true,         // Split CSS into separate files
  sourcemap: false,           // Disable sourcemaps (enable for debugging)
  rollupOptions: {
    output: {
      manualChunks: undefined, // Let Vite handle chunking
    },
  },
  chunkSizeWarningLimit: 1500, // Warning threshold in KB
  cssMinify: true,            // Minify CSS
}
```

### Key Production Settings

#### `target: 'esnext'`
- Targets the latest JavaScript features
- Smaller bundle size
- Better performance
- Assumes modern browser support

If you need to support older browsers:
```typescript
target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14']
```

#### `minify: 'esbuild'`
- Fast minification using esbuild
- Alternatives: `'terser'` (slower but better compression) or `false` (no minification)

#### `cssCodeSplit: true`
- Splits CSS into separate files per component
- Better caching and parallel loading
- Set to `false` for single CSS file

#### `sourcemap: false`
- Disables source maps in production (smaller bundle)
- Set to `true` or `'inline'` for debugging production issues

**Options:**
- `false`: No sourcemaps
- `true`: Separate .map files
- `'inline'`: Inlined in the bundle
- `'hidden'`: Generated but not referenced

#### `chunkSizeWarningLimit`
- Warning when chunks exceed this size (in KB)
- Host app: 1500 KB (larger due to router, store)
- Remote apps: 1000 KB
- Adjust based on your needs

## ⚡ Optimization Configuration

```typescript
optimizeDeps: {
  include: ['vue', 'vue-router', 'vuex'], // Pre-bundle these dependencies
  exclude: [],                             // Skip pre-bundling these
}
```

### Purpose
- Pre-bundles dependencies during dev server startup
- Faster page loads during development
- Converts CommonJS to ESM

### When to Add Dependencies

**Include:**
- Large dependencies that don't change often
- Dependencies causing slow reloads
- CommonJS packages

**Exclude:**
- Dependencies that don't work when pre-bundled
- Local packages under development

## 🌍 Environment-Specific Configurations

You can create environment-specific configs:

### Option 1: Mode-based configuration

```typescript
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'
  
  return {
    // ... your config
    build: {
      sourcemap: isDev,
      minify: isDev ? false : 'esbuild',
    }
  }
})
```

### Option 2: Separate config files

Create `vite.config.dev.ts` and `vite.config.prod.ts`:

```json
// package.json
{
  "scripts": {
    "dev": "vite --config vite.config.dev.ts",
    "build": "vite build --config vite.config.prod.ts"
  }
}
```

## 🔧 Common Adjustments

### Enable Source Maps for Production Debugging

```typescript
build: {
  sourcemap: true, // or 'hidden'
}
```

### Better Terser Minification

```typescript
build: {
  minify: 'terser',
  terserOptions: {
    compress: {
      drop_console: true, // Remove console.logs
      drop_debugger: true,
    },
  },
}
```

### Manual Chunk Splitting

```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vue-vendor': ['vue', 'vue-router', 'vuex'],
        'utils': ['./src/utils/helpers.ts'],
      },
    },
  },
}
```

### Custom Asset File Names

```typescript
build: {
  rollupOptions: {
    output: {
      chunkFileNames: 'js/[name]-[hash].js',
      entryFileNames: 'js/[name]-[hash].js',
      assetFileNames: 'assets/[name]-[hash].[ext]',
    },
  },
}
```

### Watch for Docker/WSL

```typescript
server: {
  watch: {
    usePolling: true, // Enable if native watching doesn't work
    interval: 100,
  },
}
```

### HTTPS in Development

```typescript
server: {
  https: true,
  // Or with custom certificate:
  https: {
    key: fs.readFileSync('path/to/key.pem'),
    cert: fs.readFileSync('path/to/cert.pem'),
  },
}
```

## 📊 Performance Optimization Tips

### 1. Analyze Bundle Size

```bash
npm run build -- --mode analyze
```

Add to package.json:
```json
{
  "scripts": {
    "analyze": "vite build && rollup-plugin-visualizer"
  }
}
```

### 2. Lazy Load Routes (Host App)

```typescript
// router/index.ts
{
  path: '/users',
  component: () => import('../views/ListUserView.vue'), // Lazy loaded
}
```

### 3. Pre-load Critical Dependencies

```typescript
optimizeDeps: {
  include: [
    'vue',
    'vuex',
    'vue-router',
    // Add other frequently used deps
  ],
}
```

### 4. Enable Build Cache

```typescript
build: {
  cache: true, // Cache build results
}
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port
lsof -ti:5000 | xargs kill -9

# Or use different port temporarily
vite --port 5010
```

### Module Federation Not Working

1. Ensure all apps are running
2. Check CORS is enabled
3. Verify port numbers match in config
4. Clear browser cache
5. Restart all dev servers

### Slow Hot Module Reload

```typescript
optimizeDeps: {
  include: ['large-dependency'],
}
```

### Build Fails with Memory Error

```bash
# Increase Node memory
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

## 📚 Additional Resources

- [Vite Configuration Reference](https://vitejs.dev/config/)
- [Module Federation Documentation](https://module-federation.io/)
- [Rollup Options](https://rollupjs.org/configuration-options/)

## 🎯 Quick Commands

```bash
# Development
npm run dev                 # Start dev server
npm run dev -- --host       # Expose to network
npm run dev -- --port 3000  # Use different port

# Production
npm run build               # Build for production
npm run preview             # Preview production build

# Cleanup
rm -rf dist node_modules/.vite  # Clear cache
```

## ✅ Configuration Checklist

- [x] Development server configured with CORS
- [x] Strict port enforcement enabled
- [x] HMR overlay enabled for errors
- [x] Production minification with esbuild
- [x] CSS code splitting enabled
- [x] Source maps disabled in production
- [x] Chunk size warnings configured
- [x] Dependencies pre-bundled for optimization
- [x] Preview server configured
- [x] Module Federation remotes properly set up

Your Vite configuration is now production-ready! 🎉

