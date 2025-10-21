<template>
  <ul class="review-list">
    <li v-for="(r, idx) in visibleReviews" :key="idx" class="review">
      <div class="review-head">
        <div class="review-user">{{ r.creators_fullname }}</div>
        <StarRating :value="r.stars" />

        <!-- Show edit/delete buttons only if review belongs to logged-in user -->
        <div v-if="isLoggedIn && userId && r.creator_id === userId" class="review-controls">
          <button @click="startEdit(r)">Edit</button>
          <button @click="deleteReview(r.id)">Delete</button>
        </div>
      </div>

      <div class="review-title">{{ r.title }}</div>

      <div class="review-content">
        <div class="review-body">{{ r.content }}</div>
        <div class="review-date">{{ new Date(r.creation_date).toLocaleDateString() }}</div>
      </div>
    </li>
  </ul>

  <!-- Add/Edit Review Form -->
  <div v-if="isLoggedIn" class="add-review">
    <h3>{{ editingReview ? 'Edit Review' : 'Add a Review' }}</h3>
    <div class="star-rating clickable">
    <img
      v-for="n in 5"
      :key="n"
      :src="n <= form.stars ? '/assets/star.png' : '/assets/star_gray.png'"
      class="star"
      @click="form.stars = n"
    />
  </div>
    <input v-model="form.title" placeholder="Title" />
    <textarea v-model="form.content" placeholder="Write your review"></textarea>
    <button @click="submitReview">{{ editingReview ? 'Update' : 'Submit' }}</button>
    <button v-if="editingReview" @click="cancelEdit">Cancel</button>
  </div>

  <div class="reviews-action" v-if="reviews.length > 3">
    <button class="show-reviews-btn" @click="showAll = !showAll">
      {{ showAll ? 'Show less' : 'Show more' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import StarRating from './StarRating.vue'
import { useRegistrationStore } from '@/core/stores/registrationStore'
import { useReviewStore } from '@/core/stores/ReviewStore'

const props = defineProps({
  toUserId: { type: Number, required: true }, // who the review is about
})

const regStore = useRegistrationStore()
const reviewStore = useReviewStore()

const showAll = ref(false)
const form = ref({ title: '', content: '', stars: 0 })
const editingReview = ref<any>(null)

const user = computed(() => regStore.user)
const userId = computed(() => regStore.user?.id ?? null)
const isLoggedIn = computed(() => regStore.isLoggedIn)
const reviews = computed(() => {
  const all = reviewStore.reviews || []
  // Filter reviews only for this walker
  return all.filter(r => r.receiver_id === props.toUserId)
})


const visibleReviews = computed(() => {
  const arr = reviews.value
  return showAll.value ? arr : arr.slice(0, 3)
})

onMounted(() => {
  reviewStore.fetchReviews()
})

async function submitReview() {
  if (!form.value.title || !form.value.content) return;

  if (editingReview.value) {
    // Send edit to backend
    await reviewStore.editReview(editingReview.value.id, form.value);

    // Clear editing state
    editingReview.value = null;

    // Refresh reviews from backend
    await reviewStore.fetchReviews(props.toUserId);
  } else {
    await reviewStore.createReview(
      props.toUserId,
      form.value.stars,
      form.value.title,
      form.value.content
    );

    // Refresh reviews to include the new one
    await reviewStore.fetchReviews(props.toUserId);
  }

  // Reset form
  form.value = { title: '', content: '', stars: 0 };
}


function deleteReview(id: number) {
  if (!userId.value) return
  reviewStore.deleteReview(id)
}

function startEdit(r: any) {
  editingReview.value = r
  form.value = { title: r.title, content: r.content, stars: r.stars }
}

function cancelEdit() {
  editingReview.value = null
  form.value = { title: '', content: '', stars: 0 }
}
</script>



<style scoped>
.add-review {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  margin: 20px 0;
  padding: 20px;
  background-color: #fdfdfd;
  border: 1px solid #eee;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.add-review h3 {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: #222;
  text-align: left;
}

.add-review input {
  max-width: 100%;
  padding: 10px 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.2s;
}
.add-review textarea {
  padding: 10px 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.2s;
}

.add-review input:focus,
.add-review textarea:focus {
  outline: none;
  border-color: #007bff;
}

.add-review textarea {
  min-height: 100px;
  resize: vertical;
}

.add-review button {
  width: fit-content;
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  background-color: #007bff;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-review button:hover {
  background-color: #0056b3;
}

.add-review button + button {
  margin-left: 10px;
  background-color: #6c757d;
}

.add-review button + button:hover {
  background-color: #495057;
}
.add-review .star-rating.clickable {
  display: flex;
  gap: 4px;
  cursor: pointer;
}

.add-review .star-rating.clickable .star {
  width: 24px;
  height: 24px;
  object-fit: contain;
  transition: transform 0.1s;
}

.add-review .star-rating.clickable .star:hover {
  transform: scale(1.2);
}

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