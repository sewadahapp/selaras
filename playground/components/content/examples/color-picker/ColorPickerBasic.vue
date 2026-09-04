<script setup lang="ts">
const color = ref('#7c3aed')
</script>

<template>
  <div class="flex w-full flex-col gap-2">
    <SColorPicker v-model="color" />
    <p class="text-sm text-[var(--ui-text-muted)]">
      {{ color }}
    </p>
  </div>
</template>
