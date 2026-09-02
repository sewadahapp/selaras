<script setup lang="ts">
const primary = ref('')
const success = ref('')
const danger = ref('')
</script>

<template>
  <div class="flex w-full max-w-xs flex-col gap-4">
    <SInput v-model="primary" color="primary" placeholder="Primary" />
    <SInput v-model="success" color="success" placeholder="Success" />
    <SInput v-model="danger" color="danger" placeholder="Danger" />
  </div>
</template>
