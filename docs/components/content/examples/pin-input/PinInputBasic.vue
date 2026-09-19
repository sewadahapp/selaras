<script setup lang="ts">
const value = ref<string[]>([])
</script>

<template>
  <SPinInput v-model="value" aria-label="Verification code" />
</template>
