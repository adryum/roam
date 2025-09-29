import { createApp } from 'vue'
import App from './App.vue'
import router from './core/router'
import { createPinia } from 'pinia'
import '/public/assets/main.sass'
import axios from 'axios'

const app = createApp(App)
const pinia = createPinia()

axios.defaults.baseURL = import.meta.env.VITE_API

app.use(pinia)

app.use(router)

app.mount('#app')
