<script setup lang="ts">
import { useCssModule } from "vue";
import LoginForm from '../components/LoginForm.vue'

const s = useCssModule()
</script>

<template>
<div :class="s.container">
    <login-form />
</div>
</template>

<style module lang='sass'>
.container
</style>