<script setup lang="ts">
const value = ref('Clear me')
</script>

<template>
  <SInput v-model="value" clearable placeholder="Type something..." class="max-w-xs" />
</template>
