// core/stores/WalkStore.ts
import { defineStore } from 'pinia'
import axios from 'axios'
import { useRegistrationStore } from './registrationStore'

interface WalkSchedulePayload {
  walkerId: number
  clientId: number
  pathStartLocation: string
  pathEndLocation: string
  walkStartDate: string
  walkEndDate: string
  price: number
  description: string
  assignedPets: number[]
}

export const useWalksStore = defineStore('walks', {
  state: () => ({
    walks: [] as any[],  // all walks for current walker
    isLoading: false,
  }),

  actions: {
    async fetchWalks(walkerId: number) {
      this.isLoading = true
      try {
        // Updated endpoint for a specific walker
        const { data } = await axios.get(`http://localhost:5000/reservations/walker/${walkerId}`)

        this.walks = Array.isArray(data) ? data : []
      } catch (err) {
        console.error('fetchWalks error:', err)
        this.walks = []
      } finally {
        this.isLoading = false
      }
    },

    async scheduleWalk(payload: WalkSchedulePayload) {
      try {
        const response = await axios.post('http://localhost:5000/reservations/create', payload);
        return response.data // returns the created reservation
      } catch (err) {
        console.error('Failed to schedule walk', err)
        return null
      }
    },

    isDateBooked(date: string) {
      // Highlight booked dates
      return this.walks.some(w => w.walk_start_date_time.startsWith(date))
    }
  }
})
