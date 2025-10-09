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
    async logIn(email: string, password: string): Promise<void> {
      this.isLoadingLogin = true
      try {
        const response = await registrationApi.logIn(email, password)
        if (response) {
          this.user = response
          this.isLoggedIn = true

          localStorage.setItem('user', JSON.stringify(response))
          localStorage.setItem('isLoggedIn', 'true')
        } else {
          this.isLoggedIn = false
          this.user = null
        }
      } catch (err: any) {
        console.error('Login error:', err)
        this.isLoggedIn = false
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
    

    logOut() {
      this.isLoggedIn = false
      this.user = null
      localStorage.removeItem('user')
      localStorage.removeItem('isLoggedIn')
    },

    restoreSession() {
      const savedUser = localStorage.getItem('user')
      const savedLogin = localStorage.getItem('isLoggedIn') === 'true'
      if (savedUser && savedLogin) {
        try {
          this.user = JSON.parse(savedUser)
          this.isLoggedIn = true
        } catch (e) {
          console.warn('Failed to parse saved user:', e)
          this.user = null
          this.isLoggedIn = false
        }
      }
    },
  },
})
