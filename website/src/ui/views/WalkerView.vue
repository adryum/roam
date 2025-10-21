<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import type { UserModel, ReviewModel } from '@/core/api/Models'

import Header from '@/ui/components/Header.vue'
import Footer from '@/ui/components/Footer.vue'
import WalkerInfo from '@/ui/components/WalkerInfo.vue'
import ReviewsList from '@/ui/components/ReviewsList.vue'
import Map from '@/ui/components/Map.vue'
import TeamCard from '@/ui/components/TeamCard.vue'


// Reactive state
const route = useRoute()
const walkerId = ref<number | null>(route.params.id ? Number(route.params.id) : null)

const walkers = ref<UserModel[]>([])
const walker = ref<UserModel | null>(null)
const reviews = ref<ReviewModel[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

async function fetchWalkers() {
  loading.value = true
  try {
    const response = await axios.get<UserModel[]>('http://localhost:5000/users/')
    walkers.value = response.data.filter(u => u.role?.toLowerCase() === 'walker')

    if (walkerId.value !== null) {
      // Specific walker mode
      walker.value = walkers.value.find(w => w.id === walkerId.value) || null
      if (walker.value) await fetchReviews()
      else error.value = 'Walker not found.'
    }
    // else: do nothing, all walkers view will render
  } catch (err: any) {
    console.error(err)
    error.value = 'Failed to load walker data.'
  } finally {
    loading.value = false
  }
}

async function fetchReviews() {
  if (!walker.value) {
    reviews.value = []
    return
  }

  try {
    const { data } = await axios.get('http://localhost:5000/reviews/')

    // data is an array, each item has a reviews_json array
    const allReviews: ReviewModel[] = []

    for (const item of data) {
      if (item.reviews_json && Array.isArray(item.reviews_json)) {
        // Extract only reviews for the current walker
        const filtered = item.reviews_json.filter(
          (r: ReviewModel) => r.receiver_id === walker.value!.id
        )
        allReviews.push(...filtered)
      }
    }

    reviews.value = allReviews

    if (reviews.value.length === 0) {
      console.log(`Walker ${walker.value.id} has no reviews`)
    } else {
      console.table(reviews.value)
    }
  } catch (err) {
    console.error('fetchReviews error:', err)
    reviews.value = []
  }
}





watch(
  () => route.params.id,
  (newId) => {
    walkerId.value = newId ? Number(newId) : null

    // Reset state if switching to "all walkers"
    if (walkerId.value === null) {
      walker.value = null
      reviews.value = []
      error.value = null
    }

    fetchWalkers()
  }
)


onMounted(fetchWalkers)
</script>

<template>
  <div class="walker-page">
    <Header />

    <main class="content-container">
      <div class="content">
        <div v-if="loading">Loading walker data...</div>
        <div v-else-if="error">{{ error }}</div>

        <div v-else-if="walker">
          <WalkerInfo :walker="walker" :reviews="reviews" />

          <section class="reviews-section">
            <div class="reviews-header">
              <h2>Reviews</h2>
              <div class="reviews-meta">
                ({{ reviews.length }} review{{ reviews.length === 1 ? '' : 's' }})
              </div>
            </div>

            <div class="reviews-grid">
              <div class="reviews-list">
                <ReviewsList :toUserId="walker.id" :reviews="reviews" />
              </div>

              <div class="map-wrapper" aria-label="Walker location map">
                <Map  v-if="walker?.id" :walker-id="walker.id" />
              </div>
            </div>
          </section>
        </div>

        <!-- All walkers view -->
        <div v-else>
          <h1>All Walkers</h1>
          <div class="walkers-grid">
            <TeamCard
              v-for="(w, index) in walkers"
              :key="w.id"
              :id="w.id"
              :name="w.name + ' ' + (w.surname || '')"
              :experience="w.description || 'Professional Dog walker'"
              :image="w.profile_picture || '/assets/default-avatar.png'"
              :reverse="index % 2 === 1"
            />
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.walker-page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content-container {
  flex: 1; 
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.loading {
  text-align: center;
  margin-top: 40px;
  font-size: 1.2rem;
  color: #555;
}
.walkers-grid {
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr;

}

.content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 28px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: left;
}

.reviews-section {
  margin-top: 20px;
}

.reviews-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.reviews-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.reviews-grid {
  position: relative;
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.reviews-list {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.map-wrapper {
  width: 420px;
  max-width: 42%;
  min-width: 300px;
  max-height: 420px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(20, 30, 50, 0.06);
  background: #fff;
  position: sticky;
  top: 20px;
  align-self: flex-start;
}


@media (max-width: 900px) {
  .content {
    padding: 18px;
  }

  .reviews-grid {
    flex-direction: column;
  }

  .map-wrapper {
    width: 100%;
    height: 320px;
    min-width: auto;
    max-width: 100%;
  }
  
}
</style>
