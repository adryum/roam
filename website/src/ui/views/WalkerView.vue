<template>
  <div class="walker-page">
    <Header />

    <div class="content-container">
      <main class="content">
        <div v-if="loading">Loading walker data...</div>
        <div v-else-if="error">{{ error }}</div>
        <div v-else-if="walker">
          <WalkerInfo :walker="walker" :reviews="reviews" />
          <section class="reviews-section">
            <div class="reviews-header">
              <h2>Reviews</h2>
              <div class="reviews-meta">({{ reviews.length }} reviews)</div>
            </div>

            <div class="reviews-grid">
              <div class="reviews-list">
                <ReviewsList :reviews="reviews" />
              </div>

              <div class="map-wrapper" aria-label="Walker location map">
                <Map />
              </div>
            </div>
          </section>
        </div>
        <div v-else>No walker found.</div>
      </main>
    </div>

    <Footer />
  </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import type { UserModel, ReviewModel } from '@/core/api/Models'
import Header from '@/ui/components/Header.vue'
import Footer from '@/ui/components/Footer.vue'
import WalkerInfo from '@/ui/components/WalkerInfo.vue'
import ReviewsList from '@/ui/components/ReviewsList.vue'
import Map from '@/ui/components/Map.vue'


// Walker data
const walker = ref<UserModel | null>(null)
// Reviews data
const reviews = ref<ReviewModel[]>([])
// Loading/error state
const loading = ref(true)
const error = ref<string | null>(null)

async function fetchWalker() {
  loading.value = true
  try {
    const response = await axios.get('http://localhost:5000/users/')
    console.log('Walker API response:', response.data)

    // response.data is already an array of users
    const users: UserModel[] = response.data
    walker.value = users.find(u => u.role?.toLowerCase() === 'walker') || null

    if (walker.value) {
      await fetchReviews()
    } else {
      error.value = 'No walker found.'
    }
  } catch (err: any) {
    console.error('Error fetching walker:', err.response?.data || err.message)
    walker.value = null
    reviews.value = []
    error.value = 'Failed to load walker data.'
  } finally {
    loading.value = false
  }
}


async function fetchReviews() {
  try {
    const { data } = await axios.get('http://localhost:5000/reviews/')
    console.log('Reviews API response:', data)

    // Extract the reviews array from the API structure
    const allReviews: ReviewModel[] =
      Array.isArray(data) && data.length > 0 && Array.isArray(data[0].reviews_json)
        ? data[0].reviews_json
        : []

    // Filter for this walker
    if (walker.value) {
      reviews.value = allReviews.filter(
        r => r.receiver_id === walker.value!.id
      )
    } else {
      reviews.value = []
    }

    console.log('Filtered reviews for walker:', reviews.value)
  } catch (err) {
    console.error('Error fetching reviews:', err)
    reviews.value = []
  }
}




onMounted(fetchWalker)
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

.loading {
  text-align: center;
  margin-top: 40px;
  font-size: 1.2rem;
  color: #555;
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
