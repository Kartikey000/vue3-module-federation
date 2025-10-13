# Vue 3 Module Federation with Shared Vuex Store

This project demonstrates a complete Module Federation setup with Vue 3, featuring multiple micro-frontends that share a centralized Vuex store for state management.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  Host App (Port 5000)                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Vuex Store (Exposed & Shared)                       │   │
│  │  - User CRUD Operations                              │   │
│  │  - State: users, loading, error, currentUser         │   │
│  │  - Actions: fetchUsers, createUser, updateUser, etc. │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  Exposes:                                                    │
│  - ./store (Vuex Store)                                      │
│                                                              │
│  Consumes:                                                   │
│  - listUserApp/ListUser                                      │
│  - createUserApp/CreateUpdateUser                            │
└────────────────┬─────────────────────────┬──────────────────┘
                 │                         │
       ┌─────────▼────────┐      ┌────────▼──────────┐
       │  List User App   │      │ Create User App   │
       │   (Port 5001)    │      │   (Port 5002)     │
       │                  │      │                   │
       │  Exposes:        │      │  Exposes:         │
       │  - ./ListUser    │      │  - ./CreateUpdate │
       │                  │      │     User          │
       │  Consumes:       │      │                   │
       │  - host/store    │      │  Consumes:        │
       │                  │      │  - host/store     │
       └──────────────────┘      └───────────────────┘
```

## 📦 Project Structure

```
vue3-mf/
├── host-app/              # Main host application
│   ├── src/
│   │   ├── store/
│   │   │   └── index.ts   # Vuex store with CRUD operations
│   │   ├── views/
│   │   │   ├── HomeView.vue
│   │   │   ├── AboutView.vue
│   │   │   ├── ListUserView.vue
│   │   │   ├── CreateUserView.vue
│   │   │   └── StoreInjector.vue  # Injects store to remotes
│   │   ├── router/
│   │   │   └── index.ts
│   │   └── main.ts
│   └── vite.config.ts     # Exposes store, consumes remotes
│
├── list-user-app/         # List users micro-frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── ListUser.vue    # Uses shared Vuex store
│   │   ├── store-init.ts       # Fallback store for standalone
│   │   └── main.ts
│   └── vite.config.ts     # Exposes ListUser, consumes host/store
│
└── create-user-app/       # Create/Update user micro-frontend
    ├── src/
    │   ├── components/
    │   │   └── CreateUpdateUser.vue  # Uses shared Vuex store
    │   ├── store-init.ts             # Fallback store for standalone
    │   └── main.ts
    └── vite.config.ts     # Exposes CreateUpdateUser, consumes host/store
```

## 🚀 Features

### Vuex Store (Centralized State Management)

The host app exposes a complete Vuex store that provides:

**State:**
- `users: User[]` - Array of all users
- `loading: boolean` - Loading state for async operations
- `error: string | null` - Error messages
- `currentUser: User | null` - Currently selected user

**Getters:**
- `allUsers` - Get all users
- `activeUsers` - Get only active users
- `inactiveUsers` - Get inactive users
- `getUserById(id)` - Get user by ID
- `usersByRole(role)` - Filter users by role
- `isLoading` - Check if loading
- `hasError` - Check if there's an error
- `errorMessage` - Get error message
- `totalUsers` - Get total user count
- `currentUser` - Get current user

**Actions (CRUD):**
- `fetchUsers()` - Fetch all users
- `fetchUserById(id)` - Fetch single user
- `createUser(userData)` - Create new user
- `updateUser(userData)` - Update existing user
- `deleteUser(userId)` - Delete user
- `clearCurrentUser()` - Clear current user selection
- `clearError()` - Clear error state

### Remote Components

1. **ListUser Component** (`list-user-app`)
   - Displays all users in a grid layout
   - Search/filter functionality
   - Edit and delete actions
   - Fetches data from shared Vuex store
   - Real-time updates when users are added/updated

2. **CreateUpdateUser Component** (`create-user-app`)
   - Form for creating new users
   - Form for updating existing users
   - Complete validation
   - Success/error handling
   - Saves data to shared Vuex store

## 🔧 Installation

### Prerequisites
- Node.js >= 20.19.0 or >= 22.12.0
- npm or yarn

### Install Dependencies

```bash
# Install root dependencies (if any)
npm install

# Install host-app dependencies
cd host-app
npm install

# Install list-user-app dependencies
cd ../list-user-app
npm install

# Install create-user-app dependencies
cd ../create-user-app
npm install
```

### Required Packages

Each app needs these packages:

```bash
# Core packages
npm install vue@^3.5.22 vuex@^4.0.0 vue-router@^4.0.0

# Module Federation
npm install @module-federation/vite

