# Quick Setup Guide

## 📦 Installation Steps

### 1. Install All Dependencies

Run this command from the root directory to install dependencies for all three apps:

```bash
npm run install:all
```

Or install manually:

```bash
# Host App
cd host-app
npm install

# List User App
cd ../list-user-app
npm install

# Create User App
cd ../create-user-app
npm install
```

### 2. Required Packages

Make sure these packages are installed in each app:

```bash
# In each app directory (host-app, list-user-app, create-user-app)
npm install @module-federation/vite
npm install vuex@^4.0.0
npm install vue-router@^4.0.0  # Only needed in host-app
```

## 🚀 Running the Project

### Option 1: Run Each App Manually (Recommended for Development)

Open **3 separate terminal windows**:

**Terminal 1 - Host App:**
```bash
cd host-app
npm run dev
```
✅ Opens on http://localhost:5000

**Terminal 2 - List User App:**
```bash
cd list-user-app
npm run dev
```
✅ Opens on http://localhost:5001

**Terminal 3 - Create User App:**
```bash
cd create-user-app
npm run dev
```
✅ Opens on http://localhost:5002

### Option 2: Use Root Scripts

```bash
# From root directory, in separate terminals:

# Terminal 1
npm run dev:host

# Terminal 2
npm run dev:list

# Terminal 3
npm run dev:create
```

## ⚡ Important Notes

1. **Start Order:** Always start the **host-app first**, then the remote apps
2. **All Apps Must Run:** All three apps need to be running for the full experience
3. **Port Numbers:** Don't change the port numbers as they're configured in the Module Federation setup

## 🧪 Testing the Setup

Once all apps are running:

1. Open http://localhost:5000 in your browser
2. Navigate to "List Users" - you should see a list of users
3. Click "Create New User" - form should load from the remote app
4. Create a user - it should appear in the list immediately
5. Click "Edit" on a user - form should load with user data
6. Delete a user - it should disappear from the list

## 🔍 Verification Checklist

- [ ] All three apps are running without errors
- [ ] Host app displays the navigation menu
- [ ] "List Users" page shows user cards
- [ ] "Create User" form is displayed and functional
- [ ] Edit user form loads with existing data
- [ ] Creating a user updates the list
- [ ] Deleting a user removes it from the list
- [ ] Search functionality works on the list page

## 🐛 Common Issues

### Issue: "Failed to fetch remote entry"
**Solution:** Make sure all three apps are running

### Issue: "Cannot find module 'vuex'"
**Solution:** Run `npm install vuex` in the affected app directory

### Issue: "Store is undefined"
**Solution:** Ensure host-app is running first and on port 5000

### Issue: TypeScript errors
**Solution:** Run `npm run type-check` in each app to identify issues

### Issue: Port already in use
**Solution:** Kill the process using the port:
```bash
# On macOS/Linux
lsof -ti:5000 | xargs kill -9
lsof -ti:5001 | xargs kill -9
lsof -ti:5002 | xargs kill -9

# Or change the port in vite.config.ts (not recommended)
```

## 📚 What to Check

### In Browser Console:
- No red errors
- Module Federation logs showing successful remote loading
- Vuex DevTools showing the shared store

### In Terminal:
- All three dev servers running
- No compilation errors
- Green "ready" messages

## 🎯 Next Steps

After successful setup:

1. Explore the code structure
2. Try modifying a user
3. Add new fields to the User model
4. Create additional store actions
5. Add more remote components

## 📖 Full Documentation

See [README.md](./README.md) for complete documentation including:
- Architecture details
- Store API reference
- Data flow diagrams
- Development guidelines
- Troubleshooting guide

## 💡 Quick Tips

- Use Vue DevTools extension to inspect components
- Use Vuex DevTools to monitor state changes
- Check Network tab to see module federation requests
- Keep all terminal windows visible to catch errors quickly

## 🎉 Success!

If you can see users, create new ones, and edit existing ones across the federated apps, your setup is complete! 

Happy coding! 🚀

