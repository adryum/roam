<template>
  <div>
    <button class="schedule-btn" @click="openCalendar">Schedule</button>

    <transition name="fade">
      <div v-if="isOpen" class="calendar-card" @keydown.esc="closeCalendar">
        <div class="labels">
        <label class="label">Date</label>
        <label class="label">Time</label>
        </div>
        <div class="cal-grid">

          <VDatePicker
            v-model="selectedDate"
            is-inline
            :first-day-of-week="2"     
            :masks="masks"
            :show-weeknumbers="false"
          />
          <div class="time-column">
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
import 'v-calendar/style.css'

// Props & emits
const props = defineProps({
  date: { type: String, default: '' },
  time: { type: String, default: '' },
  timeSlots: { type: Array, default: () => ['09:00', '10:00', '11:00', '12:00', '13:00'] },
  open: { type: Boolean, default: undefined }
})
const emit = defineEmits(['update:date', 'update:time', 'update:open', 'submit'])

const localTime = ref(props.time || '')
const selectedDate = ref(props.date ? new Date(props.date) : null)
const localOpen = ref(props.open ?? false)

const masks = { input: 'YYYY-MM-DD' }

watch(() => props.time, v => { if (v !== localTime.value) localTime.value = v })
watch(() => props.date, v => {
  selectedDate.value = v ? new Date(v) : null
})
watch(() => props.open, v => {
  if (v !== undefined) localOpen.value = v
})

const formatDate = (d) => {
  if (!d) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
watch(selectedDate, (d) => {
  const formatted = formatDate(d)
  emit('update:date', formatted)
})

watch(localTime, (t) => emit('update:time', t))

watch(localOpen, v => emit('update:open', v))
const localDate = computed(() => formatDate(selectedDate.value))
const isOpen = computed({
  get: () => localOpen.value,
  set: (v) => { localOpen.value = v }
})

// Methods
function openCalendar() {
  localOpen.value = !localOpen.value
  // set default date when opening
  if (localOpen.value && !selectedDate.value) selectedDate.value = new Date()
}
function closeCalendar() {
  localOpen.value = false
}
function submitForm() {
  if (!localDate.value || !localTime.value) return
  emit('submit', { date: localDate.value, time: localTime.value })
  localOpen.value = false
}
</script>

<style scoped>
.schedule-btn { 
  background:#000000; 
  color:#ffffff; 
  align-self: stretch;
  border-radius:8px; 
  padding:10px 18px; 
  border:0; 
  cursor:pointer;
  width: 100%;
}

.calendar-card {
  position: relative;
  margin-top:8px;
  padding:14px;
  background:#fff;
  border-radius:10px;
  box-shadow:0 6px 18px rgba(20,30,50,0.06);
  display:flex;
  flex-direction:column;
  gap:10px;
}

.cal-grid {
  display:flex;
  gap:20px;
  align-items:flex-start;
  flex-wrap:nowrap;
}


.VDatePicker,
.vc-container,
.vc-pane {
  font-size: 1.05rem;
}


.time-column {
  display:flex;
  flex-direction:column;
  gap:10px;
  min-width:150px;
}
.labels{
  align-content: space-between;
  justify-content: space-between;
  display:flex;
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

.fade-enter-active, .fade-leave-active { transition: opacity .12s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 800px) {
  .calendar-card {
    width: 90%;
    padding: 12px;
  }

  .cal-grid {
    flex-direction: column; /* stack date & time on narrow screens */
    gap: 12px;
  }

  .VDatePicker,
  .vc-container,
  .vc-pane {
    width: 100%; /* make date picker take full width */
  }

  .time-column {
    min-width: unset;
    width: 100%;
  }

  .submit-row {
    flex-direction: column;
    gap: 6px;
  }

  .preview {
    font-size: 0.8rem;
  }
}

@media (max-width: 500px) {
  .schedule-btn {
    padding: 8px 12px;
    font-size: 0.9rem;
  }

  .calendar-card {
    padding: 10px;
  }

  .labels .label {
    font-size: 0.8rem;
  }

  select {
    padding: 6px 8px;
  }

  .submit-row button {
    width: 100%;
    padding: 8px 10px;
  }
}
</style>
