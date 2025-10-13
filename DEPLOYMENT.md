# Vercel Deployment Guide

## 📦 Overview

This Module Federation setup consists of three separate applications that need to be deployed independently:

1. **host-app** - Main application (port 5000)
2. **list-user-app** - Remote micro-frontend (port 5001)
3. **create-user-app** - Remote micro-frontend (port 5002)

## 🚀 Deployment Steps

### Step 1: Deploy Remote Apps First

#### Deploy list-user-app

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your repository
4. **Root Directory:** `list-user-app`
5. **Framework Preset:** Vite
6. **Build Command:** `npm run build`
7. **Output Directory:** `dist`
8. **Environment Variables:**
   - Add: `VITE_HOST_APP_URL` (leave empty for now, will update later)
9. Click "Deploy"
10. **Save the deployment URL** (e.g., `https://list-user-app-xxx.vercel.app`)

#### Deploy create-user-app

1. Repeat the same steps for `create-user-app`
2. **Root Directory:** `create-user-app`
3. Save the deployment URL (e.g., `https://create-user-app-xxx.vercel.app`)

### Step 2: Deploy Host App

1. Go to Vercel Dashboard → New Project
2. Import your repository
3. **Root Directory:** `host-app`
4. **Framework Preset:** Vite
5. **Build Command:** `npm run build`
6. **Output Directory:** `dist`
7. **Environment Variables:**
   ```
   VITE_LIST_USER_APP_URL=https://list-user-app-xxx.vercel.app
   VITE_CREATE_USER_APP_URL=https://create-user-app-xxx.vercel.app
   ```
   *(Replace with your actual URLs from Step 1)*
8. Click "Deploy"
9. **Save the host-app URL** (e.g., `https://host-app-xxx.vercel.app`)

### Step 3: Update Remote Apps with Host URL

#### Update list-user-app

1. Go to list-user-app project in Vercel
2. Settings → Environment Variables
3. Add/Update:
   ```
   VITE_HOST_APP_URL=https://host-app-xxx.vercel.app
   ```
4. Redeploy

#### Update create-user-app

1. Go to create-user-app project in Vercel
2. Settings → Environment Variables
3. Add/Update:
   ```
   VITE_HOST_APP_URL=https://host-app-xxx.vercel.app
   ```
4. Redeploy

### Step 4: Final Verification

1. Visit your host-app URL
2. Test all routes:
   - `/` - Home page
   - `/about` - About page
   - `/users` - List users (loads list-user-app)
   - `/users/create` - Create user (loads create-user-app)
   - `/users/edit/:id` - Edit user

## 📋 Environment Variables Summary

### host-app
```bash
VITE_LIST_USER_APP_URL=https://your-list-user-app.vercel.app
VITE_CREATE_USER_APP_URL=https://your-create-user-app.vercel.app
VITE_API_BASE_URL=https://your-api.vercel.app/api  # Optional
```

### list-user-app
```bash
VITE_HOST_APP_URL=https://your-host-app.vercel.app
VITE_API_BASE_URL=https://your-api.vercel.app/api  # Optional
```

### create-user-app
```bash
VITE_HOST_APP_URL=https://your-host-app.vercel.app
VITE_API_BASE_URL=https://your-api.vercel.app/api  # Optional
```

## 🔄 Update .env.production Files

After deployment, update your local `.env.production` files with the actual Vercel URLs:

**host-app/.env.production:**
```bash
VITE_LIST_USER_APP_URL=https://your-actual-list-user-app.vercel.app
VITE_CREATE_USER_APP_URL=https://your-actual-create-user-app.vercel.app
```

**list-user-app/.env.production:**
```bash
VITE_HOST_APP_URL=https://your-actual-host-app.vercel.app
```

**create-user-app/.env.production:**
```bash
VITE_HOST_APP_URL=https://your-actual-host-app.vercel.app
```

## 🐛 Troubleshooting

### Issue: CORS Errors

**Solution:** The `vercel.json` files include CORS headers. If issues persist:
1. Check Vercel deployment logs
2. Verify `remoteEntry.js` is accessible: `https://your-app.vercel.app/remoteEntry.js`
3. Check browser console for specific errors

### Issue: Remote Component Not Loading

**Solution:**
1. Verify environment variables are set correctly in Vercel
2. Check that all apps are deployed
3. Ensure URLs don't have trailing slashes
4. Verify CORS headers are working

### Issue: Store Not Syncing

**Solution:**
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Check that Vuex is shared as singleton in all configs

### Issue: Build Fails

**Solution:**
1. Check Node.js version (should be >= 20.19.0)
2. Run `npm install` locally first
3. Check build logs in Vercel dashboard
4. Verify all dependencies are in package.json

## 📱 Testing Production Build Locally

Before deploying, test the production build locally:

```bash
# Build all apps
cd host-app && npm run build && cd ..
cd list-user-app && npm run build && cd ..
cd create-user-app && npm run build && cd ..

# Preview all apps (in separate terminals)
cd host-app && npm run preview       # Port 5000
cd list-user-app && npm run preview  # Port 5001
cd create-user-app && npm run preview # Port 5002
```

## 🎯 Continuous Deployment

Vercel automatically deploys when you push to your repository:

1. **Production:** Push to `main` branch
2. **Preview:** Push to any other branch or create a PR

Set up branch protection and preview URLs for testing before production.

## 📊 Monitoring

### Vercel Analytics

Enable analytics in each project:
1. Go to Project Settings
2. Analytics tab
3. Enable Web Analytics

### Performance

Monitor:
- Build times
- Bundle sizes
- Loading performance
- Error rates

## 🔐 Security Best Practices

1. **Never commit `.env.local` or `.env.production`** - Use Vercel environment variables
2. **Use HTTPS only** - Vercel provides this by default
3. **Implement authentication** if handling sensitive data
4. **Rate limiting** for API calls
5. **Content Security Policy** headers

## 🚦 Deployment Checklist

- [ ] All three apps deployed to Vercel
- [ ] Environment variables configured
- [ ] Remote apps can access host store
- [ ] CORS headers working
- [ ] All routes working
- [ ] Create/Edit/Delete functionality working
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Performance is acceptable

## 📖 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
- [Module Federation Guide](https://module-federation.io/)
- [Vue 3 Production Guide](https://vuejs.org/guide/best-practices/production-deployment.html)

## 💡 Tips

- Use Vercel's preview deployments for testing
- Set up custom domains for professional URLs
- Enable caching for better performance
- Monitor bundle sizes to optimize loading
- Use environment variables for all configuration

Good luck with your deployment! 🎉

