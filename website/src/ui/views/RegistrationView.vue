<script setup lang="ts">
import { ref, useCssModule, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Header from "../components/Header.vue"
import Footer from "../components/Footer.vue"
import { useRegistrationStore } from '@/core/stores/registrationStore'
import router from '@/core/router'

const s = useCssModule()
const route = useRoute()
const regStore = useRegistrationStore()

// Toggle between 'signup' and 'login'
const activeForm = ref<'signup' | 'login'>('signup')

// Form state
const name = ref('')
const surname = ref('')
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

// Email + password validation
function validateEmail(email: string) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}
function validatePassword(password: string) {
  return password.length >= 8
}

// Backend URL
const backendUrl = 'http://localhost:5000/registration'

async function handleSignup() {
  errorMessage.value = ''
  if (!validateEmail(email.value)) {
    errorMessage.value = 'Please enter a valid email address.'
    return
  }
  if (!validatePassword(password.value)) {
    errorMessage.value = 'Password must be at least 8 characters long.'
    return
  }

  isLoading.value = true
  try {
    // Signup request
    const resp = await fetch(`${backendUrl}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.value,
        surname: surname.value,
        email: email.value,
        password: password.value
      })
    })

    if (!resp.ok) {
      const text = await resp.text()
      errorMessage.value = text || 'Signup failed. Please try again.'
      return
    }

    const user = await resp.json()

    // Auto login after signup
    const loginResp = await fetch(`${backendUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    })

    if (!loginResp.ok) {
      const text = await loginResp.text()
      errorMessage.value = text || 'Login after signup failed.'
      return
    }

    const loggedInUser = await loginResp.json()
    regStore.isLoggedIn = true
    regStore.user = loggedInUser

    localStorage.setItem('user', JSON.stringify(loggedInUser))
    window.location.reload()

    router.push('/profile')
  } catch (err) {
    console.error(err)
    errorMessage.value = 'Unexpected error during signup.'
  } finally {
    isLoading.value = false
  }
}

async function handleLogin() {
  errorMessage.value = ''
  if (!validateEmail(email.value)) {
    errorMessage.value = 'Please enter a valid email address.'
    return
  }

  isLoading.value = true
  try {
    const resp = await fetch(`${backendUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    })

    if (!resp.ok) {
      const text = await resp.text()
      errorMessage.value = text || 'Invalid email or password.'
      return
    }

    const user = await resp.json()
    regStore.isLoggedIn = true
    regStore.user = user

    localStorage.setItem('user', JSON.stringify(user))
    window.location.reload()

    router.push('/profile')
  } catch (err) {
    console.error(err)
    errorMessage.value = 'Unexpected error during login.'
  } finally {
    isLoading.value = false
  }
}

// Watch login status and redirect home if logged in
watch(() => regStore.isLoggedIn, (val) => {
  if (val) router.push('/')
})

function switchToLogin() {
  activeForm.value = 'login'
  router.replace({ path: '/registration', query: { mode: 'login' } })
}

function switchToSignup() {
  activeForm.value = 'signup'
  router.replace({ path: '/registration', query: { mode: 'signup' } })
}

// Logout function
function handleLogout() {
  regStore.isLoggedIn = false
  regStore.user = null
  localStorage.removeItem('user')
  router.push('/registration')
}

onMounted(() => {
  // Restore login from localStorage
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    regStore.user = JSON.parse(storedUser)
    regStore.isLoggedIn = true
    router.push('/profile')
  }

  if (route.query.mode === 'login') activeForm.value = 'login'
})
</script>

<template>
  <div :class="s.container">
    <Header />

    <div :class="s.content">
      <!-- Signup Form -->
      <div v-if="activeForm === 'signup'" :class="s.formBox">
        <h1>Sign up!</h1>
        <input placeholder="Name" v-model="name" />
        <input placeholder="Surname" v-model="surname" />
        <input placeholder="E-mail" type="email" v-model="email" />
        <input placeholder="Password" type="password" v-model="password" />
        <button @click="handleSignup" :disabled="isLoading">
          {{ isLoading ? 'Creating...' : 'Create account' }}
        </button>
        <p>
          Already have an account?
          <button class="link-btn" @click="switchToLogin">Log in</button>
        </p>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </div>

      <!-- Login Form -->
      <div v-if="activeForm === 'login'" :class="s.formBox">
        <h1>Login!</h1>
        <input placeholder="E-mail" type="email" v-model="email" />
        <input placeholder="Password" type="password" v-model="password" />
        <button @click="handleLogin" :disabled="isLoading">
          {{ isLoading ? 'Logging in...' : 'Log in' }}
        </button>
        <p>
          Don’t have an account?
          <button class="link-btn" @click="switchToSignup">Sign up</button>
        </p>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </div>
    </div>

    <Footer />
  </div>
</template>

<style module lang="scss">
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.formBox {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  background: #f7f5f2;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 360px;

  h1 {
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
    text-align: center;
  }

  input {
    padding: 0.75rem 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
  }

  button {
    padding: 0.75rem 1.25rem;
    border: none;
    border-radius: 8px;
    background: #333;
    color: #fff;
    cursor: pointer;
  }

  .link-btn {
    background: none;
    border: none;
    color: #007bff;
    cursor: pointer;
    padding: 0;
    font: inherit;
  }

  .error {
    color: red;
    font-size: 0.9rem;
    text-align: center;
  }
}
</style>
