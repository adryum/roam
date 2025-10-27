<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRegistrationStore } from '@/core/stores/registrationStore'
import router from '@/core/router'

import Header from '@/ui/components/Header.vue'
import Footer from '@/ui/components/Footer.vue'
import CalendarCard from '../components/CalendarCard.vue'
import Map from '../components/Map.vue'
import { useWalksStore } from '@/core/stores/WalkStore.ts';

const walksStore = useWalksStore();
const regStore = useRegistrationStore()
const { user, isLoggedIn } = storeToRefs(regStore)

onMounted(async () => {
  if (regStore.isLoggedIn && user.value?.id) {
    await walksStore.fetchWalks(user.value.id)
  }
})

const fullName = computed(() =>
  user.value ? `${user.value.name} ${user.value.surname}` : '—'
)
const profilePic = computed(() =>
  user.value?.profile_picture && user.value.profile_picture.trim() !== ''
    ? user.value.profile_picture
    : '/assets/default-avatar.png'
)
const role = computed(() => user.value?.role || '—')
const email = computed(() => user.value?.email || '—')
const description = computed(() => user.value?.description || 'Nav apraksta')
const descriptionDots = computed(() => user.value?.description_dots ?? [])

// --- Editing state & handlers (name, surname, description, profile picture URL) ---
const editingProfile = ref(false)
const nameDraft = ref('')
const surnameDraft = ref('')
const descriptionDraft = ref('')
const profilePictureUrlDraft = ref('') // URL-based "upload"
const picturePreview = ref('')

function startEditing() {
  if (!user.value) return
  nameDraft.value = user.value.name ?? ''
  surnameDraft.value = user.value.surname ?? ''
  descriptionDraft.value = user.value.description ?? ''
  profilePictureUrlDraft.value = user.value.profile_picture ?? ''
  picturePreview.value = profilePictureUrlDraft.value || '/assets/default-avatar.png'
  editingProfile.value = true
}

function cancelEditing() {
  editingProfile.value = false
}

watch(profilePictureUrlDraft, (v) => {
  picturePreview.value = (v && v.trim() !== '') ? v.trim() : '/assets/default-avatar.png'
})

async function saveProfile() {
  if (!user.value?.id) return

  try {
    const form = new FormData()
    form.append('id', String(user.value.id))
    form.append('name', nameDraft.value.trim())
    form.append('surname', surnameDraft.value.trim())
    form.append('description', descriptionDraft.value.trim())
    form.append('role', user.value.role ?? '')
    // NEW: pass the URL to the server
    form.append('profile_picture', profilePictureUrlDraft.value.trim())

    const res = await fetch('http://localhost:5000/users/update', {
      method: 'POST',
      body: form,
    })

    if (!res.ok) throw new Error('Failed to update user')
    const updated = await res.json()

    // Merge server response into local user (keep e.g. email if server doesn't return it)
    user.value = { ...user.value, ...updated }
    localStorage.setItem('user', JSON.stringify(user.value))
    editingProfile.value = false
  } catch (error) {
    console.error(error)
    alert('Could not save changes. Please try again.')
  }
}

