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

     async signUp(
      name: string,
      surname: string,
      email: string,
      password: string
    ): Promise<RegistrationUserModel | null> {
      this.isLoadingSignUp = true
      try {
        const response = await registrationApi.signUp(name, surname, email, password)
        // do NOT set isLoggedIn here — you’re redirecting to login
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
    },
  },
})
