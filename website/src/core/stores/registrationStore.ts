import { defineStore } from 'pinia'
import { RegistrationApi } from '../api/RegistrationApi'
import type { RegistrationUserModel } from '../api/Models'

const registrationApi = new RegistrationApi()

export const useRegistrationStore = defineStore('registration', {
  state: () => ({
    user: null as RegistrationUserModel | null,
    isLoggedIn: false,
    isLoadingLogin: false,
  }),

  actions: {
    async logIn(email: string, password: string): Promise<void> {
      this.isLoadingLogin = true
      try {
        const response = await registrationApi.logIn(email, password)
        
        if (!response) {
            console.log("asdasdasd");
        } else {
            this.user = response
            this.isLoggedIn = true
        }

      } catch (err: any) {
        console.error('Login error:', err)
      } finally {
        this.isLoadingLogin = false
      }
    },
    
    logOut() {
      this.isLoggedIn = false
      this.user = null
    },
  },
})
