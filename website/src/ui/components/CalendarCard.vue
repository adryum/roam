<template>
  <div>
    <button class="schedule-btn" @click="openCalendar">Schedule</button>

    <transition name="fade">
      <div v-if="isOpen" class="calendar-card" @keydown.esc="closeCalendar">
        <div class="labels">
          <label class="label">Choose a date, time and place:</label>
        </div>

        <div class="cal-grid">
          <!-- Date picker -->
          <VDatePicker
            v-model="selectedDate"
            is-inline
            :first-day-of-week="2"
            :masks="masks"
            :show-weeknumbers="false"
          />

          <!-- Time & location -->
          <div class="time-column">
            <select v-model="localStartTime">
              <option disabled value="">-- start walk when? --</option>
              <option v-for="t in timeSlots" :key="t" :value="t">{{ t }}</option>
            </select>

            <select v-model="localEndTime">
              <option disabled value="">-- end walk when? --</option>
              <option v-for="t in filteredEndTimes" :key="t" :value="t">{{ t }}</option>
            </select>


            <select v-model="localLocation">
              <option disabled value="">-- where? --</option>
              <option v-for="loc in locations" :key="loc" :value="loc">{{ loc }}</option>
            </select>

            <!-- Buttons -->
            <div class="submit-row">
              <button
                type="button"
                :disabled="!localDate || !localStartTime || !localEndTime || !localLocation"
                @click="submitForm"
              >
                Book walk
              </button>
              <button type="button" class="cancel" @click="closeCalendar">Cancel</button>
            </div>

            <!-- Preview -->
            <div class="preview" v-if="localDate || localStartTime || localEndTime || localLocation">
              <small>
                <strong>Selected:</strong>
                {{ localDate || '—' }},
                {{ localStartTime || '—' }} → {{ localEndTime || '—' }},
                {{ localLocation || '—' }}
              </small>
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
import { useRegistrationStore } from '@/core/stores/registrationStore';
import { useWalksStore } from '@/core/stores/WalkStore.ts';

const filteredEndTimes = computed(() => {
  if (!localStartTime.value) return props.timeSlots;
  const startIndex = props.timeSlots.indexOf(localStartTime.value);
  return startIndex >= 0 ? props.timeSlots.slice(startIndex + 1) : props.timeSlots;
});


// Props & emits
const props = defineProps({
  date: { type: String, default: '' },
  startTime: { type: String, default: '' },
  endTime: { type: String, default: '' },
  location: { type: String, default: '' },
  timeSlots: { type: Array, default: () => ['09:00', '10:00', '11:00', '12:00', '13:00'] },
  locations: { type: Array, default: () => ['Rīga, Āgenskalns', 'Rīga, Mārupe', 'Rīga, Centrs', 'Rīga, Sarkandaugava', 'Ogre'] },
  open: { type: Boolean, default: undefined }
})
const regStore = useRegistrationStore();
const walksStore = useWalksStore();

const emit = defineEmits(['update:date', 'update:startTime', 'update:endTime', 'update:location', 'update:open', 'submit'])

// Local state
const localStartTime = ref(props.startTime || '')
const localEndTime = ref(props.endTime || '')
const localLocation = ref(props.location || '')
const selectedDate = ref(props.date ? new Date(props.date) : null)
const localOpen = ref(props.open ?? false)

const masks = { input: 'YYYY-MM-DD' }

// Watchers: sync props <-> local state
watch(() => props.startTime, v => { if (v !== localStartTime.value) localStartTime.value = v })
watch(() => props.endTime, v => { if (v !== localEndTime.value) localEndTime.value = v })
watch(() => props.location, v => { if (v !== localLocation.value) localLocation.value = v })
watch(() => props.date, v => { selectedDate.value = v ? new Date(v) : null })
watch(() => props.open, v => { if (v !== undefined) localOpen.value = v })

// Emit updates
watch(localStartTime, v => emit('update:startTime', v))
watch(localEndTime, v => emit('update:endTime', v))
watch(localLocation, v => emit('update:location', v))
watch(localOpen, v => emit('update:open', v))
watch(localStartTime, (newStart) => {
  if (localEndTime.value && props.timeSlots.indexOf(localEndTime.value) <= props.timeSlots.indexOf(newStart)) {
    localEndTime.value = '';
  }
});


const formatDate = (d) => {
  if (!d) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
watch(selectedDate, (d) => emit('update:date', formatDate(d)))

const localDate = computed(() => formatDate(selectedDate.value))
const isOpen = computed({
  get: () => localOpen.value,
  set: (v) => { localOpen.value = v }
})

// Methods
function openCalendar() {
  localOpen.value = !localOpen.value
  if (localOpen.value && !selectedDate.value) selectedDate.value = new Date()
}
function closeCalendar() {
  localOpen.value = false
}
async function submitForm() {
  if (!regStore.isLoggedIn) {
    alert('You must be logged in to schedule a walk');
    return;
  }

  if (!localDate.value || !localStartTime.value || !localEndTime.value || !localLocation.value) return;

  const saved = await walksStore.scheduleWalk({
    date: localDate.value,
    startTime: localStartTime.value,
    endTime: localEndTime.value,
    location: localLocation.value
  });

  if (saved) {
    alert('Walk successfully scheduled!');
    closeCalendar();
  } else {
    alert('Failed to schedule walk.');
  }
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

.preview { 
  display:flex;
  max-width: 150px;
  margin-top:8px; 
  color:#666; 
  font-size:0.85rem; 
}

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
