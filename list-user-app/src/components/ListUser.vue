<template>
  <div class="list-user">
    <div class="search-bar">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Search users..."
        class="search-input"
      />
    </div>

    <div v-if="loading" class="loading">
      <p>Loading users...</p>
    </div>

    <div v-else-if="filteredUsers.length === 0" class="no-users">
      <p>No users found.</p>
    </div>

    <div v-else class="users-grid">
      <div 
        v-for="user in filteredUsers" 
        :key="user.id" 
        class="user-card"
      >
        <div class="user-avatar">
          {{ user.name.charAt(0).toUpperCase() }}
        </div>
        <div class="user-info">
          <h3>{{ user.name }}</h3>
          <p class="user-email">{{ user.email }}</p>
          <p class="user-role">{{ user.role }}</p>
        </div>
        <div class="user-actions">
          <button @click="editUser(user.id)" class="btn btn-edit">Edit</button>
          <button @click="deleteUser(user.id)" class="btn btn-delete">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { addPageAction, trackComponentLoad, trackUserInteraction, noticeError } from '../utils/newrelic-helper'
import { perfMonitor } from '../utils/performance-monitoring'

// Accept store as prop for federated mode, fallback to useStore for standalone
interface Props {
  store?: any
}

const props = defineProps<Props>()

// Use provided store or fallback to local store
const store = props.store || useStore()
const searchQuery = ref('')

// Get data from Vuex store
const users = computed(() => store.getters.allUsers)
const loading = computed(() => store.getters.isLoading)
const error = computed(() => store.getters.errorMessage)

const filteredUsers = computed(() => {
  if (!searchQuery.value) {
    return users.value
  }
  
  const query = searchQuery.value.toLowerCase()
  return users.value.filter((user: any) => 
    user.name.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query) ||
    user.role.toLowerCase().includes(query)
  )
})

const editUser = (id: number) => {
  // Track user interaction
  trackUserInteraction('edit', 'user-card', { userId: id })
  
  // This will be handled by the host app via routing
  window.location.href = `/users/edit/${id}`
}

const deleteUser = async (id: number) => {
  if (confirm('Are you sure you want to delete this user?')) {
    // Mark interaction start with custom attributes
    perfMonitor.markInteractionStart('deleteUser', {
      userId: id,
      confirmationShown: true,
      userCount: users.value.length
    })
    
    try {
      await store.dispatch('deleteUser', id)
      
      // Mark interaction end with success metadata
      perfMonitor.markInteractionEnd('deleteUser', {
        userId: id,
        success: true,
        remainingUsers: users.value.length - 1
      })
      
      // Track successful deletion
      addPageAction('userDeleted', {
        userId: id,
        success: true
      })
    } catch (err) {
      // Mark interaction end (even on failure) with error metadata
      perfMonitor.markInteractionEnd('deleteUser', {
        userId: id,
        success: false,
        error: (err as Error).message
      })
      
      noticeError(err as Error, {
        action: 'deleteUser',
        userId: id
      })
      alert('Failed to delete user. Please try again.')
    }
  }
}

const refreshUsers = () => {
  store.dispatch('fetchUsers')
}

onMounted(async () => {
  // Mark component load start with custom attributes
  perfMonitor.markComponentLoadStart('ListUser', {
    componentType: 'data-table',
    isRemote: true,
    isFederated: !!props.store, // true if loaded via Module Federation
    route: window.location.pathname
  })
  
  // Only fetch if users array is empty
  // This prevents resetting data when navigating back from edit
  if (users.value.length === 0) {
    // Mark data load start with custom attributes
    perfMonitor.markDataLoadStart('fetchUsers', {
      endpoint: '/api/users',
      method: 'GET',
      cacheCheck: true,
      isInitialLoad: true
    })
    
    try {
      await store.dispatch('fetchUsers')
      
      // Mark data load end with result metadata
      perfMonitor.markDataLoadEnd('fetchUsers', {
        recordCount: users.value.length,
        success: true,
        cacheHit: false,
        hasData: users.value.length > 0
      })
    } catch (err) {
      // Mark data load end with error metadata
      perfMonitor.markDataLoadEnd('fetchUsers', {
        recordCount: 0,
        success: false,
        error: (err as Error).message
      })
      noticeError(err as Error, { operation: 'fetchUsers' })
    }
  }
  
  // Mark component load end with final metadata
  perfMonitor.markComponentLoadEnd('ListUser', {
    userCount: users.value.length,
    hasUsers: users.value.length > 0,
    dataLoaded: users.value.length > 0,
    renderComplete: true
  })
  
  // Track component load for New Relic (legacy)
  trackComponentLoad('ListUser', performance.now())
  
  // Set custom attributes
  addPageAction('listUserViewed', {
    userCount: users.value.length,
    hasSearch: !!searchQuery.value
  })
})
</script>

<style scoped>
.list-user {
  width: 100%;
}

.search-bar {
  margin-bottom: 2rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #42b983;
}

.loading,
.no-users {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.user-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.user-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #42b983 0%, #359268 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 auto;
}

.user-info {
  text-align: center;
}

.user-info h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.25rem;
}

.user-email {
  color: #666;
  font-size: 0.9rem;
  margin: 0.25rem 0;
}

.user-role {
  color: #42b983;
  font-weight: 500;
  margin: 0.25rem 0;
}

.user-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
}

.btn {
  flex: 1;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-edit {
  background-color: #42b983;
  color: white;
}

.btn-edit:hover {
  background-color: #359268;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
}

.btn-delete:hover {
  background-color: #c82333;
}
</style>

