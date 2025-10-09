<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRegistrationStore } from '@/core/stores/registrationStore'
import router from '@/core/router'

import Header from '@/ui/components/Header.vue'
import Footer from '@/ui/components/Footer.vue'
import CalendarCard from '../components/CalendarCard.vue'
import Map from '../components/Map.vue'

// ===== Auth / User =====
const regStore = useRegistrationStore()
const { user, isLoggedIn } = storeToRefs(regStore)

const fullName = computed(() =>
  user.value ? `${user.value.name} ${user.value.surname}` : '—'
)
const profilePic = computed(() =>
  user.value?.profile_picture ||
  'https://via.placeholder.com/600x400?text=No+Profile+Picture'
)
const role = computed(() => user.value?.role || '—')
const email = computed(() => user.value?.email || '—')
const description = computed(() => user.value?.description || 'Nav apraksta')
const descriptionDots = computed(() => user.value?.description_dots ?? [])

// ===== Calendar state (unchanged) =====
const date = ref('')
const startTime = ref('')
const endTime = ref('')
const location = ref('')
const calendarOpen = ref(true)
onMounted(() => (calendarOpen.value = true))
const timeSlots = ['09:00','10:00','11:00','12:00','13:00','14:00']
const locations = ['Rīga, Āgenskalns','Rīga, Mārupe','Rīga, Centrs','Rīga, Sarkandaugava','Ogre']
function handleBooking(payload: { date: string; startTime: string; endTime: string; location: string }) {
  console.log('Booking submitted:', payload)
  alert(`Booked: ${payload.date} | ${payload.startTime} → ${payload.endTime} @ ${payload.location}`)
}

// ===== Dog modal state (unchanged) =====
const dog = reactive({ id: 1, name: 'Pipariņš', species: 'Melns yorks', age: 3, description: 'Ļoti draudzīgs un enerģisks.' })
const dogDraft = reactive({ ...dog })
const dogModalOpen = ref(false)
const saving = ref(false)
function openDogModal() { Object.assign(dogDraft, dog); dogModalOpen.value = true }
function closeDogModal() { dogModalOpen.value = false }
async function saveDog() {
  saving.value = true
  try { Object.assign(dog, dogDraft); closeDogModal() }
  catch (e) { console.error('Failed to save dog:', e); alert('Failed to save changes.') }
  finally { saving.value = false }
}
</script>

<template>
  <div class="profile-view">
    <Header />

    <main class="main">
      <div class="content">
        <!-- Left column -->
        <div class="left">
          <div class="profile-header">
            <h1>{{ fullName }}</h1>
            <span class="badge" v-if="role"> {{ role }} </span>
            <button class="edit-btn" title="Edit profile">
              <i class="fas fa-pen"></i>
            </button>
          </div>

          <ul class="info">
            <li><strong>E-pasts:</strong> {{ email }}</li>
            <li><strong>Apraksts:</strong> {{ description }}</li>
            <li v-for="(dot, i) in descriptionDots" :key="i">• {{ dot.point }}</li>
          </ul>

          <button class="dog-btn" @click="openDogModal">
            <i class="fas fa-dog"></i>
            View Information About Your Dog
          </button>

          <div class="calendar-section">
            <h2>Book a walk</h2>
            <CalendarCard
              v-model:date="date"
              v-model:startTime="startTime"
              v-model:endTime="endTime"
              v-model:location="location"
              :timeSlots="timeSlots"
              :locations="locations"
              v-model:open="calendarOpen"
              @submit="handleBooking"
            />
          </div>
        </div>

        <!-- Right column -->
        <div class="right">
          <img :src="profilePic" alt="Profile" class="profile-img" />
          <Map />
        </div>
      </div>
    </main>

    <Footer />

    <!-- Dog modal (unchanged) -->
    <teleport to="body">
      <div v-if="dogModalOpen" class="modal-backdrop" @click.self="closeDogModal">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="dogModalTitle">
          <div class="modal-header">
            <h3 id="dogModalTitle">Dog Information</h3>
            <button class="icon-btn" aria-label="Close" @click="closeDogModal">✕</button>
          </div>
          <div class="modal-body">
            <div class="form-row">
              <label for="dogName">Name</label>
              <input id="dogName" v-model="dogDraft.name" placeholder="e.g. Pipariņš" />
            </div>
            <div class="form-row">
              <label for="dogBreed">Breed</label>
              <input id="dogBreed" v-model="dogDraft.species" placeholder="e.g. Melns yorks" />
            </div>
            <div class="form-row">
              <label for="dogAge">Age</label>
              <input id="dogAge" type="number" min="0" v-model.number="dogDraft.age" placeholder="e.g. 3" />
            </div>
            <div class="form-row">
              <label for="dogDesc">Description</label>
              <textarea id="dogDesc" v-model="dogDraft.description" rows="3" placeholder="Short description..." />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn secondary" @click="closeDogModal">Cancel</button>
            <button class="btn primary" :disabled="saving" @click="saveDog">
              {{ saving ? 'Saving…' : 'Save changes' }}
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<style lang="scss">
.profile-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f4f0ec;
  color: #333;

  .main {
    flex: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;

    .content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2.5rem;

      .left {
        .profile-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;

          h1 {
            font-size: 2rem;
            font-weight: bold;
          }

          .edit-btn {
            background: #e6d5c0;
            padding: 0.5rem;
            border-radius: 6px;
          }
        }

        .info {
          margin-top: 1rem;
          font-size: 1.125rem;
        }

        .dog-btn {
          margin-top: 1.5rem;
          background: #000;
          color: #fff;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;

          &:hover {
            background: #333;
          }
        }

        .calendar-section {
          margin-top: 2rem;

          h2 {
            font-weight: 600;
            margin-bottom: 0.75rem;
          }

          :deep(.schedule-btn) {
            display: none !important;
          }
          :deep(.calendar-card) {
            display: block !important;
            opacity: 1 !important;
            visibility: visible !important;
          }
        }
      }

      .right {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        .profile-img {
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        /* Map styling wrapper */
        .map-wrap {
          margin-top: 1rem;
        }
      }
    }
  }
}

/* Modal styles remain same as before */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 15, 0.4);
  display: grid;
  place-items: center;
  z-index: 1000;
}

.modal {
  width: min(520px, 96vw);
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.2);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    h3 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
    }

    .icon-btn {
      border: 0;
      background: transparent;
      font-size: 1.1rem;
      cursor: pointer;
      line-height: 1;
      padding: 6px;
      border-radius: 6px;

      &:hover {
        background: #f3f3f3;
      }
    }
  }

  .modal-body {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .form-row {
      display: flex;
      flex-direction: column;
      gap: 6px;

      label {
        font-size: 0.9rem;
        color: #333;
      }

      input,
      textarea {
        padding: 10px 12px;
        border: 1px solid #e5e5e5;
        border-radius: 8px;
        font-size: 1rem;

        &:focus {
          outline: none;
          border-color: #a9906b;
          box-shadow: 0 0 0 3px rgba(169, 144, 107, 0.15);
        }
      }
      textarea {
        resize: vertical;
      }
    }
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 4px;

    .btn {
      padding: 10px 16px;
      border-radius: 8px;
      border: 0;
      cursor: pointer;
      font-weight: 600;

      &.secondary {
        background: #f3f3f3;
        color: #333;

        &:hover {
          background: #eaeaea;
        }
      }

      &.primary {
        background: #a9906b;
        color: #fff;

        &:hover {
          background: #8d7857;
        }

        &:disabled {
          background: #cbbda7;
          cursor: not-allowed;
        }
      }
    }
  }
}

@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css");
</style>
