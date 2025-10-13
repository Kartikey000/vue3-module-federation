# Vuex Store API Reference

## 📦 User Interface

```typescript
interface User {
  id: number
  name: string
  email: string
  role: string
  phone?: string
  department?: string
  active: boolean
  createdAt?: string
  updatedAt?: string
}
```

## 🔍 Getters

### `allUsers`
Get all users in the store.
```typescript
const users = computed(() => store.getters.allUsers)
// Returns: User[]
```

### `activeUsers`
Get only active users.
```typescript
const active = computed(() => store.getters.activeUsers)
// Returns: User[]
```

### `inactiveUsers`
Get only inactive users.
```typescript
const inactive = computed(() => store.getters.inactiveUsers)
// Returns: User[]
```

### `getUserById(id)`
Get a specific user by ID.
```typescript
const user = computed(() => store.getters.getUserById(123))
// Returns: User | undefined
```

### `usersByRole(role)`
Get all users with a specific role.
```typescript
const admins = computed(() => store.getters.usersByRole('Admin'))
// Returns: User[]
```

### `isLoading`
Check if any operation is in progress.
```typescript
const loading = computed(() => store.getters.isLoading)
// Returns: boolean
```

### `hasError`
Check if there's an error.
```typescript
const hasError = computed(() => store.getters.hasError)
// Returns: boolean
```

### `errorMessage`
Get the current error message.
```typescript
const error = computed(() => store.getters.errorMessage)
// Returns: string | null
```

### `totalUsers`
Get the total number of users.
```typescript
const count = computed(() => store.getters.totalUsers)
// Returns: number
```

### `currentUser`
Get the currently selected user.
```typescript
const current = computed(() => store.getters.currentUser)
// Returns: User | null
```

## 🎬 Actions

### `fetchUsers()`
Fetch all users from the backend (mock).
```typescript
await store.dispatch('fetchUsers')
```

**Returns:** `Promise<void>`

**Side Effects:**
- Sets `loading = true` during fetch
- Updates `users` array on success
- Sets `error` message on failure
- Sets `loading = false` when complete

**Example:**
```vue
<script setup>
import { onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

onMounted(async () => {
  await store.dispatch('fetchUsers')
})
</script>
```

---

### `fetchUserById(userId)`
Fetch a single user by ID.

**Parameters:**
- `userId: number` - The ID of the user to fetch

```typescript
await store.dispatch('fetchUserById', 123)
```

**Returns:** `Promise<void>`

**Side Effects:**
- Sets `loading = true` during fetch
- Updates `currentUser` on success
- Sets `error` if user not found
- Sets `loading = false` when complete

**Example:**
```typescript
const loadUser = async (id: number) => {
  await store.dispatch('fetchUserById', id)
  const user = store.getters.currentUser
}
```

---

### `createUser(userData)`
Create a new user.

**Parameters:**
- `userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>` - User data without ID

```typescript
await store.dispatch('createUser', {
  name: 'John Doe',
  email: 'john@example.com',
  role: 'Admin',
  phone: '+1 234 567 8900',
  department: 'Engineering',
  active: true,
})
```

**Returns:** `Promise<User>` - The created user with generated ID

**Side Effects:**
- Sets `loading = true` during creation
- Adds new user to `users` array
- Auto-generates ID and timestamps
- Sets `loading = false` when complete

**Example:**
```vue
<script setup>
const handleSubmit = async () => {
  try {
    const newUser = await store.dispatch('createUser', {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      phone: formData.phone,
      department: formData.department,
      active: true,
    })
    console.log('Created user:', newUser)
  } catch (error) {
    console.error('Failed to create user:', error)
  }
}
</script>
```

---

### `updateUser(userData)`
Update an existing user.

**Parameters:**
- `userData: User` - Complete user object with ID

```typescript
await store.dispatch('updateUser', {
  id: 123,
  name: 'John Doe Updated',
  email: 'john.updated@example.com',
  role: 'Admin',
  phone: '+1 234 567 8900',
  department: 'Engineering',
  active: true,
})
```

