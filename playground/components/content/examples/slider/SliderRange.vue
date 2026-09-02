<script setup lang="ts">
const priceRange = ref([20, 80])
</script>

<template>
  <div class="flex w-full flex-col gap-2">
    <SSlider v-model="priceRange" :min-steps-between-thumbs="5" :aria-label="['Minimum price', 'Maximum price']" />
    <p class="text-sm text-[var(--ui-text-muted)]">
      ${{ priceRange[0] }} - ${{ priceRange[1] }}
    </p>
  </div>
</template>
