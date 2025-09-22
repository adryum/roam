<!-- InlineSchedule.vue -->
<template>
  <div>
    <!-- external Schedule button (can be outside this component if you prefer) -->
    <button class="schedule-btn" @click="openCalendar">Schedule</button>

    <!-- inline calendar panel (shown only when isOpen) -->
    <transition name="fade">
      <div v-if="isOpen" class="calendar-card" @keydown.esc="closeCalendar">
        <div class="cal-grid">
          <label class="label">Date</label>

          <!-- VDatePicker (inline) -->
          <VDatePicker
            v-model="dateObj"
            is-inline
            :first-day-of-week="2"     
            :masks="masks"
            :show-weeknumbers="false"
          />

          <div class="time-column">
            <label class="label">Time</label>
            <select v-model="localTime">
              <option disabled value="">-- pick a time --</option>
              <option v-for="t in timeSlots" :key="t" :value="t">{{ t }}</option>
            </select>

            <div class="submit-row">
              <button
                type="button"
                :disabled="!localDate || !localTime"
                @click="submitForm"
              >
                Book walk
              </button>

              <button type="button" class="cancel" @click="closeCalendar">
                Cancel
              </button>
            </div>

            <div class="preview" v-if="localDate || localTime">
              <small><strong>Selected:</strong> {{ localDate || '—' }} {{ localTime || '' }}</small>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { DatePicker as VDatePicker } from 'v-calendar'
import 'v-calendar/style.css' // make sure this file is included in your build

// Props & emits
const props = defineProps({
  date: { type: String, default: '' },
  time: { type: String, default: '' },
  timeSlots: { type: Array, default: () => ['09:00', '10:00', '11:00', '12:00', '13:00'] },
  // optional external control: v-model:open
  open: { type: Boolean, default: undefined }
})
const emit = defineEmits(['update:date', 'update:time', 'update:open', 'submit'])

// Local reactive state
const localTime = ref(props.time || '')
const dateObj = ref(props.date ? new Date(props.date) : null)
const localOpen = ref(props.open ?? false)

// Input masks for display/parse (v-calendar)
const masks = { input: 'YYYY-MM-DD' }

// Sync props -> local
watch(() => props.time, v => { if (v !== localTime.value) localTime.value = v })
watch(() => props.date, v => {
  dateObj.value = v ? new Date(v) : null
})
watch(() => props.open, v => {
  if (v !== undefined) localOpen.value = v
})

// When dateObj changes, emit formatted string (YYYY-MM-DD)
const formatDate = (d) => {
  if (!d) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
watch(dateObj, (d) => {
  const formatted = formatDate(d)
  emit('update:date', formatted)
})

// When localTime changes, emit
watch(localTime, (t) => emit('update:time', t))

// Keep external v-model:open in sync
watch(localOpen, v => emit('update:open', v))

// Computed helpers
const localDate = computed(() => formatDate(dateObj.value))
const isOpen = computed({
  get: () => localOpen.value,
  set: (v) => { localOpen.value = v }
})

// Methods
function openCalendar() {
  localOpen.value = true
  // if no date preselected, set default to today
  if (!dateObj.value) dateObj.value = new Date()
}
function closeCalendar() {
  localOpen.value = false
}
function submitForm() {
  // validation guard
  if (!localDate.value || !localTime.value) return
  // emit submit payload (parent can listen to @submit="onSubmit")
  emit('submit', { date: localDate.value, time: localTime.value })
  // close the inline calendar after booking
  localOpen.value = false
}
</script>

<style scoped>
.schedule-btn {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
  margin-bottom: 8px;
}

.calendar-card {
  margin-top:8px;
  padding:14px;
  background:#fff;
  border-radius:10px;
  box-shadow:0 6px 18px rgba(20,30,50,0.06);
  display:flex;
  flex-direction:column;
  gap:10px;
}

/* layout: date picker on the left, time + actions on the right */
.cal-grid {
  display:flex;
  gap:20px;
  align-items:flex-start;
  flex-wrap:nowrap;
}

/* make the calendar larger for better touch targets */
.VDatePicker,
.vc-container,
.vc-pane {
  font-size: 1.05rem; /* slightly bigger */
}

/* right column */
.time-column {
  display:flex;
  flex-direction:column;
  gap:10px;
  min-width:150px;
}

.label { font-size:0.9rem; color:#333; margin-bottom:4px; }

select {
  padding:8px 10px;
  border-radius:8px;
  border:1px solid #e6e6e6;
}

.submit-row { display:flex; gap:8px; align-items:center; margin-top:8px; }
.submit-row button {
  padding:10px 14px;
  border-radius:8px;
  border:0;
  cursor:pointer;
}
.submit-row button[disabled] { opacity:0.5; cursor:not-allowed; }
.submit-row .cancel { background:transparent; border:1px solid #ddd; color:#333; padding:8px 12px; }

.preview { margin-top:8px; color:#666; font-size:0.85rem; }

/* small fade transition */
.fade-enter-active, .fade-leave-active { transition: opacity .12s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
