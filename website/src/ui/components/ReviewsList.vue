<template>
  <ul class="review-list">
    <li v-for="(r, idx) in visibleReviews" :key="idx" class="review">
      <div class="review-head">
        <div class="review-user">{{ r.user }}</div>
        <StarRating :value="r.rating" />
      </div>
      <div class="review-title">{{ r.title }}</div>
      <div class="review-body">{{ r.content }}</div>
    </li>
  </ul>
  <div class="reviews-action" v-if="reviews.length > 3">
    <button @click="showAll = !showAll">{{ showAll ? 'Show less' : 'Show more' }}</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import StarRating from './StarRating.vue'

// Capture props in a variable
const props = defineProps({
  reviews: {
    type: Array,
    required: true
  }
})

// Show/hide more reviews
const showAll = ref(false)

// Compute visible reviews
const visibleReviews = computed(() => {
  const arr = props.reviews || []
  return showAll.value ? arr : arr.slice(0, 3)
})
</script>


<style scoped>
.reviews { width:100%; max-width:980px; margin-top:8px; text-align:left; } .reviews h2 { font-size:22px; margin-bottom:12px; text-align:center; } .review-list { list-style:none; padding:0; margin:0; display:grid; gap:12px; } .review { background:#fff; padding:12px 14px; border-radius:10px; border:1px solid #eee; } .review-head { display:flex; justify-content:space-between; align-items:center; gap:12px; } .review-user { font-weight:700; } .review-title { margin-top:8px; font-weight:600; } .review-body { margin-top:6px; color:#444; }
</style>