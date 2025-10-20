<script setup lang="ts">
import Header from '@/ui/components/Header.vue'
import Footer from '@/ui/components/Footer.vue'
import { ref, onMounted } from 'vue'
import axios from 'axios'




const users = ref<any[]>([])
const filteredUsers = ref<any[]>([])
const selectedRole = ref<string>('ALL')
const selectedWalker = ref<any | null>(null)
const walkerReviews = ref<any[]>([])

const loading = ref<boolean>(false)
const error = ref<string>('')

const fetchUsers = async () => {
  try {
    loading.value = true
    const res = await axios.get('http://localhost:5000/admin/users')
    users.value = res.data
    filterUsers()
  } catch (err) {
    console.error(err)
    error.value = 'Failed to load users.'
  } finally {
    loading.value = false
  }
}

const filterUsers = () => {
  if (selectedRole.value === 'ALL') {
    filteredUsers.value = users.value
  } else {
    filteredUsers.value = users.value.filter(u => u.role === selectedRole.value)
  }
}

const deleteUser = async (id: number) => {
  if (!confirm('Are you sure you want to delete this user?')) return
  try {
    await axios.delete(`http://localhost:5000/admin/users/${id}`)
    users.value = users.value.filter(u => u.id !== id)
    filterUsers()
  } catch (err) {
    console.error(err)
    alert('Failed to delete user.')
  }
}

const convertToWalker = async (id: number) => {
  try {
    await axios.put(`http://localhost:5000/admin/users/${id}/convert`)
    const user = users.value.find(u => u.id === id)
    if (user) user.role = 'WALKER'
    filterUsers()
  } catch (err) {
    console.error(err)
    alert('Failed to convert user.')
  }
}

const viewReviews = async (walker: any) => {
  selectedWalker.value = walker
  walkerReviews.value = []
  try {
    const res = await axios.get(`http://localhost:5000/admin/reviews?walkerId=${walker.id}`)
    walkerReviews.value = res.data
  } catch (err) {
    console.error(err)
    alert('Failed to load reviews.')
  }
}

const deleteReview = async (reviewId: number) => {
  if (!confirm('Delete this review?')) return
  try {
    await axios.delete(`http://localhost:5000/admin/reviews/${reviewId}`)
    walkerReviews.value = walkerReviews.value.filter(r => r.id !== reviewId)
  } catch (err) {
    console.error(err)
    alert('Failed to delete review.')
  }
}

const regStore = {
  user: { id: 1, role: 'ADMIN', name: 'Admin User', email: 'admin@test.com' }
}

onMounted(fetchUsers)
</script>

<template>
  <div>
    <Header />
    <div class="admin-container">
      <h1>Admin Panel</h1>

      <div class="filters">
        <label>Filter by role:</label>
        <select v-model="selectedRole" @change="filterUsers">
          <option value="ALL">All</option>
          <option value="USER">User</option>
          <option value="WALKER">Walker</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      <div v-if="loading">Loading users...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else>
        <table class="user-table">
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
              <td>
                <button @click="deleteUser(user.id)" class="danger">Delete</button>
                <button v-if="user.role === 'USER'" @click="convertToWalker(user.id)">Make Walker</button>
                <button v-if="user.role === 'WALKER'" @click="viewReviews(user)">View Reviews</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="selectedWalker" class="reviews-section">
        <h2>Reviews for {{ selectedWalker.name }}</h2>
        <ul v-if="walkerReviews.length">
          <li v-for="review in walkerReviews" :key="review.id">
            <strong>Rating:</strong> {{ review.rating }} - {{ review.comment }}
            <button @click="deleteReview(review.id)" class="danger small">Delete</button>
          </li>
        </ul>
        <p v-else>No reviews found for this walker.</p>
        <button @click="selectedWalker = null">Close</button>
      </div>
    </div>
    <Footer />
  </div>
</template>

<style scoped>
.admin-container {
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
}
.filters {
  margin-bottom: 1rem;
}
.user-table {
  width: 100%;
  border-collapse: collapse;
}
.user-table th, .user-table td {
  border: 1px solid #ddd;
  padding: 0.5rem;
  text-align: left;
}
.user-table th {
  background-color: #f5f5f5;
}
button {
  margin-right: 0.5rem;
  padding: 0.3rem 0.6rem;
  cursor: pointer;
}
button.danger {
  background-color: #d9534f;
  color: white;
}
button.small {
  font-size: 0.8rem;
  padding: 0.2rem 0.4rem;
}
.reviews-section {
  margin-top: 2rem;
  border-top: 1px solid #ccc;
  padding-top: 1rem;
}
</style>