// --- Delete / Logout (unchanged) ---
async function deleteUser() {
  if (!user.value?.id) return alert('User not found.')

  const confirmDelete = confirm('Are you sure you want to delete this user? This action cannot be undone.')
  if (!confirmDelete) return

  try {
    const response = await fetch(`http://localhost:5000/users/${user.value.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) throw new Error('Failed to delete user')

    alert('User deleted successfully.')
    regStore.logout()
    router.push('/registration')
  } catch (error) {
    console.error(error)
    alert('An error occurred while deleting the user.')
  }
}

function logout() {
  regStore.logout()
  router.push('/registration')
}

// --- Walks / calendar demo (unchanged) ---
const date = ref('')
const startTime = ref('')
const endTime = ref('')
const location = ref('')
const calendarOpen = ref(true)
onMounted(() => (calendarOpen.value = true))
const timeSlots = ['09:00','10:00','11:00','12:00','13:00','14:00']
const locations = ['Rīga, Āgenskalns','Rīga, Mārupe','Rīga, Centrs','Rīga, Sarkandaugava','Ogre']
function handleBooking(payload: { date: string; startTime: string; endTime: string; location: string }) {
  alert(`Booked: ${payload.date} | ${payload.startTime} → ${payload.endTime} @ ${payload.location}`)
}

// --- Dog modal demo (unchanged) ---
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
        <!-- Left -->
        <div class="left">
          <div class="profile-header">
            <div class="header-top">
              <!-- Title OR editor -->
              <h1 v-if="!editingProfile">{{ fullName }}</h1>
              <div v-else class="edit-name">
                <div class="grid-two">
                  <input v-model="nameDraft" placeholder="Name" />
                  <input v-model="surnameDraft" placeholder="Surname" />
                </div>

                <textarea v-model="descriptionDraft" rows="3" placeholder="Description" />

                <!-- NEW: Profile picture via URL -->
                <label class="label">Profile picture URL</label>
                <input v-model="profilePictureUrlDraft" placeholder="https://example.com/photo.jpg" />

                <div class="preview">
                  <span>Preview:</span>
                  <img :src="picturePreview" alt="Preview" />
                </div>

                <div class="edit-actions">
                  <button class="btn small primary" @click="saveProfile">Save</button>
                  <button class="btn small secondary" @click="cancelEditing">Cancel</button>
                </div>
              </div>

              <div class="header-actions">
                <button class="edit-btn" title="Edit profile" @click="startEditing">
                  <i class="fas fa-pen"></i>
                </button>
                <button class="delete-btn" title="Delete user" @click="deleteUser">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>

            <span class="badge">{{ role }}</span>
          </div>

          <ul class="info">
            <li><strong>E-pasts:</strong> {{ email }}</li>
            <li><strong>Apraksts:</strong> {{ description }}</li>
            <li v-for="(dot, i) in descriptionDots" :key="i">• {{ dot.point }}</li>
          </ul>

          <button class="dog-btn" @click="openDogModal">
            <i class="fas fa-dog"></i> View Information About Your Dog
          </button>

          <button class="logout-btn" @click="logout">
            <i class="fas fa-sign-out-alt"></i> Logout
          </button>

          <div class="reservations">
            <h2>Your Scheduled Walks</h2>
            <ul>
              <li v-for="walk in walksStore.walks" :key="walk.id">
                {{ walk.date }} | {{ walk.startTime }} → {{ walk.endTime }} | {{ walk.location }}
              </li>
              <li v-if="walksStore.walks.length === 0">No walks scheduled yet.</li>
            </ul>
          </div>
        </div>

        <!-- Right -->
        <div class="right">
          <img :src="profilePic" alt="Profile picture" class="profile-img" />
          <Map />
        </div>
      </div>
    </main>

    <Footer />

    <!-- Dog modal -->
    <teleport to="body">
      <div v-if="dogModalOpen" class="modal-backdrop" @click.self="closeDogModal">
        <div class="modal">
          <div class="modal-header">
            <h3>Dog Information</h3>
            <button class="icon-btn" @click="closeDogModal">✕</button>
          </div>
          <div class="modal-body">
            <div class="form-row">
              <label>Name</label>
              <input v-model="dogDraft.name" />
            </div>
            <div class="form-row">
              <label>Breed</label>
              <input v-model="dogDraft.species" />
            </div>
            <div class="form-row">
              <label>Age</label>
              <input type="number" v-model.number="dogDraft.age" />
            </div>
            <div class="form-row">
              <label>Description</label>
              <textarea v-model="dogDraft.description" rows="3" />
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
            justify-content: center;
            width: auto;
            height: 30px;
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

        .map-wrap {
          margin-top: 1rem;
        }
      }
    }
  }
}

.logout-btn {
  margin-top: 1rem;
  background: #b54d4d;
  color: #fff;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #992f2f;
  }
}

.edit-name {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  max-width: 560px;

  .grid-two {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }

  .label {
    font-size: 0.9rem;
    color: #333;
  }

  input, textarea {
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 1rem;
    width: 100%;
  }

  .preview {
    display: flex;
    align-items: center;
    gap: 0.75rem;

    img {
      width: 64px;
      height: 64px;
      border-radius: 8px;
      object-fit: cover;
      background: #eee;
      border: 1px solid #ddd;
    }
  }

  .edit-actions {
    display: flex;
    gap: 0.5rem;
  }
}

.delete-btn {
  background: #b54d4d;
  color: #fff;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #992f2f;
  }

  i {
    pointer-events: none;
  }
}

.btn.small {
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
}

.profile-img {
  width: 100%;
  max-width: 320px;
  aspect-ratio: 1/1;
  object-fit: cover;
  background: #e5e5e5;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 15, 0.4);
  display: grid;
  place-items: center;
  z-index: 1000;
}

.header-top{
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
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
