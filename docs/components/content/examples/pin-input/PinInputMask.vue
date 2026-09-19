<script setup lang="ts">
const value = ref<string[]>([])
</script>

<template>
  <SPinInput v-model="value" mask aria-label="PIN code" />
</template>
