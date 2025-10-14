<template>
  <div class="create-update-user">
    <h2>{{ isEditMode ? 'Edit User' : 'Create New User' }}</h2>
    
    <form @submit.prevent="handleSubmit" class="user-form">
      <div class="form-group">
        <label for="name">Full Name *</label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          placeholder="Enter full name"
          required
          :class="{ 'error': errors.name }"
        />
        <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
      </div>

      <div class="form-group">
        <label for="email">Email Address *</label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          placeholder="Enter email address"
          required
          :class="{ 'error': errors.email }"
        />
        <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
      </div>

      <div class="form-group">
        <label for="role">Role *</label>
        <select
          id="role"
          v-model="formData.role"
          required
          :class="{ 'error': errors.role }"
        >
          <option value="">Select a role</option>
          <option value="Admin">Admin</option>
          <option value="Editor">Editor</option>
          <option value="User">User</option>
          <option value="Viewer">Viewer</option>
        </select>
        <span v-if="errors.role" class="error-message">{{ errors.role }}</span>
      </div>

      <div class="form-group">
        <label for="phone">Phone Number</label>
        <input
          id="phone"
          v-model="formData.phone"
          type="tel"
          placeholder="Enter phone number"
          :class="{ 'error': errors.phone }"
        />
        <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
      </div>

      <div class="form-group">
        <label for="department">Department</label>
        <input
          id="department"
          v-model="formData.department"
          type="text"
          placeholder="Enter department"
        />
      </div>

      <div class="form-group checkbox-group">
        <label>
          <input
            v-model="formData.active"
            type="checkbox"
          />
          <span>Active User</span>
        </label>
      </div>

      <div class="form-actions">
        <button type="button" @click="handleCancel" class="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
          {{ isSubmitting ? 'Saving...' : (isEditMode ? 'Update User' : 'Create User') }}
        </button>
      </div>
    </form>

    <div v-if="successMessage" class="success-banner">
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { addPageAction, trackFormSubmission, trackUserInteraction, noticeError, trackComponentLoad } from '../utils/newrelic-helper'
import { perfMonitor } from '../utils/performance-monitoring'

interface Props {
  userId?: string | number
  store?: any
  router?: any
}

const props = defineProps<Props>()

// Use provided store or fallback to local store
const store = props.store || useStore()

// Try to get router from props (when federated) or useRouter (when standalone)
let router: any = null
try {
  router = props.router || useRouter()
} catch (e) {
  // Router not available, will use window.location as fallback
  console.log('Router not available in federated mode')
}

interface UserFormData {
  name: string
  email: string
  role: string
  phone: string
  department: string
  active: boolean
}

interface FormErrors {
  name?: string
  email?: string
  role?: string
  phone?: string
}

const formData = reactive<UserFormData>({
  name: '',
  email: '',
  role: '',
  phone: '',
  department: '',
  active: true,
})

const errors = reactive<FormErrors>({})
const isSubmitting = computed(() => store.getters.isLoading)
const successMessage = ref('')
const isEditMode = ref(false)

// Define resetForm before it's used in watch
const resetForm = () => {
  formData.name = ''
  formData.email = ''
  formData.role = ''
  formData.phone = ''
  formData.department = ''
  formData.active = true
  Object.keys(errors).forEach(key => {
    delete errors[key as keyof FormErrors]
  })
}

// Define loadUser before it's used in watch
const loadUser = async (id: string | number) => {
  try {
    // Mark data load start with custom attributes
    perfMonitor.markDataLoadStart('loadUser', {
      userId: id,
      operation: 'fetchUserForEdit',
      endpoint: '/api/users/:id'
    })
    
    // Fetch user from Vuex store
    const numericId = typeof id === 'string' ? parseInt(id) : id
    
    // First, try to get from existing users in store
    let user = store.getters.getUserById(numericId)
    
    // If not found, fetch all users first
    if (!user) {
      await store.dispatch('fetchUsers')
      user = store.getters.getUserById(numericId)
    }
    
    // If still not found, try fetchUserById
    if (!user) {
      await store.dispatch('fetchUserById', numericId)
      user = store.getters.currentUser
    }
    
    // Mark data load end with result metadata
    perfMonitor.markDataLoadEnd('loadUser', {
      userId: id,
      success: !!user,
      userFound: !!user,
      source: user ? 'store' : 'api'
    })
    
    // Populate form with user data
    if (user) {
      formData.name = user.name
      formData.email = user.email
      formData.role = user.role
      formData.phone = user.phone || ''
      formData.department = user.department || ''
      formData.active = user.active
    } else {
      alert('User not found')
    }
  } catch (err) {
    // Mark data load end with error
    perfMonitor.markDataLoadEnd('loadUser', {
      userId: id,
      success: false,
      error: (err as Error).message
    })
    console.error('Error loading user:', err)
    noticeError(err as Error, { operation: 'loadUser', userId: id })
    alert('Failed to load user data')
  }
}

