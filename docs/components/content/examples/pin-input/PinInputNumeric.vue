<script setup lang="ts">
const value = ref<number[]>([])
</script>

<template>
  <SPinInput v-model="value" type="number" aria-label="Numeric code" />
</template>
