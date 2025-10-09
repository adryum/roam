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
        <a href="#">Walkers</a>
        <router-link to="/about">About Us</router-link>
      </nav>
      <button class="login-btn" @click="$router.push('/SignUp')">Register/Login</button>
    </div>
  </header>
</template>

<script setup lang="ts">
</script>

<style scoped>
.header {
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

.nav a,
.nav router-link {
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s ease;
}

.nav a:hover,
.nav router-link:hover {
  text-decoration: underline;
  font-size: 16px;
}

.login-btn {
  background: #d6b993;
  border-radius: 6px;
  padding: 6px 14px;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.2s ease;
}

.login-btn:hover {
  background: #c4a678;
}
</style>
