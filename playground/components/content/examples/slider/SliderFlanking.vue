<script setup lang="ts">
const value = ref(50)
</script>

<template>
  <div class="flex w-full flex-col gap-2">
    <SSlider v-model="value" aria-label="Rate your experience">
      <template #start>
        😞
      </template>
      <template #end>
        😄
      </template>
    </SSlider>
    <p class="text-center text-sm text-[var(--ui-text-muted)]">
      {{ value < 33 ? 'Not great' : value < 67 ? 'Okay' : 'Great' }}
    </p>
  </div>
</template>
