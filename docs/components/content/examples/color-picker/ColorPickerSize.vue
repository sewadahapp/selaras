<script setup lang="ts">
const color = ref('#0ea5e9')
</script>

<template>
  <div class="flex items-center gap-3">
    <SColorPicker v-model="color" size="sm" />
    <SColorPicker v-model="color" size="md" />
    <SColorPicker v-model="color" size="lg" />
  </div>
</template>
