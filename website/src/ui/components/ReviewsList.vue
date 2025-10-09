<template>
  <ul class="review-list">
    <li v-for="(r, idx) in visibleReviews" :key="idx" class="review">
      <div class="review-head">
        <div class="review-user">{{ r.creators_fullname }}</div>
        <StarRating :value="r.stars" />
      </div>

      <div class="review-title">{{ r.title }}</div>

      <div class="review-content">
        <div class="review-body">{{ r.content }}</div>
        <div class="review-date">
          {{ new Date(r.creation_date).toLocaleDateString() }}
        </div>
      </div>
    </li>
  </ul>

  <div class="reviews-action" v-if="reviews.length > 3">
    <button class="show-reviews-btn" @click="showAll = !showAll">
      {{ showAll ? 'Show less' : 'Show more' }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import StarRating from './StarRating.vue'

const props = defineProps({
  reviews: {
    type: Array,
    required: true
  }
})

const showAll = ref(false)

const visibleReviews = computed(() => {
  const arr = props.reviews || []
  return showAll.value ? arr : arr.slice(0, 3)
})
</script>



<style scoped>
.reviews { 
width:100%; 
max-width:980px; 
margin-top:8px; 
text-align:left; } 
.reviews h2 { 
  font-size:22px; 
  margin-bottom:12px; 
  text-align:center; } 
.review-list { 
  list-style:none; 
  padding:0; margin:0; 
  display:grid; gap:12px; } 
.review { 
  background:#fff; 
  padding:12px 14px; 
  border-radius:10px; 
  border:1px solid #eee; } 
.review-head { display:flex; 
  justify-content:space-between; 
  align-items:center; 
  gap:12px; } 
.review-user { font-weight:700; } 
.review-content{
  
  margin-top:6px; 
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items:center; 
  color:#444;
}
.review-date{
  font-size: 14px;
}
.review-title { 
  margin-top:8px; 
  font-weight:600; }
.show-reviews-btn{
  background:#000000; 
  color:#ffffff; 
  align-self: stretch;
  border-radius:8px; 
  padding:10px 18px; 
  border:0; 
  cursor:pointer;
  margin-top: 10px;
}
</style>