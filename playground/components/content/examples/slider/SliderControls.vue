<script setup lang="ts">
const value = ref(105)
</script>

<template>
  <div class="flex w-full flex-col gap-2">
    <p class="text-sm text-[var(--ui-text-muted)]">
      {{ value }} credits/mo
    </p>
    <SSlider v-model="value" :min="0" :max="500" :step="5" controls aria-label="Credits per month" />
  </div>
</template>