# Dev dependencies (already in package.json)
```

## 🎯 Running the Application

You need to run all three applications simultaneously. Open three terminal windows:

### Terminal 1 - Host App
```bash
cd host-app
npm run dev
# Runs on http://localhost:5000
```

### Terminal 2 - List User App
```bash
cd list-user-app
npm run dev
# Runs on http://localhost:5001
```

### Terminal 3 - Create User App
```bash
cd create-user-app
npm run dev
# Runs on http://localhost:5002
```

### Access the Applications

- **Host App (Main):** http://localhost:5000
- **List User App (Standalone):** http://localhost:5001
- **Create User App (Standalone):** http://localhost:5002

## 📝 How It Works

### 1. Store Sharing

The host app exposes its Vuex store via Module Federation:

```typescript
// host-app/vite.config.ts
federation({
  name: 'host',
  exposes: {
    './store': './src/store/index.ts',  // Store is exposed
  },
  shared: {
    vue: { singleton: true },
    vuex: { singleton: true },  // Vuex must be singleton
  },
})
```

Remote apps consume the host store:

```typescript
// list-user-app/vite.config.ts
federation({
  name: 'listUserApp',
  remotes: {
    host: {
      entry: 'http://localhost:5000/mf-manifest.json',  // Consumes host
    },
  },
  shared: {
    vue: { singleton: true },
    vuex: { singleton: true },
  },
})
```

### 2. Using Store in Remote Components

Remote components use `useStore()` from Vuex:

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

// Access store data
const users = computed(() => store.getters.allUsers)
const loading = computed(() => store.getters.isLoading)

// Dispatch actions
const fetchUsers = () => {
  store.dispatch('fetchUsers')
}

const deleteUser = (id) => {
  store.dispatch('deleteUser', id)
}
</script>
```

### 3. Standalone Mode

Each remote app has a `store-init.ts` file that provides a fallback store for standalone development:

```typescript
// When run standalone, uses local store
// When federated, uses host store (injected by host app)
```

### 4. Store Injection

The host app uses a `StoreInjector` component to ensure remote components have access to the store:

```vue
<StoreInjector>
  <component :is="RemoteComponent" />
</StoreInjector>
```

## 🎨 Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | HomeView | Landing page |
| `/about` | AboutView | About page |
| `/users` | ListUserView (with remote ListUser) | List all users |
| `/users/create` | CreateUserView (with remote CreateUpdateUser) | Create new user |
| `/users/edit/:id` | CreateUserView (with remote CreateUpdateUser) | Edit existing user |

## 🔄 Data Flow

1. **Fetching Users:**
   ```
   ListUserView → Load RemoteListUser → useStore() → fetchUsers() 
   → Vuex Store → Users displayed in grid
   ```

2. **Creating User:**
   ```
   CreateUserView → Load RemoteCreateUpdateUser → Form submission 
   → useStore() → createUser(data) → Vuex Store → Navigate back 
   → ListUserView automatically shows new user
   ```

3. **Updating User:**
   ```
   ListUserView (click Edit) → Navigate to /users/edit/:id 
   → CreateUserView → Load RemoteCreateUpdateUser with userId prop 
   → fetchUserById(id) → Load form → Submit → updateUser(data) 
   → Navigate back → Updated user appears in list
   ```

4. **Deleting User:**
   ```
   ListUserView → Click delete → Confirm → deleteUser(id) 
   → Vuex Store removes user → UI updates automatically
   ```

## 🛠️ Development

### Adding New User Fields

1. Update the `User` interface in `host-app/src/store/index.ts`
2. Update the form in `create-user-app/src/components/CreateUpdateUser.vue`
3. Update the display in `list-user-app/src/components/ListUser.vue`

### Adding New Store Actions

1. Add action to `host-app/src/store/index.ts`
2. Use in remote components with `store.dispatch('actionName', payload)`

### TypeScript Support

Type declarations for remote modules are in:
- `host-app/src/remote-types.d.ts`

## 🚀 Building for Production

```bash
# Build all apps
cd host-app && npm run build
cd ../list-user-app && npm run build
cd ../create-user-app && npm run build
```

## 🔍 Troubleshooting

### Remote component not loading
- Ensure all three apps are running
- Check browser console for errors
- Verify port numbers in vite.config.ts files

### Store not accessible in remote
- Ensure Vuex is installed in all apps
- Verify `singleton: true` in shared config
- Check that host app is running first

### TypeScript errors
- Run `npm run type-check` in each app
- Ensure all dependencies are installed

## 📚 Key Concepts

1. **Module Federation:** Allows different applications to share code at runtime
2. **Singleton Sharing:** Ensures Vue and Vuex have only one instance across all apps
3. **Remote Components:** Components loaded dynamically from other applications
4. **Shared Store:** Centralized state management across micro-frontends
5. **Independent Development:** Each app can run and develop independently

## 🎓 Learning Resources

- [Module Federation](https://module-federation.io/)
- [Vue 3 Documentation](https://vuejs.org/)
- [Vuex 4 Documentation](https://vuex.vuejs.org/)
- [Vite Module Federation Plugin](https://github.com/module-federation/vite)

## 📄 License

MIT

## 👥 Contributing

Feel free to submit issues and enhancement requests!

