<script setup lang="ts">
import { ref, useCssModule, watch } from 'vue'
import { useRegistration } from '@/core/composables/useRegistration'
import router from '@/core/router'

const s = useCssModule()
const { isLoggedIn, logIn } = useRegistration()

const email = ref('')
const password = ref('')

function handleLogin() {
  logIn(email.value, password.value)
}

watch(isLoggedIn, (newVal) => {
    if (newVal) router.push('/')
})
</script>

<template>
<div :class="s.container">
    <h1 :class="s.title">Login in!</h1>
    <input :class="s.input" placeholder="e-mail" v-model="email"/>
    <input :class="s.input" placeholder="password" v-model="password"/>
    <button :class="s.button" @click="handleLogin">Log in!</button>
</div>
</template>

<style module lang="scss">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  background-color: #f7f5f2;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  h1 {
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
  }

//   .logged-in {
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     gap: 1rem;

//     h2 {
//       color: #2a2a2a;
//     }

//     button {
//       background-color: #a9906b;
//       color: #fff;
//       border: none;
//       padding: 0.6rem 1.2rem;
//       border-radius: 6px;
//       cursor: pointer;

//       &:hover {
//         background-color: darken(#a9906b, 10%);
//       }
//     }
//   }

//   .auth-section {
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     width: 100%;
//     max-width: 350px;

//     section {
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//       width: 100%;
//       margin-bottom: 1rem;

//       h2 {
//         color: #444;
//         margin-bottom: 0.5rem;
//       }

//       input {
//         display: block;
//         width: 100%;
//         margin: 0.4rem 0;
//         padding: 0.6rem;
//         border: 1px solid #ccc;
//         border-radius: 6px;
//         transition: border 0.2s ease;

//         &:focus {
//           border-color: #a9906b;
//           outline: none;
//         }
//       }

//       button {
//         margin-top: 0.5rem;
//         padding: 0.6rem 1.2rem;
//         background-color: #a9906b;
//         color: white;
//         border: none;
//         border-radius: 6px;
//         cursor: pointer;
//         transition: background-color 0.2s ease;

//         &:hover {
//           background-color: darken(#a9906b, 10%);
//         }

//         &:disabled {
//           background-color: #ccc;
//           cursor: not-allowed;
//         }
//       }

//       .error {
//         margin-top: 0.5rem;
//         color: red;
//         font-size: 0.9rem;
//       }
//     }

//     hr {
//       width: 100%;
//       border: none;
//       border-top: 1px solid #ccc;
//       margin: 1rem 0;
//     }
//   }
}
</style>

