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
            :show-weeknumbers="false"
            :masks="masks"
            :attributes="dateAttributes"
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
import { ref, computed, watch, onMounted } from 'vue'
import { DatePicker as VDatePicker } from 'v-calendar'
import 'v-calendar/style.css'
import { useRegistrationStore } from '@/core/stores/registrationStore'
import { useWalksStore } from '@/core/stores/WalkStore.ts'

const regStore = useRegistrationStore()
const walksStore = useWalksStore()

const props = defineProps({
  walkerId: { type: Number, required: true },
  timeSlots: { type: Array, default: () => ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30'] },
  locations: { 
    type: Array, 
    default: () => [
      'Rīga, Āgenskalns',
      'Rīga, Mārupe',
      'Rīga, Centrs',
      'Rīga, Sarkandaugava',
      'Ogre'
    ] 
  }
})

const localStartTime = ref('')
const localEndTime = ref('')
const localLocation = ref('')
const selectedDate = ref(null)
const localOpen = ref(false)
const masks = { input: 'YYYY-MM-DD' }

const isOpen = computed({
  get: () => localOpen.value,
  set: (v) => { localOpen.value = v }
})

function openCalendar() { 
  localOpen.value = true
  if (!selectedDate.value) selectedDate.value = new Date()
}
function closeCalendar() { localOpen.value = false }

const formatDate = (d) => {
  if (!d) return ''
  const date = new Date(d)
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const localDate = computed(() => formatDate(selectedDate.value))

const filteredEndTimes = computed(() => {
  if (!localStartTime.value) return props.timeSlots
  const startIndex = props.timeSlots.indexOf(localStartTime.value)
  return startIndex >= 0 ? props.timeSlots.slice(startIndex + 1) : props.timeSlots
})

// Fetch walks on mount
onMounted(async () => {
  if (props.walkerId) {
    await walksStore.fetchWalks(props.walkerId)
    console.log('Loaded walk dates:', walksStore.walks.map(w => w.walk_start_date_time))
  }
})

const dateAttributes = computed(() => {
  const attributes = []

  walksStore.walks
    .filter(w => w.walk_start_date_time)
    .forEach(w => {
      const [datePart] = w.walk_start_date_time.split('T')
      const [year, month, day] = datePart.split('-').map(Number)
      const localDate = new Date(year, month - 1, day)

      attributes.push({
        key: `scheduled-${localDate.getTime()}`,
        dates: localDate,
        highlight: {
          fillMode: 'solid',
          style: {
            backgroundColor: '#22c55e',  
            color: '#fff',                // text color
            borderRadius: '50%',
          }
        }
      })
    })

  if (selectedDate.value) {
    const selDate = new Date(selectedDate.value)
    selDate.setHours(0, 0, 0, 0)
    attributes.push({
      key: 'selected-date',
      dates: selDate,
      highlight: {
        fillMode: 'solid',
        style: {
          backgroundColor: '#3b82f6', 
          color: '#fff',
          borderRadius: '50%',
        }
      }
    })
  }

  return attributes
})



// Schedule walk
async function submitForm() {
  if (!regStore.isLoggedIn) {
    alert('You must be logged in to schedule a walk')
    return
  }
  if (!localDate.value || !localStartTime.value || !localEndTime.value || !localLocation.value) return

  const payload = {
    walkerId: props.walkerId,
    clientId: regStore.user.id,
    pathStartLocation: localLocation.value,
    pathEndLocation: localLocation.value,
    walkStartDate: `${localDate.value}T${localStartTime.value}:00`,
    walkEndDate: `${localDate.value}T${localEndTime.value}:00`,
    price: 20,
    description: 'Scheduled via app',
    assignedPets: []
  }

  const result = await walksStore.scheduleWalk(payload)

  if (result) {
    // Refresh walks after scheduling
    await walksStore.fetchWalks(props.walkerId)
    alert('Walk successfully scheduled!')
    closeCalendar()
  } else {
    alert('Failed to schedule walk.')
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

.schedule-btn { 
  background:#000; color:#fff; border-radius:8px; padding:10px 18px; border:0; cursor:pointer; width:100%;
}

/* Scheduled (green) */
.vc-day .vc-highlight.scheduled-date {
  --vc-highlight-solid-bg: #22c55e; /* bright green */
  --vc-highlight-border-radius: 50%;
}

/* Selected (blue) */
.vc-day .vc-highlight.selected-date {
  --vc-highlight-solid-bg: #3b82f6; /* bright blue */
  --vc-highlight-border-radius: 50%;
}

/* If both scheduled and selected, show blue circle with green ring */
.vc-day .vc-highlight.scheduled-date.selected-date {
  --vc-highlight-solid-bg: #3b82f6; /* blue inside */
  box-shadow: 0 0 0 3px #22c55e inset; /* green ring */
}
.vc-day-content.vc-highlight-content-solid.vc-#22c55e {
  background-color: #22c55e !important;
  color: #fff !important;
}



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
