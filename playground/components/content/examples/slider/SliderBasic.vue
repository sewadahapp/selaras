<script setup lang="ts">
const value = ref(30)
</script>

<template>
  <div class="flex w-full flex-col gap-2">
    <SSlider v-model="value" aria-label="Volume" />
    <p class="text-sm text-[var(--ui-text-muted)]">
      {{ value }}
    </p>
  </div>
</template>
