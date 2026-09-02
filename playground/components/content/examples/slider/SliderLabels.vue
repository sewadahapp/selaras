<script setup lang="ts">
const value = ref(50)
</script>

<template>
  <div class="flex w-full items-center gap-3">
    <span class="text-sm text-[var(--ui-text-muted)]">Low</span>
    <SSlider v-model="value" aria-label="Priority" />
    <span class="text-sm text-[var(--ui-text-muted)]">High</span>
  </div>
</template>
