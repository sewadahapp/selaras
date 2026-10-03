<script setup lang="ts">
definePageMeta({ layout: false })
const team = ref<string>()
</script>

<template>
  <main class="min-h-screen bg-[var(--selaras-resolved-surface-default)] p-6">
    <SSelect v-model="team" :items="['Design', 'Engineering', 'Support']" adaptive placeholder="Choose a team" />
  </main>
</template>
