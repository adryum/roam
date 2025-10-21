import { defineStore } from "pinia"
import { RegistrationApi } from "../api/RegistrationApi"
import { HomeApi } from "../api/HomeApi"
import type { PetModel } from "../api/Models"
import type { UserModel } from "../api/Models"

const homeApi = new HomeApi()

export const useHomeStore = defineStore('home',  {
    state: () => ({
        pets: [] as PetModel[],
        users: [] as UserModel[],
        selectedWalker: null as UserModel | null

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
        async getUsers() {
            try {
                this.users = await homeApi.getUsers()
            } catch (error) {
                
            }
        },
        getWalker() : UserModel{
            return this.users.find(user => user.role === "WALKER") ??
            {
                id: 0,
                name: "Default",
                surname: "Default",
                location: "Default",
                description: "Default",
                profile_picture: "",
                role: "WALKER"
            } as UserModel
        }
    }
})