**Returns:** `Promise<User>` - The updated user

**Side Effects:**
- Sets `loading = true` during update
- Updates user in `users` array
- Updates `updatedAt` timestamp
- Sets `loading = false` when complete

**Example:**
```typescript
const updateUserRole = async (userId: number, newRole: string) => {
  const user = store.getters.getUserById(userId)
  if (user) {
    await store.dispatch('updateUser', {
      ...user,
      role: newRole,
    })
  }
}
```

---

### `deleteUser(userId)`
Delete a user by ID.

**Parameters:**
- `userId: number` - The ID of the user to delete

```typescript
await store.dispatch('deleteUser', 123)
```

**Returns:** `Promise<void>`

**Side Effects:**
- Sets `loading = true` during deletion
- Removes user from `users` array
- Sets `loading = false` when complete

**Example:**
```typescript
const handleDelete = async (id: number) => {
  if (confirm('Are you sure?')) {
    try {
      await store.dispatch('deleteUser', id)
      console.log('User deleted successfully')
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }
}
```

---

### `clearCurrentUser()`
Clear the currently selected user.

```typescript
store.dispatch('clearCurrentUser')
```

**Returns:** `void`

**Side Effects:**
- Sets `currentUser = null`

**Example:**
```typescript
const resetForm = () => {
  store.dispatch('clearCurrentUser')
  // Reset form fields
}
```

---

### `clearError()`
Clear the error message.

```typescript
store.dispatch('clearError')
```

**Returns:** `void`

**Side Effects:**
- Sets `error = null`

**Example:**
```typescript
const dismissError = () => {
  store.dispatch('clearError')
}
```

## 📝 Complete Usage Example

```vue
<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-if="error">{{ error }}</div>
    
    <div v-for="user in filteredUsers" :key="user.id">
      <h3>{{ user.name }}</h3>
      <p>{{ user.email }}</p>
      <button @click="editUser(user.id)">Edit</button>
      <button @click="deleteUser(user.id)">Delete</button>
    </div>
    
    <button @click="createNewUser">Create User</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const searchQuery = ref('')

// Getters
const allUsers = computed(() => store.getters.allUsers)
const loading = computed(() => store.getters.isLoading)
const error = computed(() => store.getters.errorMessage)

const filteredUsers = computed(() => {
  if (!searchQuery.value) return allUsers.value
  return allUsers.value.filter(user =>
    user.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Actions
const fetchUsers = async () => {
  await store.dispatch('fetchUsers')
}

const editUser = async (id: number) => {
  await store.dispatch('fetchUserById', id)
  const user = store.getters.currentUser
  // Open edit form with user data
}

const deleteUser = async (id: number) => {
  if (confirm('Delete this user?')) {
    await store.dispatch('deleteUser', id)
  }
}

const createNewUser = async () => {
  await store.dispatch('createUser', {
    name: 'New User',
    email: 'new@example.com',
    role: 'User',
    active: true,
  })
}

onMounted(() => {
  fetchUsers()
})
</script>
```

## 🎯 Best Practices

1. **Always use computed for getters:**
   ```typescript
   // ✅ Good
   const users = computed(() => store.getters.allUsers)
   
   // ❌ Bad
   const users = store.getters.allUsers
   ```

2. **Handle errors in actions:**
   ```typescript
   try {
     await store.dispatch('createUser', userData)
   } catch (error) {
     // Handle error
   }
   ```

3. **Check loading state:**
   ```typescript
   const isLoading = computed(() => store.getters.isLoading)
   ```

4. **Clear errors when appropriate:**
   ```typescript
   onUnmounted(() => {
     store.dispatch('clearError')
   })
   ```

5. **Use TypeScript for type safety:**
   ```typescript
   import type { User } from '@/store'
   ```

## 🔗 Links

- [Full README](./README.md)
- [Setup Guide](./SETUP.md)
- [Vuex Documentation](https://vuex.vuejs.org/)

