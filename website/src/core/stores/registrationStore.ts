import { defineStore } from "pinia"
import { RegistrationApi } from "../api/RegistrationApi"

const registrationApi = new RegistrationApi()

export const useRegistrationStore = defineStore('registration',  {
    state: () => ({
        isLoggedIn: false
    }),
    actions: {
        async logIn(email: string, password: string) {
            try {
                await registrationApi.logIn(email, password)
                console.log("You logged in! With: ", email, password)
                this.isLoggedIn = true
            } catch (error) {
                console.log(error);
            }
        },
        signUp(username: string, email: string, password: string) {
            
        }
    }
})
