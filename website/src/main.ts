import { createApp } from 'vue'
import App from './App.vue'
import router from './core/router'
import '/public/assets/main.sass'

const app = createApp(App)

app.use(router)

app.mount('#app')
