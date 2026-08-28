<script setup lang="ts">
const hour = ref(12)
</script>

<template>
  <SInputNumber v-model="hour" :min="1" :max="12" wrap class="max-w-32" />
</template>
