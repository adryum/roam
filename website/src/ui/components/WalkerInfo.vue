<template>
  <div class="walker-info">
    <div class="walker-container">
      <h1>{{ walker.name }} {{ walker.surname }}</h1>

      <div class="rating-row">
        <p><b>Professional Dog walker</b></p>
        <StarRating :value="averageRating" />
        <div class="price">10-16$/h</div>
      </div>

      <p class="short-desc">{{ walker.description }}</p>

      <ul class="desc-list" v-if="walker.description_dots?.length">
        <li v-for="(d, i) in walker.description_dots" :key="i">{{ d.point }}</li>
      </ul>

      <CalendarCard
        :date="selectedDate"
        :time="selectedTime"
        :time-slots="timeSlots"
        @update:date="selectedDate = $event"
        @update:time="selectedTime = $event"
        @submit="submitSchedule"
      />

      <p v-if="scheduledMessage" class="scheduled-msg">{{ scheduledMessage }}</p>
    </div>

    <div class="walker-photo-wrap">
      <img class="walker-photo" :src="walker.profile_picture || ''" :alt="walker.name" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { UserModel, ReviewModel } from '@/core/api/Models'
import StarRating from './StarRating.vue'
import CalendarCard from './CalendarCard.vue'

// Extend UserModel with optional fields for frontend display
interface ExtendedUserModel extends UserModel {
  description_dots?: { point: string }[]
  photoUrl?: string
}

const props = defineProps<{
  walker: ExtendedUserModel
  reviews?: ReviewModel[]
}>()

// Reactive calendar state
const selectedDate = ref('')
const selectedTime = ref('')
const scheduledMessage = ref('')

// Generate half-hour time slots
const timeSlots = Array.from({ length: 22 }, (_, i) => {
  const h = Math.floor(i / 2) + 8
  const m = i % 2 === 0 ? '00' : '30'
  return `${String(h).padStart(2, '0')}:${m}`
})

// Compute average rating from reviews
const averageRating = computed(() => {
  const revs = props.reviews || []
  if (!revs.length) return 0
  const total = revs.reduce((sum, r) => sum + (r.stars || 0), 0)
  return Math.round((total / revs.length) * 10) / 10
})

// Submit booking schedule
function submitSchedule({ date, time }: { date: string; time: string } = {} as any) {
  if (!date || !time) return
  scheduledMessage.value = `Booked with ${props.walker.name} on ${date} at ${time}.`
}
</script>

<style scoped>
.walker-info {
  display: flex;
  flex-wrap: wrap;
  gap: 36px;
  justify-content: center;
  max-width: 980px;
  width: 100%;
  margin-bottom: 20px;
}
.walker-container {
  display: flex;
  flex-direction: column;
  text-align: left;
  min-width: 480px;
  max-width: 520px;
}
.rating-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.price {
  font-weight: 700;
}
.desc-list {
  padding-left: 18px;
  color: #444;
}
.walker-photo-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  position: sticky;
  top: 20px;
  align-self: flex-start;
}
.walker-photo {
  width: 260px;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

@media (max-width: 900px) {
  .walker-info {
    align-items: center;
    gap: 20px;
  }
  .walker-container {
    max-width: 90%;
    min-width: unset;
  }
  .walker-photo {
    width: 80%;
    max-height: 400px;
  }
  .rating-row {
    flex-wrap: wrap;
  }
}
</style>
