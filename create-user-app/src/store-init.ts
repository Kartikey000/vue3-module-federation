// This file handles store initialization for both standalone and federated modes
import { createStore } from 'vuex'
import type { ActionContext } from 'vuex'

interface User {
  id: number
  name: string
  email: string
  role: string
  phone?: string
  department?: string
  active: boolean
}

interface StoreState {
  users: User[]
  loading: boolean
  error: string | null
  currentUser: User | null
}

// This is a simplified version of the host store for standalone mode
// In federated mode, the actual host store will be used
export const createUserStore = () => {
  return createStore<StoreState>({
    state: {
      users: [
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          role: 'Admin',
          phone: '+1 234 567 8900',
          department: 'Engineering',
          active: true,
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          role: 'User',
          phone: '+1 234 567 8901',
          department: 'Marketing',
          active: true,
        },
      ],
      loading: false,
      error: null,
      currentUser: null,
    },
    getters: {
      allUsers: (state: StoreState) => state.users,
      activeUsers: (state: StoreState) => state.users.filter((user: User) => user.active),
      getUserById: (state: StoreState) => (id: number) => {
        return state.users.find((user: User) => user.id === id)
      },
      isLoading: (state: StoreState) => state.loading,
      errorMessage: (state: StoreState) => state.error,
    },
    mutations: {
      SET_USERS(state: StoreState, users: User[]) {
        state.users = users
      },
      DELETE_USER(state: StoreState, userId: number) {
        state.users = state.users.filter((user: User) => user.id !== userId)
      },
      ADD_USER(state: StoreState, user: User) {
        state.users.push(user)
      },
      UPDATE_USER(state: StoreState, updatedUser: User) {
        const index = state.users.findIndex((user: User) => user.id === updatedUser.id)
        if (index !== -1) {
          state.users[index] = updatedUser
        }
      },
    },
    actions: {
      async fetchUsers({ commit }: ActionContext<StoreState, StoreState>) {
        // Mock implementation for standalone mode
        await new Promise(resolve => setTimeout(resolve, 300))
      },
      async deleteUser({ commit }: ActionContext<StoreState, StoreState>, userId: number) {
        await new Promise(resolve => setTimeout(resolve, 300))
        commit('DELETE_USER', userId)
      },
      async createUser({ commit, state }: ActionContext<StoreState, StoreState>, userData: Omit<User, 'id'>) {
        await new Promise(resolve => setTimeout(resolve, 300))
        const newUser: User = {
          ...userData,
          id: state.users.length > 0 ? Math.max(...state.users.map((u: User) => u.id)) + 1 : 1,
        }
        commit('ADD_USER', newUser)
        return newUser
      },
      async updateUser({ commit }: ActionContext<StoreState, StoreState>, userData: User) {
        await new Promise(resolve => setTimeout(resolve, 300))
        commit('UPDATE_USER', userData)
        return userData
      },
      async fetchUserById({ commit }: ActionContext<StoreState, StoreState>, userId: number) {
        await new Promise(resolve => setTimeout(resolve, 300))
      },
    },
  })
}

