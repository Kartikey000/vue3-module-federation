<template>
  <div class="create-user">
    <div class="header">
      <h1>{{ isEditMode ? 'Edit User' : 'Create New User' }}</h1>
      <router-link to="/users" class="btn btn-secondary">Back to Users</router-link>
    </div>
    
    <div class="form-container">
      <div v-if="loading" class="loading-state">
        <p>Loading Create/Update User component...</p>
      </div>
      
      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button @click="loadRemoteComponent" class="btn btn-retry">Retry</button>
      </div>
      
      <StoreInjector v-else-if="RemoteCreateUpdateUser">
        <template #default="{ store }">
          <component 
            :is="RemoteCreateUpdateUser"
            :userId="userId"
            :store="store"
            :router="$router"
          />
        </template>
      </StoreInjector>
      
      <div v-else class="placeholder">
        <h3>Create/Update User Remote App</h3>
        <p>Component not loaded yet.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import StoreInjector from './StoreInjector.vue'
import { perfMonitor } from '../utils/performance-monitoring'

const route = useRoute()

const RemoteCreateUpdateUser = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const userId = computed(() => route.params.id)
const isEditMode = computed(() => !!userId.value)

const loadRemoteComponent = async () => {
  loading.value = true
  error.value = null
  
  // Mark start of remote component asset load with custom attributes
  perfMonitor.markRemoteAssetLoadStart('createUserApp', {
    remoteUrl: import.meta.env.PROD 
      ? 'https://vue3-module-federation-create-user.vercel.app' 
      : 'http://localhost:5002',
    loadType: 'dynamic-import',
    componentName: 'CreateUpdateUser',
    mode: isEditMode.value ? 'edit' : 'create',
    userId: userId.value || null,
    route: window.location.pathname
  })
  
  perfMonitor.markComponentLoadStart('CreateUpdateUser', {
    componentType: 'remote',
    remoteApp: 'create-user-app',
    isLazy: true,
    loadMethod: 'module-federation',
    mode: isEditMode.value ? 'edit' : 'create',
    userId: userId.value || null
  })
  
  try {
    // Import the remote component using Module Federation
    const module = await import('createUserApp/CreateUpdateUser')
    RemoteCreateUpdateUser.value = module.default || module
    
    // Mark end of asset load with success metadata
    perfMonitor.markRemoteAssetLoadEnd('createUserApp', {
      success: true,
      hasDefault: !!module.default,
      loadComplete: true,
      mode: isEditMode.value ? 'edit' : 'create'
    })
    
    loading.value = false
    
    // Mark end of component load (after render) with final metadata
    setTimeout(() => {
      perfMonitor.markComponentLoadEnd('CreateUpdateUser', {
        success: true,
        rendered: true,
        remoteApp: 'create-user-app',
        mode: isEditMode.value ? 'edit' : 'create',
        userId: userId.value || null
      })
    }, 0)
  } catch (err) {
    console.error('Failed to load remote CreateUpdateUser component:', err)
    error.value = 'Failed to load Create/Update User component. Make sure the create-user-app is running on port 5002.'
    loading.value = false
    
    // Mark failure with error metadata
    perfMonitor.markRemoteAssetLoadEnd('createUserApp', {
      success: false,
      error: (err as Error).message,
      mode: isEditMode.value ? 'edit' : 'create'
    })
    
    perfMonitor.markComponentLoadEnd('CreateUpdateUser', {
      success: false,
      error: (err as Error).message,
      remoteApp: 'create-user-app',
      mode: isEditMode.value ? 'edit' : 'create'
    })
  }
}

onMounted(() => {
  loadRemoteComponent()
})

// Watch for route changes to update userId
watch(() => route.params.id, () => {
  // Component will reactively update based on userId prop
})
</script>

<style scoped>
.create-user {
  max-width: 800px;
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

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.form-container {
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
  margin-top: 0.5rem;
}

.edit-info {
  margin-top: 1rem;
  font-size: 0.9rem;
}

.edit-info strong {
  color: #42b983;
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

