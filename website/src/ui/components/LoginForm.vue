<script setup lang="ts">
import { useRegistration } from '@/core/composables/useRegistration';
import { ref } from 'vue';

const { isLoggedIn, logIn, signUp } = useRegistration()

const email = ref<string>('')
const password = ref<string>('')
const username = ref<string>('')

function autherize() {
    logIn(email.value, password.value)
}
</script>

<template>
  <h1>Are you logged in?: {{ isLoggedIn }}</h1>
  <h1>You did it!</h1>
  <h1>Log in bro!</h1>
  <input v-model="email" placeholder="email..."/>
  <input v-model="password" placeholder="password..."/>
  <button @click="autherize">Log in</button>
</template>

<style scoped>

</style>
