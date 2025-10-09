import WalkerView from '@/ui/views/WalkerView.vue'
import HomeView from '@/ui/views/HomeView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import ProfileView from '@/ui/views/ProfileView.vue'
import LoginForm from '@/ui/components/LoginForm.vue'
import AboutUs from '@/ui/views/AboutUs.vue'
import RegistrationView from '@/ui/views/RegistrationView.vue'
import SignUpForm from '@/ui/components/SignUpForm.vue'

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
      path: '/registration',
      name: 'Registration',
      component: RegistrationView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutUs 
    },
    {
      path: '/walker/:id',
      name: 'walker',
      component: WalkerView,
      props: true
    },

        {
      path: '/signUp',
      name: 'SignUp',
      component: SignUpForm
    }

  ],
})

export default router
