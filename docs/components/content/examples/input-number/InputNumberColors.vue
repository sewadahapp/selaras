<script setup lang="ts">
const primary = ref<number>()
const success = ref<number>()
const danger = ref<number>()
</script>

<template>
  <div class="flex flex-col items-start gap-4">
    <SInputNumber v-model="primary" color="primary" class="max-w-32" />
    <SInputNumber v-model="success" color="success" class="max-w-32" />
    <SInputNumber v-model="danger" color="danger" class="max-w-32" />
  </div>
</template>
