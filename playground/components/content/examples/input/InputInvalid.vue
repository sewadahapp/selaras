<script setup lang="ts">
const email = ref('')
</script>

<template>
  <SInput v-model="email" invalid placeholder="you@example.com" class="max-w-xs" />
</template>
