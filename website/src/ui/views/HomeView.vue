<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import TeamCard from '../components/TeamCard.vue'
import Header from '@/ui/components/Header.vue'
import Footer from '@/ui/components/Footer.vue'
import type { UserModel, ReviewModel } from '@/core/api/Models'

const topWalkers = ref<UserModel[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

async function fetchTopWalkers() {
  loading.value = true
  try {
    const usersResponse = await axios.get<UserModel[]>('http://localhost:5000/users/')
    const reviewsResponse = await axios.get<ReviewModel[]>('http://localhost:5000/reviews/')

    const walkers = usersResponse.data.filter(u => u.role?.toLowerCase() === 'walker')

    const reviewsByWalker: Record<number, ReviewModel[]> = {}
    reviewsResponse.data.forEach(r => {
      if (!reviewsByWalker[r.receiver_id]) reviewsByWalker[r.receiver_id] = []
      reviewsByWalker[r.receiver_id].push(r)
    })

    const walkersWithAvgStars = walkers.map(w => {
      const walkerReviews = reviewsByWalker[w.id] || []
      const avgStars =
        walkerReviews.length > 0
          ? walkerReviews.reduce((sum, r) => sum + r.stars, 0) / walkerReviews.length
          : 0
      return { ...w, avgStars }
    })

    topWalkers.value = walkersWithAvgStars
      .sort((a, b) => b.avgStars - a.avgStars)
      .slice(0, 2)
  } catch (err: any) {
    console.error(err)
    error.value = 'Failed to load walkers.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchTopWalkers)
</script>

<template>
  <div class="home-view">
    <Header />

    <section class="hero-section">
      <img src="/assets/background.png" alt="Dog walking in autumn" class="hero-image" />
      <div class="hero-overlay">
        <h1 class="hero-title">Welcome!</h1>
        <p class="hero-subtitle">Schedule with our best dog walkers</p>
        <a href="#team-section" class="hero-button">Book a walk</a>
      </div>
    </section>

    <section class="team-section" id="team-section">
      <h1 class="top-walkers">Top Walkers</h1>
      <div v-if="loading">Loading top walkers...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else class="team-grid">
        <TeamCard
          v-for="(walker, index) in topWalkers"
          :key="walker.id"
          :id="walker.id"
          :name="walker.name + ' ' + (walker.surname || '')"
          :experience="walker.description || 'Professional Dog walker'"
          :image="walker.profile_picture || '/assets/default-avatar.png'"
          :reverse="index % 2 === 1"
        />

      </div>
    </section>

    <Footer />
  </div>
</template>


<style lang="scss" scoped>
.home-view {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
.top-walkers{
  text-align: center;
}

.hero-section {
  position: relative;
  height: 60vh;
  overflow: hidden;

  .hero-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .hero-overlay {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 1rem;
    color: white;

    .hero-title {
      font-size: 2.25rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      letter-spacing: -0.025em;

      @media (min-width: 768px) {
        font-size: 3rem;
      }
    }

    .hero-subtitle {
      font-size: 1.125rem;
      margin-bottom: 1.5rem;
      opacity: 0.9;

      @media (min-width: 768px) {
        font-size: 1.25rem;
      }
    }

    .hero-button {
      background-color: #473212;
      color: white;
      padding: 0.5rem 1.5rem;
      border-radius: 0.375rem;
      font-weight: 500;
      font-size: 0.875rem;
      letter-spacing: 0.05em;
      border: none;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background-color: #374151;
      }
    }
  }
}

.team-section {
  padding: 4rem 1rem;
  background-color: white;

  @media (min-width: 768px) {
    padding: 4rem 2rem;
  }

  @media (min-width: 1024px) {
    padding: 4rem 4rem;
  }

  .team-grid {
    display: grid;
    gap: 4rem;

    @media (min-width: 768px) {
      grid-template-columns: 1fr 1fr;
    }
  }
}
</style>