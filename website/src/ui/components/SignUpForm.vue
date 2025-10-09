<script setup lang="ts">
import { ref, useCssModule } from 'vue'
import { useRegistration } from '@/core/composables/useRegistration'
import router from '@/core/router'

const s = useCssModule()
const { signUp } = useRegistration()

const name = ref('')
const surname = ref('')
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

async function handleSignup() {
  errorMessage.value = ''
  isLoading.value = true
  try {
    const resp = await signUp(name.value, surname.value, email.value, password.value)
    if (resp) {
      router.push('/registration') 
    } else {
      errorMessage.value = 'Signup failed. Please try again.'
    }
  } catch (e) {
    errorMessage.value = 'Unexpected error during signup.'
  } finally {
    isLoading.value = false
  }
}

// new small helper to go back to login
function goToLogin() {
  router.push('/registration')
}
</script>

<template>
  <div :class="s.container">
    <h1 :class="s.title">Sign up!</h1>

    <input :class="s.input" placeholder="name" v-model="name" />
    <input :class="s.input" placeholder="surname" v-model="surname" />
    <input :class="s.input" placeholder="e-mail" v-model="email" type="email" />
    <input :class="s.input" placeholder="password" v-model="password" type="password" />

    <button :class="s.button" @click="handleSignup" :disabled="isLoading">
      {{ isLoading ? 'Creating...' : 'Create account' }}
    </button>

    <!-- New “Already have an account?” link -->
    <p class="switch-auth">
      Already have an account?
      <button class="link-btn" type="button" @click="goToLogin">Log in</button>
    </p>

    <p v-if="errorMessage" style="color:red">{{ errorMessage }}</p>
  </div>
</template>



<style module lang="scss">
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding: 2rem;
    background-color: #f7f5f2;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);


h1 {
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
}
}
.input {
    width: 100%;
    max-width: 360px;
    padding: 0.75rem 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
}
.button {
    padding: 0.75rem 1.25rem;
    border: none;
    border-radius: 8px;
    background: #333;
    color: #fff;
    cursor: pointer;
}
</style>