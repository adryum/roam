<template>
  <div class="walker-page">
    <Header />
    <div class="content-container">
      <main class="content">
        <WalkerInfo :walker="walker" />

        <section class="reviews-section">
          <div class="reviews-header">
            <h2>Reviews</h2>
            <div class="reviews-meta">({{ walker.reviews.length }} reviews)</div>
          </div>

          <div class="reviews-grid">
            <div class="reviews-list">
              <ReviewsList :reviews="walker.reviews" />
            </div>

            <div class="map-wrapper" aria-label="Walker location map">
              <!-- Keep your Map component — the wrapper enforces size -->
              <Map />
            </div>
          </div>
        </section>
      </main>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import WalkerInfo from '@/ui/components/WalkerInfo.vue'
import ReviewsList from '@/ui/components/ReviewsList.vue'
import Map from '@/ui/components/Map.vue'
import Header from '@/ui/components/Header.vue'
import Footer from '@/ui/components/Footer.vue'
import { ref } from 'vue'

const walker = ref({
  name: 'Ēriks Fūrmanis',
  photoUrl: '/assets/eriks.png',
  details: [
    '5 gadu pieredze',
    'Pieredzējis ar dažādu šķirņu suņiem',
    'Elastīgs grafiks',
    'Apdrošināts un sertificēts',
    'Māca pamata pavadas disciplīnu'
  ],
  reviews: [
    { user: 'Jonh Smith', rating: 5, title: '10/10 amazing', content: 'Loved the service.' },
    { user: 'Jordan', rating: 4.5, title: 'Reliable', content: 'Very dependable and friendly.' },
    { user: 'Priya', rating: 4, title: 'Good service', content: 'Great with pup.' },
    { user: 'Luca', rating: 5, title: 'Fantastic', content: 'Perfect — photos after every walk.' },
    { user: 'Maya', rating: 4, title: 'Nice', content: 'Professional and kind.' }
  ]
})
</script>

<style scoped>
.walker-page {
  margin: 0 auto;
  font-family: Inter, Arial, sans-serif;
  background: #f6f2ea;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

/* content area: center but left-align content */
.content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 28px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  text-align: left;
}

/* Reviews section header */
.reviews-section { margin-top: 20px; }
.reviews-header { display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:12px; }
.reviews-header h2 { margin:0; font-size:1.5rem; }

/* Two-column layout */
.reviews-grid {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

/* Reviews column: flexible */
.reviews-list {
  flex: 1 1 0;
  min-width: 0; /* allow children to shrink properly */
  display: flex;
  flex-direction: column;
}

/* Map column: fixed width (adjust as needed) */
.map-wrapper {
  width: 420px;
  max-width: 42%;
  min-width: 300px;
  max-height: 420px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(20,30,50,0.06);
  background: #fff;
}


/* Responsive: stack on narrow screens */
@media (max-width: 900px) {
  .content { padding: 18px; }
  .reviews-grid { flex-direction: column; }
  .map-wrapper {
    width: 100%;
    height: 320px;
    min-width: auto;
    max-width: 100%;
  }
}
</style>
