// src/core/api/RegistrationApi.ts
import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'

export interface LoginResponse { success: boolean; user?: any; message?: string }
export interface SignupResponse { success: boolean; message?: string }

export class RegistrationApi {
  private client: AxiosInstance

  constructor(baseUrl = 'http://localhost:5000/auth') { 
    this.client = axios.create({ baseURL: baseUrl, timeout: 8000 })
  }

  logIn(email: string, password: string): Promise<AxiosResponse<LoginResponse>> {
    return this.client.post<LoginResponse>('/login', { email, password })
  }

  signUp(name: string, email: string, password: string): Promise<AxiosResponse<SignupResponse>> {
    return this.client.post<SignupResponse>('/signup', { name, email, password })
  }
}
