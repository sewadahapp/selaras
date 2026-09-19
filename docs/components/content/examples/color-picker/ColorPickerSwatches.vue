<script setup lang="ts">
const color = ref('#ef4444')
const swatches = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#7c3aed', '#ec4899', '#000000']
</script>

<template>
  <SColorPicker v-model="color" :swatches="swatches" />
</template>
