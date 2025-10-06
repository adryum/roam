<template>
  <footer class="footer">
    <div class="footer-left">
      <div class="logo">ROAM</div>
      <div class="socials">Fb • In • Ig</div>
    </div>
    <div class="footer-center">
      <div class="footer-links">
        <a href="#">Home</a>
        <a href="#">Walkers</a>
        <a href="#">About us</a>
      </div>
      <div class="footer-contact">
        <div>Contact us:</div>
        <div>our.email@gmail.com</div>
        <div>+371 20 297 779</div>
      </div>
    </div>
    <div></div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
  width: 100%;
  background: #b19665;
  color: white;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: flex-start;
  padding: 20px 40px;
  box-sizing: border-box;
  margin-top: 28px;
}

.footer-left {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.logo {
  font-weight: bold;
  font-size: 18px;
}

.socials {
  display: flex;
  gap: 12px;
}

.footer-center {
  display: flex;
  gap: 80px; 
  justify-content: center;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-links a {
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s ease;
}

.footer-links a:hover {
  text-decoration: underline;
  font-size: 16px;
}

.footer-contact {
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: left;
  font-weight: 700;
}
</style>