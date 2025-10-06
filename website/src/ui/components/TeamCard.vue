<template>
  <div class="team-card" :class="{ 'team-card--reverse': reverse }">
    <div class="team-image-container">
      <img :src="image" :alt="name" class="team-image" />
    </div>
    <div class="team-text">
      <h2 class="team-name">{{ name }}</h2>
      <p class="team-experience">{{ experience }}</p>
      <button class="team-button" @click="$emit('view-profile')">
        Profile
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  reverse: {
    type: Boolean,
    default: false
  }
});

// Emit event if you want parent to handle profile navigation
defineEmits(['view-profile']);
</script>

<style lang="scss" scoped>
.team-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 2rem;
  }

  &--reverse {
    @media (min-width: 768px) {
      flex-direction: row-reverse;
    }
  }

  .team-image-container {
    width: 100%;

    @media (min-width: 768px) {
      width: 50%;
    }
  }

  .team-image {
    width: 100%;
    height: auto;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    border: 1px solid #f3f4f6;
    display: block;
  }

  .team-text {
    width: 100%;
    text-align: center;

    @media (min-width: 768px) {
      width: 50%;
      text-align: left;
    }

    .team-name {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
      line-height: 1.25;
      color: #111827;
    }

    .team-experience {
      color: #4b5563;
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }

    .team-button {
      background-color: #111827;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      font-size: 0.75rem;
      font-weight: 500;
      letter-spacing: 0.075em;
      border: none;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background-color: #1f2937;
      }
    }
  }
}
</style>