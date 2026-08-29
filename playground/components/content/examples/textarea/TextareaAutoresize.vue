<script setup lang="ts">
const value = ref('')
</script>

<template>
  <STextarea v-model="value" autoresize :maxrows="6" placeholder="Keep typing - this grows up to 6 rows, then scrolls..." />
</template>
