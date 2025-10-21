import { defineStore } from 'pinia'
import axios from 'axios'
import { useRegistrationStore } from './registrationStore'

export const useReviewStore = defineStore('review', {
  state: () => ({
    reviews: [] as any[],
    isLoading: false,
  }),

  actions: {
    async fetchReviews(toUserId?: number) {
      this.isLoading = true
      try {
        const { data } = await axios.get('http://localhost:5000/reviews/')
        let allReviews = Array.isArray(data) ? data : []

        // If API wraps reviews in reviews_json
        if (allReviews.length === 1 && allReviews[0].reviews_json) {
          const raw = allReviews[0].reviews_json
          allReviews = typeof raw === 'string' ? JSON.parse(raw) : raw
        }

        // Filter by walker if provided
        this.reviews = toUserId
          ? allReviews.filter((r: any) => r.receiver_id === toUserId)
          : allReviews
      } catch (err) {
        console.error('fetchReviews error:', err)
        this.reviews = []
      } finally {
        this.isLoading = false
      }
    },

    async createReview(toUserId: number, stars: number, title: string, content: string) {
      const regStore = useRegistrationStore()
      if (!regStore.isLoggedIn || !regStore.user?.id) return

      const payload = {
        fromUserId: regStore.user.id,
        toUserId,
        stars,
        title,
        content,
      }

      const { data } = await axios.post('http://localhost:5000/reviews/create', payload)
      this.reviews.push(...data)
    },

    async deleteReview(reviewId: number) {
      const regStore = useRegistrationStore()
      if (!regStore.isLoggedIn || !regStore.user?.id) return

      const review = this.reviews.find(r => r.id === reviewId)
      if (!review || review.creator_id !== regStore.user.id) return

      await axios.post('http://localhost:5000/reviews/delete', { id: reviewId })
      this.reviews = this.reviews.filter(r => r.id !== reviewId)
    },

    async editReview(reviewId: number, updated: { title?: string; content?: string; stars?: number }) {
        const regStore = useRegistrationStore()
        if (!regStore.isLoggedIn || !regStore.user?.id) return

        const review = this.reviews.find(r => r.id === reviewId)
        if (!review || review.creator_id !== regStore.user.id) return

        try {
            // send update to backend
            const { data } = await axios.post('http://localhost:5000/reviews/update', {
            id: reviewId,
            ...updated
            })

            // update local array with backend response
            if (data && typeof data === 'object') {
            Object.assign(review, data)
            } else {
            Object.assign(review, updated)
            }

        } catch (err) {
            console.error('editReview error:', err)
        }
        }

  },
})
