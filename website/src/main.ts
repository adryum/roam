import { createApp } from 'vue'
import App from './App.vue'
import router from './core/router'
import { createPinia } from 'pinia'
import '/public/assets/main.sass'
import axios from 'axios'
import { useRegistrationStore } from '@/core/stores/registrationStore'

axios.defaults.baseURL = import.meta.env.VITE_API

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const regStore = useRegistrationStore()
regStore.restoreSession()

app.mount('#app')
