import { defineStore } from 'pinia'
import { RegistrationApi } from '../api/RegistrationApi'

const registrationApi = new RegistrationApi()

export const useRegistrationStore = defineStore('registration', {
  state: () => ({
    isLoggedIn: false,
    currentUser: null as any,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async logIn(email: string, password: string) {
      this.loading = true
      this.error = null
      try {
        const res = await registrationApi.logIn(email, password)
        if (res.data.success) {
          this.isLoggedIn = true
          this.currentUser = res.data.user
          console.log('✅ Logged in as', this.currentUser.name)
        } else {
          this.error = res.data.message || 'Invalid credentials'
        }
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message
        console.error('Login error:', this.error)
      } finally {
        this.loading = false
      }
    },

    async signUp(username: string, email: string, password: string) {
      this.loading = true
      this.error = null
      try {
        const res = await registrationApi.signUp(username, email, password)
        if (res.data.success) {
          alert('Account created! You can now log in.')
        } else {
          this.error = res.data.message || 'Sign-up failed'
        }
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message
        console.error('Sign-up error:', this.error)
      } finally {
        this.loading = false
      }
    },

    logOut() {
      this.isLoggedIn = false
      this.currentUser = null
    },
  },
})
