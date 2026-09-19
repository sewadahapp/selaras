<script setup lang="ts">
const value = ref(25)
</script>

<template>
  <div class="flex w-full items-center gap-3">
    <SSlider v-model="value" aria-label="Quantity" />
    <SInputNumber v-model="value" :min="0" :max="100" class="w-24 shrink-0" />
  </div>
</template>
