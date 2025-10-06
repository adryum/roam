import WalkerView from '@/ui/views/WalkerView.vue'
import HomeView from '@/ui/views/HomeView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/walker',
      name: 'Walker',
      component: WalkerView 
    }
  ],
})

export default router
