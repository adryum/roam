<template>
  <footer class="footer">
    <div class="footer-left">
      <div class="logo">ROAM</div>
      <div class="socials">Fb • In • Ig</div>
    </div>
    <div class="footer-links">
      <a href="#">Home</a>
      <a href="#">Walkers</a>
      <a href="#">About us</a>
    </div>
    <div class="footer-contact">
      <div>our.email@gmail.com</div>
      <div>+371 20 297 779</div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped lang="css">
.footer { 
    width:100%; 
    background:#b19665; 
    color:white; 
    display:flex; 
    justify-content:space-between; 
    gap:18px; 
    padding:20px 28px; 
    box-sizing:border-box; 
    margin-top:28px; 
}
.footer-links {
    display: flex;
    align-items: center;
    gap: 20px;
}
a {
  color:white;
  text-decoration: none;
}
</style>