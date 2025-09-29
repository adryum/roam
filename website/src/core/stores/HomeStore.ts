import { defineStore } from "pinia"
import { RegistrationApi } from "../api/RegistrationApi"
import { HomeApi } from "../api/HomeApi"
import type { PetModel } from "../api/Models"

const homeApi = new HomeApi()

export const useHomeStore = defineStore('home',  {
    state: () => ({
        pets: [] as PetModel[]
    }),
    actions: {
        async getPets() {
            try {
                this.pets = await homeApi.getPets()
                console.log("got pets: ")
                console.table(this.pets)
            } catch (error) {
                console.log(error);
            }
        },
    }
})
