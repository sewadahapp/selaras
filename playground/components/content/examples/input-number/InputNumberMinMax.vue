<script setup lang="ts">
const value = ref(4)
</script>

<template>
  <SInputNumber v-model="value" :min="0" :max="10" :step="2" class="max-w-32" />
</template>
