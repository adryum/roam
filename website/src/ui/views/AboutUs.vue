<template>
  <div class="about-page">
    <!-- HEADER -->
    <Header />

    <!-- ABOUT SECTION -->
    <section class="intro">
      <h2>Par mums</h2>
      <div class="text">
        <p>
          “Roam” ir moderna un lietotājam draudzīga tiešsaistes platforma, kas radīta,
          lai palīdzētu suņu īpašniekiem viegli organizēt sava mīluļa pastaigas.
          Platforma apvieno cilvēkus, kuriem nav pietiekami daudz laika ikdienas pastaigām,
          ar uzticamiem un pārbaudītiem pastaigu vadītājiem.
        </p>
      </div>
      <div class="image">
        <img src="/assets/dog.jpeg" alt="Dog walking" />
      </div>
    </section>
    <h2>Mūsu suņu staigātāji</h2>

    <!-- WALKERS SECTION -->
    <section class="walkers">
      <div v-if="loading">Loading walkers...</div>
      <div v-else class="walkers-grid">
        <div class="walker" v-for="walker in walkers" :key="walker.id">
          <img :src="walker.profile_picture || '/assets/default-avatar.png'" :alt="walker.name" />
          <p>{{ walker.name }}</p>
        </div>
      </div>
    </section>

    <!-- STEPS SECTION -->
    <section class="steps">
      <ol>
        <li>
          <strong>Pastaigu rezervēšana:</strong><br />
          Izvēlies vēlamo datumu, laiku un pastaigas ilgumu (piemēram, 30 min, 1 stunda vai 90 min).
        </li>
        <li>
          <strong>Pastaigu vadītāja izvēle:</strong><br />
          Sistēma piedāvā pieejamos vadītājus, norādot viņu vērtējumus, pieredzi un atsauksmes no citiem klientiem.
          Lietotājs var izvēlēties sev piemērotāko cilvēku.
        </li>
        <li>
          <strong>Atsauksmes un vērtējums:</strong><br />
          Pēc pastaigas lietotājs var atstāt komentāru un novērtējumu vadītājam, lai palīdzētu citiem pieņemt lēmumu nākotnē.
        </li>
      </ol>
    </section>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Header from '@/ui/components/Header.vue'
import Footer from '@/ui/components/Footer.vue'
import axios from 'axios'
import type { UserModel, ReviewModel } from '@/core/api/Models'

const walkers = ref<UserModel[]>([])
const loading = ref(true)

async function fetchWalkers() {
  try {
    const response = await axios.get<UserModel[]>('http://localhost:5000/users/')
    walkers.value = response.data.filter(u => u.role?.toLowerCase() === 'walker')
  } catch (error) {
    console.error('Failed to fetch walkers:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchWalkers)
</script>


<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Arial", sans-serif;
}
h2{
  text-align: center;
}
.about-page {
  background-color: #f9f6f2;
  color: #222;
}

.intro {
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
  gap: 40px; 
  padding: 40px 60px; 
}

.text {
  flex: 1; 
  font-size: 18px;
  line-height: 1.6;
  color: #333;
}

.image {
  flex: 1; 
  display: flex;
  justify-content: center;
}

.image img {
  width: 100%;
  max-width: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}


/* INTRO */
.intro {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40px 60px;
  flex-wrap: wrap;
}

.intro .text {
  flex: 1;
  margin-right: 40px;
  line-height: 1.6;
  min-width: 300px;
}

.intro .image img {
  width: 350px;
  border-radius: 10px;
}

/* WALKERS */
.walkers-grid {
  padding: 50px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin: 40px 0;
}

.walker {
  text-align: center;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  background-color: #fff;
  transition: transform 0.2s ease;
}

.walker:hover {
  transform: translateY(-5px);
}

.walker img {
  width: 100%;
  height: 230px;
  object-fit: cover;
}

.walker p {
  margin-top: 10px;
  font-weight: 600;
  color: #333;
}
/* STEPS */
.steps {
  max-width: 900px;
  margin: 0 auto 60px;
  line-height: 1.6;
}

.steps ol {
  padding-left: 20px;
}

.steps li {
  margin-bottom: 15px;
}

/* FOOTER */
.footer {
  background-color: #b4976e;
  color: white;
  padding: 30px 40px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
}

.footer-left h3 {
  margin-bottom: 10px;
}

.socials a {
  margin-right: 10px;
  color: white;
  font-size: 20px;
  text-decoration: none;
}

.footer-paws {
  text-align: right;
  font-size: 24px;
  margin-top: 10px;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .intro {
    flex-direction: column;
    text-align: center;
  }

  .intro .text {
    margin-right: 0;
    margin-bottom: 20px;
  }

  .intro .image img {
    width: 100%;
    max-width: 400px;
  }

  .walkers {
    flex-direction: column;
    align-items: center;
  }
}
</style>
