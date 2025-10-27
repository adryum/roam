<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import type { UserModel, ReviewModel } from '@/core/api/Models'

import Header from '@/ui/components/Header.vue'
import Footer from '@/ui/components/Footer.vue'
import WalkerInfo from '@/ui/components/WalkerInfo.vue'
import ReviewsList from '@/ui/components/ReviewsList.vue'
import Map from '@/ui/components/Map.vue'
import TeamCard from '@/ui/components/TeamCard.vue'

const route = useRoute()
const walkerId = ref<number | null>(route.params.id ? Number(route.params.id) : null)

const walkers = ref<(UserModel & { rating_avg?: number })[]>([])
const walker = ref<UserModel | null>(null)
const reviews = ref<ReviewModel[]>([])
const allReviews = ref<ReviewModel[]>([])
const loading = ref(true)
const error = ref<string | null>(null)


const filterName = ref('')
const debouncedName = ref('')
const filterLocation = ref('')
const debouncedLocation = ref('')
const filterRating = ref<number | null>(null)

let debounceTimerName: number | null = null
watch(filterName, (value) => {
  if (debounceTimerName) clearTimeout(debounceTimerName)
  debounceTimerName = window.setTimeout(() => {
    debouncedName.value = value
  }, 350)
})

let debounceTimerLocation: number | null = null
watch(filterLocation, (value) => {
  if (debounceTimerLocation) clearTimeout(debounceTimerLocation)
  debounceTimerLocation = window.setTimeout(() => {
    debouncedLocation.value = value
  }, 350)
})

// Reset filters
function resetFilters() {
  filterName.value = ''
  filterLocation.value = ''
  filterRating.value = null
}


// Filter + Sort walkers
const filteredWalkers = computed(() => {
  let items = walkers.value.filter(w => {
    const matchName =
      !debouncedName.value ||
      ((w.name + ' ' + (w.surname || '')).toLowerCase().includes(debouncedName.value.toLowerCase()))

    const matchLocation =
      !debouncedLocation.value ||
      (w.location && w.location.toLowerCase().includes(debouncedLocation.value.toLowerCase()))

    const matchRating =
      !filterRating.value ||
      (w.rating_avg && w.rating_avg >= filterRating.value)

    return matchName && matchLocation && matchRating
  })

  return items.sort((a, b) => {
    const rA = a.rating_avg ?? 0
    const rB = b.rating_avg ?? 0
    if (rB !== rA) return rB - rA
    return (a.name || '').localeCompare(b.name || '')
  })
})



// Fetch reviews for rating averages
async function fetchAllReviews() {
  const { data } = await axios.get('http://localhost:5000/reviews/')
  const result: ReviewModel[] = []

  for (const item of data) {
    if (item.reviews_json && Array.isArray(item.reviews_json)) {
      result.push(...item.reviews_json)
    }
  }

  allReviews.value = result
}

function computeRatings() {
  walkers.value.forEach(w => {
    const wr = allReviews.value.filter(r => r.receiver_id === w.id)
    if (wr.length > 0) {
      const avg = wr.reduce((sum, r) => sum + (r.stars || 0), 0) / wr.length
      w.rating_avg = Math.round(avg * 10) / 10
    }
  })
}

async function fetchWalkers() {
  loading.value = true

  const response = await axios.get<UserModel[]>('http://localhost:5000/users/')
  walkers.value = response.data
    .filter(u => u.role?.toLowerCase() === 'walker')
    .map(u => ({ ...u }))

  await fetchAllReviews()
  computeRatings()

  if (walkerId.value !== null) {
    walker.value = walkers.value.find(w => w.id === walkerId.value) || null
    if (walker.value) await fetchReviews()
    else error.value = 'Walker not found.'
  }

  loading.value = false
}

async function fetchReviews() {
  if (!walker.value) return

  const { data } = await axios.get('http://localhost:5000/reviews/')
  const result: ReviewModel[] = []

  for (const item of data) {
    if (item.reviews_json && Array.isArray(item.reviews_json)) {
      result.push(
        ...item.reviews_json.filter((r: ReviewModel) => r.receiver_id === walker.value!.id)
      )
    }
  }

  reviews.value = result
}

watch(
  () => route.params.id,
  (newId) => {
    walkerId.value = newId ? Number(newId) : null

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

        <!-- Single walker view -->
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
                <Map v-if="walker?.id" :walker-id="walker.id" />
              </div>
            </div>
          </section>
        </div>

        <!-- All walkers view -->
        <div v-else>
          <h1>All Walkers</h1>

      <!-- Filters UI -->
          <div class="filters">
            <div class="filter-group">
              <div class="filter-label">Search by name</div>
              <input type="text" v-model="filterName" placeholder="Name or surname" />
            </div>

            <div class="filter-group">
              <div class="filter-label">Search by location</div>
              <input type="text" v-model="filterLocation" placeholder="Location" />
            </div>

            <div class="filter-group">
              <select v-model="filterRating">
                <option :value="null">Min Rating</option>
                <option :value="3">3★ & up</option>
                <option :value="4">4★ & up</option>
                <option :value="5">5★ only</option>
              </select>
            </div>

            <button class="reset-btn" @click="resetFilters">Reset</button>
          </div>




          <div class="walkers-grid">
            <TeamCard
              v-for="(w, index) in filteredWalkers"
              :key="w.id"
              :id="w.id"
              :name="w.name + ' ' + (w.surname || '')"
              :experience="w.description || 'Professional Dog walker'"
              :image="w.profile_picture || '/assets/default-avatar.png'"
              :rating="w.rating_avg ?? null"
              :location="w.location ?? null"
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

/* FILTERS */


.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
  align-items: flex-end;
  justify-content: flex-start;
}

.filter-group {
  display: flex;
  flex-direction: column;
  width: 220px;
}

.filter-label {
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 4px;
  color: #374151;
}

.filters input,
.filters select {
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  width: 100%;
  box-sizing: border-box;
}



.reset-btn {
  padding: 10px 14px;
  border-radius: 6px;
  background: #eee;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid #ccc;
  transition: background .2s;
}
.reset-btn:hover {
  background: #ddd;
}
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