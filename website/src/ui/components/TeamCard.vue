<template>
  <div class="team-card" :class="{ 'team-card--reverse': reverse }">
    <div class="team-image-container">
      <img :src="image" :alt="name" class="team-image" />
    </div>

    <div class="team-text">
      <h2 class="team-name">{{ name }}</h2>
      <p class="team-experience">{{ experience }}</p>

      <!-- Location display -->
      <p v-if="location" class="team-location">{{ location }}</p>

      <!-- Rating stars -->
      <div class="rating-stars">
        <template v-if="hasRating">
          <img
            v-for="i in fullStars"
            :key="'full-' + i"
            src="/assets/star.png"
            alt="star"
            class="star-icon"
          />
          <img
            v-for="i in emptyStars"
            :key="'empty-' + i"
            src="/assets/star_gray.png"
            alt="star-gray"
            class="star-icon"
          />
          <span class="rating-text">{{ rating!.toFixed(1) }}</span>
        </template>
        <template v-else>
          <span class="rating-text">No rating</span>
        </template>
      </div>

      <router-link :to="`/walker/${id}`" class="team-button">
        Profile
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  id: string | number
  name: string
  experience: string
  image: string
  reverse?: boolean
  rating?: number | null
  location?: string | null
}

const props = defineProps<Props>()

// Computed properties for star display
const hasRating = computed(() => props.rating !== null && props.rating !== undefined)
const fullStars = computed(() => hasRating.value ? Math.floor(props.rating!) : 0)
const emptyStars = computed(() => hasRating.value ? 5 - Math.floor(props.rating!) : 5)
const location = computed(() => props.location)
</script>

<style lang="scss" scoped>
.team-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 2rem;
  }

  &--reverse {
    @media (min-width: 768px) {
      flex-direction: row-reverse;
    }
  }

  .team-image-container {
    width: 100%;
    @media (min-width: 768px) {
      width: 50%;
    }
  }

  .team-image {
    width: 100%;
    height: 350px;
    object-fit: cover;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
    border: 1px solid #f3f4f6;
  }

  .team-text {
    width: 100%;
    text-align: center;

    @media (min-width: 768px) {
      width: 50%;
      text-align: left;
    }

    .team-name {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
      line-height: 1.25;
      color: #111827;
    }

    .team-experience {
      color: #4b5563;
      font-size: 0.875rem;
      margin-bottom: 0.25rem;
    }

    .team-location {
      color: #6b7280;
      font-size: 0.8rem;
      margin-bottom: 0.5rem;
    }

    .rating-stars {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-bottom: 1rem;

      .star-icon {
        width: 18px;
        height: 18px;
      }

      .rating-text {
        margin-left: 6px;
        font-size: 0.875rem;
        color: #111827;
      }
    }

    .team-button {
      background-color: #111827;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      font-size: 0.75rem;
      font-weight: 500;
      letter-spacing: 0.075em;
      border: none;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background-color: #1f2937;
      }
    }
  }
}
</style>
