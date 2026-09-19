<script setup lang="ts">
const value = ref<number>()
</script>

<template>
  <SInputNumber v-model="value" class="max-w-32" />
</template>
