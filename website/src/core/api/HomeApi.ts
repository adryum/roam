import axios from "axios";
import type { PetModel } from "./Models";

export class HomeApi {
    async getPets(): Promise<PetModel[] | []> {
        try {
            const { data } = await axios.get<PetModel[]>('/apiary/create')
            return data
        } catch (error) {
            console.error(error)
            return []
        }
    }
}