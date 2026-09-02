<script setup lang="ts">
const value = ref<string[]>([])
</script>

<template>
  <SPinInput v-model="value" otp :length="6" aria-label="SMS code" />
</template>
