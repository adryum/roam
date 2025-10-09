<template>
  <header class="header">
    <div>
      <router-link to="/">
        <img class="logo" src="/assets/logo.png" />
      </router-link>
    </div>
    <div class="right-section">
      <nav class="nav">
        <router-link to="/">Home</router-link>
        <router-link to="/walker">Walkers</router-link>
        <router-link to="/about">About Us</router-link>
      </nav>

      <template v-if="isLoggedIn">
        <button class="login-btn" @click="$router.push('/profile')">Profile</button>
        <button class="logout-btn" @click="handleLogout">
          <img class="logout-icon" src="/assets/logout.png"></img>
        </button>
      </template>

      <template v-else>
        <button class="login-btn" @click="$router.push('/registration')">
          Register/Login
        </button>
      </template>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRegistrationStore } from '@/core/stores/registrationStore'
import router from '@/core/router'

const regStore = useRegistrationStore()
const isLoggedIn = computed(() => regStore.isLoggedIn)

function handleLogout() {
  regStore.logOut()
  router.push('/registration')
}
</script>

<style scoped>
.header {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  width: 100%;
  background: #b19665;
  padding: 20px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}

.logo {
  max-width: 20%;
}
.logout-icon{
  max-height: 20px;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 28px;
}

.nav {
  display: flex;
  align-items: center;
  gap: 28px;
}

.nav a {
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s ease;
}

.nav a:hover {
  text-decoration: underline;
  font-size: 16px;
}

.login-btn,
.logout-btn {
  margin:0;
  background: #d6b993;
  border-radius: 6px;
  padding: 6px 14px;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
  font-weight: bold;
  text-decoration: none;
  transition: background 0.2s ease;
}
.logout-btn{
  background: #b54d4d;
}

.login-btn:hover,
.logout-btn:hover {
  background: #c4a678;
}
</style>
