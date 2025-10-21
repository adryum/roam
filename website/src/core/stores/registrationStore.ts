import { defineStore } from 'pinia'
import { RegistrationApi } from '../api/RegistrationApi'
import type { RegistrationUserModel } from '../api/Models'

const registrationApi = new RegistrationApi()

export const useRegistrationStore = defineStore('registration', {
  state: () => ({
    user: null as RegistrationUserModel | null,
    isLoggedIn: false,
    isLoadingLogin: false,
    isLoadingSignUp: false,
  }),

  actions: {
    // ===== AUTH-LIKE FUNCTIONS =====

    loadUser() {
      const data = localStorage.getItem('user')
      if (data) {
        try {
          this.user = JSON.parse(data)
          this.isLoggedIn = true
        } catch {
          this.user = null
          this.isLoggedIn = false
        }
      }
    },

    setUser(user: RegistrationUserModel) {
      this.user = user
      this.isLoggedIn = true
      localStorage.setItem('user', JSON.stringify(user))
    },

    logout() {
      this.user = null
      this.isLoggedIn = false
      localStorage.removeItem('user')
    },

    // ===== LOGIN / SIGNUP =====

    async logIn(email: string, password: string): Promise<void> {
      this.isLoadingLogin = true
      try {
        const response = await registrationApi.logIn(email, password)
        if (response) {
          this.setUser(response)
        } else {
          this.logout()
        }
      } catch (err: any) {
        console.error('Login error:', err)
        this.logout()
      } finally {
        this.isLoadingLogin = false
      }
    },

    async signUp(
      name: string,
      surname: string,
      email: string,
      password: string
    ): Promise<RegistrationUserModel | null> {
      this.isLoadingSignUp = true
      try {
        const response = await registrationApi.signUp(name, surname, email, password)
        return response
      } catch (err) {
        console.error('Signup error:', err)
        return null
      } finally {
        this.isLoadingSignUp = false
      }
    },

    restoreSession() {
      this.loadUser()
    },
  },
})
