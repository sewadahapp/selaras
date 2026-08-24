<script setup lang="ts">
const value = ref('')
</script>

<template>
  <SInput v-model="value" placeholder="Type something..." class="max-w-xs" />
</template>
