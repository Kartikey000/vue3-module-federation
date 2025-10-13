// This file handles store initialization for both standalone and federated modes
import { createStore } from 'vuex'

// This is a simplified version of the host store for standalone mode
// In federated mode, the actual host store will be used
export const createUserStore = () => {
  return createStore({
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
      allUsers: (state) => state.users,
      activeUsers: (state) => state.users.filter((user: any) => user.active),
      getUserById: (state) => (id: number) => {
        return state.users.find((user: any) => user.id === id)
      },
      isLoading: (state) => state.loading,
      errorMessage: (state) => state.error,
    },
    mutations: {
      SET_USERS(state, users) {
        state.users = users
      },
      DELETE_USER(state, userId) {
        state.users = state.users.filter((user: any) => user.id !== userId)
      },
      ADD_USER(state, user) {
        state.users.push(user)
      },
      UPDATE_USER(state, updatedUser) {
        const index = state.users.findIndex((user: any) => user.id === updatedUser.id)
        if (index !== -1) {
          state.users[index] = updatedUser
        }
      },
    },
    actions: {
      async fetchUsers({ commit }) {
        // Mock implementation for standalone mode
        await new Promise(resolve => setTimeout(resolve, 300))
      },
      async deleteUser({ commit }, userId) {
        await new Promise(resolve => setTimeout(resolve, 300))
        commit('DELETE_USER', userId)
      },
      async createUser({ commit }, userData) {
        await new Promise(resolve => setTimeout(resolve, 300))
        const newUser = {
          ...userData,
          id: Math.max(...this.state.users.map((u: any) => u.id)) + 1,
        }
        commit('ADD_USER', newUser)
        return newUser
      },
      async updateUser({ commit }, userData) {
        await new Promise(resolve => setTimeout(resolve, 300))
        commit('UPDATE_USER', userData)
        return userData
      },
      async fetchUserById({ commit }, userId) {
        await new Promise(resolve => setTimeout(resolve, 300))
      },
    },
  })
}

