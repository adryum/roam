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

        <!-- Admin button only visible to logged-in users with role 'ADMIN' -->
        <button
          v-if="isAdmin"
          class="admin-btn"
          @click="$router.push('/admin')"
          aria-label="Go to admin panel"
        >
          Admin
        </button>
      </nav>

      <template v-if="isLoggedIn">
        <button class="login-btn" @click="$router.push('/profile')">Profile</button>
        <button class="logout-btn" @click="handleLogout">
          <img class="logout-icon" src="/assets/logout.png" />
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

// true when any user is logged in
const isLoggedIn = computed(() => !!regStore.isLoggedIn)

// true only when a logged-in user's role equals 'ADMIN'
const isAdmin = computed(() => {


  return !!regStore.isLoggedIn && regStore.user?.role === 'ADMIN'
})

function handleLogout() {
  regStore.logout()
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

.logout-icon {
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
  gap: 16px;
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

/* Buttons */
.login-btn,
.logout-btn,
.admin-btn {
  margin: 0;
  background: #d6b993;
  border-radius: 6px;
  padding: 6px 14px;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
  font-weight: bold;
  text-decoration: none;
  transition: background 0.2s ease;
  border: none;
}

/* Admin button distinct color */
.admin-btn {
  background: #b19665;
}

/* Logout button distinct color */
.logout-btn {
  background: #b54d4d;
}

.login-btn:hover,
.logout-btn:hover,
.admin-btn:hover {
  background: #c4a678;
}
</style>
