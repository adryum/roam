<template>
  <header class="header">
    <div class="logo">ROAM</div>
    <nav class="nav">
      <a href="#">Home</a>
      <a href="#">Walkers</a>
      <a href="#">About us</a>
    </nav>
    <button class="login-btn">Register/Login</button>
  </header>
</template>

<script setup>
</script>

<style scoped>
.nav {
    display: flex;
    align-items: center;
    gap: 20px;
}
a {
    color:white;
    text-decoration: none;
}
.header { width:100%; background:#b19665; color:#fff; padding:14px 28px; display:flex; align-items:center; justify-content:space-between; box-sizing:border-box; }
</style>