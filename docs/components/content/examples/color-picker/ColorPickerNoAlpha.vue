<script setup lang="ts">
const color = ref('#22c55e')
</script>

<template>
  <SColorPicker v-model="color" :alpha="false" />
</template>
