import WalkerView from '@/ui/views/WalkerView.vue'
import HomeView from '@/ui/views/HomeView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import ProfileView from '@/ui/views/ProfileView.vue'
import LoginForm from '@/ui/components/LoginForm.vue'
import AboutUs from '@/ui/views/AboutUs.vue'

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
    },
    {
      path: '/profile',
      name: 'Profile',
      component: ProfileView
    },
        {
      path: '/login',
      name: 'Login',
      component: LoginForm
    },
    {
      path: '/about',
      name: 'about',
      component: AboutUs 
    }

  ],
})

export default router
