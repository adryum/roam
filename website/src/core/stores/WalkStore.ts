import { defineStore } from 'pinia';
import axios from 'axios';

export const useWalksStore = defineStore('walks', {
  state: () => ({
    walks: [] as Array<{ id:number, date:string, startTime:string, endTime:string, location:string }>,
    loading: false
  }),

  actions: {
    async fetchWalks() {
      this.loading = true;
      try {
        const { data } = await axios.get('/api/walks');
        this.walks = data;
      } finally {
        this.loading = false;
      }
    },

    async scheduleWalk(payload: { date:string, startTime:string, endTime:string, location:string }) {
      if (!payload.date || !payload.startTime || !payload.endTime || !payload.location) return null;
      try {
        const { data } = await axios.post('/api/walks', payload);
        this.walks.push(data); // immediately update local state
        return data;
      } catch (err) {
        console.error('Failed to schedule walk', err);
        return null;
      }
    }
  }
});
