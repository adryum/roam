<template>
  <div class="home-view">
    <Header />
    <section class="hero-section">
      <img src="/assets/background.png" alt="Dog walking in autumn" class="hero-image" />
      <div class="hero-overlay">
        <h1 class="hero-title">Welcome!</h1>
        <p class="hero-subtitle">Schedule with our best dog walkers</p>
        <a href="#team-section" class="hero-button">Book a walk</a>
      </div>
    </section>

    <section class="team-section" id="team-section">
      <div class="team-grid">
        <TeamCard
          name="Ēriks Fūrmanis"
          experience="Speciālists ar 5 gadu pieredzi"
          image="/assets/eriks.png"
          :reverse="false"
        />
        <TeamCard
          name="Ēriks Fūrmanis"
          experience="Speciālists ar 15 gadu pieredzi"
          image="/assets/heisenberg.png"
          :reverse="true"
        />
      </div>
    </section>
    <Footer />
  </div>
</template>

<script setup>
import TeamCard from '../components/TeamCard.vue';
import Header from '@/ui/components/Header.vue'
import Footer from '@/ui/components/Footer.vue'
</script>

<style lang="scss" scoped>
.home-view {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.hero-section {
  position: relative;
  height: 60vh;
  overflow: hidden;

  .hero-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .hero-overlay {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 1rem;
    color: white;

    .hero-title {
      font-size: 2.25rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      letter-spacing: -0.025em;

      @media (min-width: 768px) {
        font-size: 3rem;
      }
    }

    .hero-subtitle {
      font-size: 1.125rem;
      margin-bottom: 1.5rem;
      opacity: 0.9;

      @media (min-width: 768px) {
        font-size: 1.25rem;
      }
    }

    .hero-button {
      background-color: #473212;
      color: white;
      padding: 0.5rem 1.5rem;
      border-radius: 0.375rem;
      font-weight: 500;
      font-size: 0.875rem;
      letter-spacing: 0.05em;
      border: none;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background-color: #374151;
      }
    }
  }
}

.team-section {
  padding: 4rem 1rem;
  background-color: white;

  @media (min-width: 768px) {
    padding: 4rem 2rem;
  }

  @media (min-width: 1024px) {
    padding: 4rem 4rem;
  }

  .team-grid {
    display: grid;
    gap: 4rem;

    @media (min-width: 768px) {
      grid-template-columns: 1fr 1fr;
    }
  }
}
</style>