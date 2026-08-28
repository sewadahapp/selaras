<script setup lang="ts">
const value = ref(5)
</script>

<template>
  <SInputNumber v-model="value" orientation="vertical" class="max-w-32" />
</template>
