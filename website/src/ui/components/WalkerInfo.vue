<template>
  <div class="walker-info">
    <div class="walker-text">
      <h1>{{ walker.name }}</h1>
      <div class="rating-row">
        <p><b>Professional Dog walker</b></p>
        <StarRating :value="averageRating" />
        <div class="price">10-16$/h</div>
      </div>

      <ul class="desc-list">
        <li v-for="(d, i) in walker.details" :key="i">{{ d }}</li>
      </ul>

      <CalendarCard
        :date="selectedDate"
        :time="selectedTime"
        :time-slots="timeSlots"
        @update:date="selectedDate = $event"
        @update:time="selectedTime = $event"
        @submit="submitSchedule"
        />
    </div>

    <div class="walker-photo-wrap">
      <img class="walker-photo" :src="walker.photoUrl" :alt="walker.name" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import StarRating from './StarRating.vue'
import CalendarCard from './CalendarCard.vue'

// Define props once and get a variable
const props = defineProps({
  walker: {
    type: Object,
    required: true
  }
})

// Calendar / scheduling
const showCalendar = ref(false)
const selectedDate = ref('')
const selectedTime = ref('')
const scheduledMessage = ref('')

// Time slots
const timeSlots = (() => {
  const slots = []
  for (let h = 8; h <= 18; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`)
    if (h !== 18) slots.push(`${String(h).padStart(2, '0')}:30`)
  }
  return slots
})()

// Average rating computed from walker reviews
const averageRating = computed(() => {
  const reviews = props.walker.reviews || []
  return reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0
})

// Toggle calendar visibility
function toggleCalendar() {
  showCalendar.value = !showCalendar.value
  scheduledMessage.value = ''
}

// Submit schedule
function submitSchedule(date = selectedDate.value, time = selectedTime.value) {
  if (!date || !time) return
  scheduledMessage.value = `Booked with ${props.walker.name} on ${date} at ${time}.`
}
</script>

<style scoped>
.walker-info { display:flex; gap:36px; align-items:flex-start; justify-content:center; width:100%; max-width:980px; margin-bottom:20px; } .walker-text { max-width:520px; text-align:left; } .walker-text h1 { margin:0 0 8px; font-size:28px; } .role { font-weight:700; color:#222; margin-bottom:8px; } .rating-row { display:flex; align-items:center; gap:12px; margin-bottom:14px; } .price { font-weight:700; color:#222; } .desc-list { padding-left:18px; color:#444; margin-bottom:16px; } .schedule-btn { background:#000; color:#fff; border-radius:8px; padding:10px 18px; border:0; cursor:pointer; font-weight:700; } .walker-photo-wrap { display:flex; align-items:center; justify-content:center; } .walker-photo { width:260px; height:350px; object-fit:cover; border-radius:8px; box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
</style>