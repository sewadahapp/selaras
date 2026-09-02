<script setup lang="ts">
const value = ref(4)
</script>

<template>
  <div class="flex w-full flex-col gap-2">
    <SRating v-model="value" clearable aria-label="Rate your experience" />
    <p class="text-sm text-[var(--ui-text-muted)]">
      {{ value === 0 ? 'No rating' : `${value} out of 5` }} - click the current star again to clear
    </p>
  </div>
</template>
