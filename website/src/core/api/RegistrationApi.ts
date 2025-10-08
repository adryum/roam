import axios from "axios"
import type { RegistrationUserModel } from "./Models";

export class RegistrationApi {
    async logIn(email: string, password: string): Promise<RegistrationUserModel | null> {
        try {
            const form = new FormData()
            form.append('email', email)
            form.append('password', password)
            console.log(email, password);
            
            const { data } = await axios.post<RegistrationUserModel>('/registration/login', form)
            console.log(data);
            
            return data
        } catch (error) {
            console.error(error)
            return null
        }
    }
}