<template>
  <div class="list-users">
    <div class="header">
      <h1>User List</h1>
      <router-link to="/users/create" class="btn btn-primary">Create New User</router-link>
    </div>
    
    <div class="users-container">
      <div v-if="loading" class="loading-state">
        <p>Loading List User component...</p>
      </div>
      
      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button @click="loadRemoteComponent" class="btn btn-retry">Retry</button>
      </div>
      
      <StoreInjector v-else-if="RemoteListUser">
        <template #default="{ store }">
          <component :is="RemoteListUser" :store="store" />
        </template>
      </StoreInjector>
      
      <div v-else class="placeholder">
        <h3>List User Remote App</h3>
        <p>Component not loaded yet.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import StoreInjector from './StoreInjector.vue'
import { perfMonitor } from '../utils/performance-monitoring'

const RemoteListUser = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const loadRemoteComponent = async () => {
  loading.value = true
  error.value = null
  
  // Mark start of remote component asset load
  perfMonitor.markRemoteAssetLoadStart('listUserApp')
  perfMonitor.markComponentLoadStart('ListUser')
  
  try {
    // Import the remote component using Module Federation
    const module = await import('listUserApp/ListUser')
    RemoteListUser.value = module.default || module
    
    // Mark end of asset load
    perfMonitor.markRemoteAssetLoadEnd('listUserApp')
    
    loading.value = false
    
    // Mark end of component load (after render)
    setTimeout(() => {
      perfMonitor.markComponentLoadEnd('ListUser')
    }, 0)
  } catch (err) {
    console.error('Failed to load remote ListUser component:', err)
    error.value = 'Failed to load List User component. Make sure the list-user-app is running on port 5001.'
    loading.value = false
  }
}

onMounted(() => {
  loadRemoteComponent()
})
</script>

<style scoped>
.list-users {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin: 0;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.btn-primary {
  background-color: #42b983;
  color: white;
}

.btn-primary:hover {
  background-color: #359268;
}

.users-container {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-message {
  color: #666;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f0f9ff;
  border-left: 4px solid #42b983;
  border-radius: 4px;
}

.placeholder {
  padding: 3rem;
  text-align: center;
  border: 2px dashed #ddd;
  border-radius: 8px;
  background-color: #fafafa;
}

.placeholder h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.placeholder p {
  color: #666;
}

.loading-state,
.error-state {
  padding: 3rem;
  text-align: center;
  border-radius: 8px;
}

.loading-state {
  background-color: #f0f9ff;
  border: 2px solid #42b983;
}

.loading-state p {
  color: #2c3e50;
  font-size: 1.1rem;
  animation: pulse 1.5s ease-in-out infinite;
}

.error-state {
  background-color: #fff5f5;
  border: 2px solid #dc3545;
}

.error-state p {
  color: #dc3545;
  margin-bottom: 1rem;
}

.btn-retry {
  padding: 0.75rem 1.5rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.btn-retry:hover {
  background-color: #c82333;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>

