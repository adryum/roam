import axios from "axios";
import type { PetModel } from "./Models";
import type { UserModel } from "./Models";

export class HomeApi {
    async getPets(): Promise<PetModel[]> {
        try {
            const { data } = await axios.get<PetModel[]>('/pets/')
            return data
        } catch (error) {
            console.error(error)
            return []
        }
    }
    async getUsers(): Promise<UserModel[]> {
        try {
            const { data } = await axios.get<UserModel[]>('/users/')
            return data
        } catch (error) {
            console.error(error)
            return []
        }
    }
}