// Watch for userId changes
watch(() => props.userId, (newId) => {
  if (newId) {
    isEditMode.value = true
    loadUser(newId)
  } else {
    isEditMode.value = false
    resetForm()
  }
}, { immediate: true })

const validateForm = (): boolean => {
  // Clear previous errors
  Object.keys(errors).forEach(key => {
    delete errors[key as keyof FormErrors]
  })
  
  let isValid = true
  
  if (!formData.name.trim()) {
    errors.name = 'Name is required'
    isValid = false
  }
  
  if (!formData.email.trim()) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }
  
  if (!formData.role) {
    errors.role = 'Role is required'
    isValid = false
  }
  
  if (formData.phone && !/^[\d\s+()-]+$/.test(formData.phone)) {
    errors.phone = 'Please enter a valid phone number'
    isValid = false
  }
  
  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  successMessage.value = ''
  const startTime = performance.now()
  const formType = isEditMode.value ? 'update' : 'create'
  
  // Mark interaction start with custom attributes
  perfMonitor.markInteractionStart(`${formType}User`, {
    formType,
    userId: props.userId || null,
    hasPhone: !!formData.phone,
    hasDepartment: !!formData.department,
    userRole: formData.role,
    isActive: formData.active
  })

  try {
    if (isEditMode.value && props.userId) {
      // Update existing user
      const numericId = typeof props.userId === 'string' ? parseInt(props.userId) : props.userId
      await store.dispatch('updateUser', {
        id: numericId,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        phone: formData.phone,
        department: formData.department,
        active: formData.active,
      })

      successMessage.value = 'User updated successfully!'
    } else {
      // Create new user
      await store.dispatch('createUser', {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        phone: formData.phone,
        department: formData.department,
        active: formData.active,
      })

      successMessage.value = 'User created successfully!'
    }

    const duration = performance.now() - startTime
    
    // Mark interaction end with success metadata
    perfMonitor.markInteractionEnd(`${formType}User`, {
      formType,
      userId: props.userId || null,
      success: true,
      duration: Math.round(duration),
      userRole: formData.role,
      fieldsCompleted: [
        'name', 'email', 'role',
        formData.phone && 'phone',
        formData.department && 'department'
      ].filter(Boolean).length
    })
    
    // Track successful form submission
    trackFormSubmission(formType, true, 0)

    setTimeout(() => {
      successMessage.value = ''
      if (!isEditMode.value) {
        resetForm()
      }
      // Navigate to users list using router (no page reload, keeps store state)
      if (router) {
        router.push('/users')
      } else {
        // Fallback to window navigation if router not available
        window.location.href = '/users'
      }
    }, 1500)

  } catch (error) {
    const duration = performance.now() - startTime
    
    // Mark interaction end (even on failure) with error metadata
    perfMonitor.markInteractionEnd(`${formType}User`, {
      formType,
      userId: props.userId || null,
      success: false,
      duration: Math.round(duration),
      error: (error as Error).message,
      userRole: formData.role
    })
    
    // Track failed form submission
    trackFormSubmission(formType, false, 0, (error as Error).message)
    noticeError(error as Error, {
      action: 'formSubmit',
      formType,
      userId: props.userId
    })
    
    console.error('Error saving user:', error)
    alert('An error occurred while saving the user. Please try again.')
  }
}

const handleCancel = () => {
  if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
    // Track cancel action
    trackUserInteraction('cancel', 'form', {
      formType: isEditMode.value ? 'update' : 'create',
      hasChanges: !!(formData.name || formData.email)
    })
    
    window.history.back()
  }
}

onMounted(() => {
  // Mark component load start with custom attributes
  perfMonitor.markComponentLoadStart('CreateUpdateUser', {
    componentType: 'form',
    isRemote: true,
    isFederated: !!props.store, // true if loaded via Module Federation
    mode: props.userId ? 'edit' : 'create',
    userId: props.userId || null,
    route: window.location.pathname
  })
  
  if (props.userId) {
    isEditMode.value = true
    loadUser(props.userId)
  }
  
  // Mark component load end with final metadata
  perfMonitor.markComponentLoadEnd('CreateUpdateUser', {
    mode: isEditMode.value ? 'edit' : 'create',
    userId: props.userId || null,
    dataLoaded: isEditMode.value,
    formReady: true,
    renderComplete: true
  })
  
  // Track component load for New Relic (legacy)
  trackComponentLoad('CreateUpdateUser', performance.now())
  
  // Set custom attributes
  addPageAction('createUpdateUserViewed', {
    mode: isEditMode.value ? 'edit' : 'create',
    userId: props.userId || null
  })
})
</script>

<style scoped>
.create-update-user {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

h2 {
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 1.75rem;
}

.user-form {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="tel"],
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #42b983;
}

.form-group input.error,
.form-group select.error {
  border-color: #dc3545;
}

.error-message {
  display: block;
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-group input[type="checkbox"] {
  width: auto;
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: flex-end;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #42b983;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #359268;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.success-banner {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #42b983;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease;
  z-index: 1000;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .user-form {
    padding: 1.5rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>

