<template>
  <div class="star-rating">
    <div class="stars back">
      <img src="/assets/star_gray.png" v-for="n in 5" :key="'b'+n" class="star" />
    </div>
    <div class="stars front" :style="{ width: star_rating_percentage }">
      <img src="/assets/star.png" v-for="n in 5" :key="'f'+n" class="star" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: { type: Number, required: true }
})

const star_rating_percentage = computed(() => (Math.max(0, Math.min(5, props.value)) / 5) * 100 + '%')
</script>


<style scoped>

.star-rating {
  position: relative;
  display: inline-block;
  width: calc(5 * 24px);
  height: 24px;
}

.star-rating .stars {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
}

.star-rating .back {
  color: #e6e6e6;
}

.star-rating .front {
  overflow: hidden;
  width: 0;
}

.star-rating .star {
  width: 24px;
  height: 24px;
  object-fit: contain;
}
</style>