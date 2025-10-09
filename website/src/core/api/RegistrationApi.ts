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

    async signUp(name: string, surname: string, email: string, password: string): Promise<RegistrationUserModel | null> {
        try {
            const form = new FormData()
            form.append('name', name)
            form.append('surname', surname)
            form.append('email', email)
            form.append('password', password)
            
            const { data } = await axios.post<RegistrationUserModel>('/registration/signUp', form)
            return data
        } catch (error) {
            console.error(error)
            return null
        }
    }
    
    
}