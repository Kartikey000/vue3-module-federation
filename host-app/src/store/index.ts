import { createStore } from 'vuex'
import type { ActionContext } from 'vuex'

export interface User {
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

export interface RootState {
  users: User[]
  loading: boolean
  error: string | null
  currentUser: User | null
}

// Mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const store = createStore<RootState>({
  state: {
    users: [],
    loading: false,
    error: null,
    currentUser: null,
  },

  getters: {
    allUsers: (state: RootState) => state.users,
    
    activeUsers: (state: RootState) => state.users.filter((user: User) => user.active),
    
    inactiveUsers: (state: RootState) => state.users.filter((user: User) => !user.active),
    
    getUserById: (state: RootState) => (id: number) => {
      return state.users.find((user: User) => user.id === id)
    },
    
    usersByRole: (state: RootState) => (role: string) => {
      return state.users.filter((user: User) => user.role === role)
    },
    
    isLoading: (state: RootState) => state.loading,
    
    hasError: (state: RootState) => state.error !== null,
    
    errorMessage: (state: RootState) => state.error,
    
    totalUsers: (state: RootState) => state.users.length,
    
    currentUser: (state: RootState) => state.currentUser,
  },

  mutations: {
    SET_USERS(state: RootState, users: User[]) {
      state.users = users
    },

    SET_LOADING(state: RootState, loading: boolean) {
      state.loading = loading
    },

    SET_ERROR(state: RootState, error: string | null) {
      state.error = error
    },

    SET_CURRENT_USER(state: RootState, user: User | null) {
      state.currentUser = user
    },

    ADD_USER(state: RootState, user: User) {
      state.users.push(user)
    },

    UPDATE_USER(state: RootState, updatedUser: User) {
      const index = state.users.findIndex((user: User) => user.id === updatedUser.id)
      if (index !== -1) {
        state.users[index] = updatedUser
      }
    },

    DELETE_USER(state: RootState, userId: number) {
      state.users = state.users.filter((user: User) => user.id !== userId)
    },

    CLEAR_ERROR(state: RootState) {
      state.error = null
    },
  },

  actions: {
    // Fetch all users
    async fetchUsers({ commit }: ActionContext<RootState, RootState>) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        // Simulate API call
        await delay(500)
        
        // Mock data - replace with actual API call
        const mockUsers: User[] = [
          {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@example.com',
            role: 'Admin',
            phone: '+1 234 567 8900',
            department: 'Engineering',
            active: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: 2,
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            role: 'User',
            phone: '+1 234 567 8901',
            department: 'Marketing',
            active: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: 3,
            name: 'Bob Johnson',
            email: 'bob.johnson@example.com',
            role: 'Editor',
            phone: '+1 234 567 8902',
            department: 'Content',
            active: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: 4,
            name: 'Alice Williams',
            email: 'alice.williams@example.com',
            role: 'User',
            phone: '+1 234 567 8903',
            department: 'Sales',
            active: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: 5,
            name: 'Charlie Brown',
            email: 'charlie.brown@example.com',
            role: 'Admin',
            phone: '+1 234 567 8904',
            department: 'Engineering',
            active: false,
            createdAt: new Date().toISOString(),
          },
        ]
        
        commit('SET_USERS', mockUsers)
      } catch (error) {
        commit('SET_ERROR', 'Failed to fetch users')
        console.error('Error fetching users:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Fetch single user by ID
    async fetchUserById({ commit, state }: ActionContext<RootState, RootState>, userId: number) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        // Simulate API call
        await delay(300)
        
        const user = state.users.find((u: User) => u.id === userId)
        if (user) {
          commit('SET_CURRENT_USER', user)
        } else {
          commit('SET_ERROR', `User with ID ${userId} not found`)
        }
      } catch (error) {
        commit('SET_ERROR', 'Failed to fetch user')
        console.error('Error fetching user:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Create new user
    async createUser({ commit, state }: ActionContext<RootState, RootState>, userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        // Simulate API call
        await delay(800)
        
        // Generate new ID
        const newId = state.users.length > 0 
          ? Math.max(...state.users.map((u: User) => u.id)) + 1 
          : 1
        
        const newUser: User = {
          ...userData,
          id: newId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        
        commit('ADD_USER', newUser)
        return newUser
      } catch (error) {
        commit('SET_ERROR', 'Failed to create user')
        console.error('Error creating user:', error)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Update existing user
    async updateUser({ commit }: ActionContext<RootState, RootState>, userData: User) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        // Simulate API call
        await delay(800)
        
        const updatedUser: User = {
          ...userData,
          updatedAt: new Date().toISOString(),
        }
        
        commit('UPDATE_USER', updatedUser)
        return updatedUser
      } catch (error) {
        commit('SET_ERROR', 'Failed to update user')
        console.error('Error updating user:', error)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Delete user
    async deleteUser({ commit }: ActionContext<RootState, RootState>, userId: number) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        // Simulate API call
        await delay(500)
        
        commit('DELETE_USER', userId)
      } catch (error) {
        commit('SET_ERROR', 'Failed to delete user')
        console.error('Error deleting user:', error)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Clear current user
    clearCurrentUser({ commit }: ActionContext<RootState, RootState>) {
      commit('SET_CURRENT_USER', null)
    },

    // Clear error
    clearError({ commit }: ActionContext<RootState, RootState>) {
      commit('CLEAR_ERROR')
    },
  },
})

export default store

