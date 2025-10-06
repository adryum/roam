<template>
  <footer class="footer">
    <div class="footer-left">
      <div class="logo">ROAM</div>
      <div class="socials">
        <a href="https://www.facebook.com/">
          <img src="/assets/facebook.svg"></img>
        </a>
        <a href="https://lv.linkedin.com/">
          <img src="/assets/linkedin.svg"></img>
        </a>
        <a href="https://www.instagram.com/">
        <img src="/assets/instagram.svg"></img>
        </a>
        <a href="https://www.youtube.com/">
        <img src="/assets/youtube.svg"></img>
        </a>
      </div>
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
      <img class="paws" src="/assets/paws_footer.png"></img>
    </div>
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
  padding: 40px 40px;
  box-sizing: border-box;
  margin-top: 28px;
}

.footer-left {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.paws{
  max-width:12%;
  max-height:5%;
}
.logo {
  font-weight: bold;
  font-size: 18px;
}
.socials {
  display: flex;
  flex-direction: row;
  gap: 12px;
  align-items: center;
}

.socials a {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
}

.socials img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}


.footer-center {
  margin-left: 30%;
  display: flex;
  gap: 140px; 
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