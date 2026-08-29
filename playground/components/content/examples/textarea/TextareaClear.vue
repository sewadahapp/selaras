<script setup lang="ts">
const value = ref('Some text to clear')
</script>

<template>
  <STextarea v-model="value" clearable placeholder="Write something..." />
</template>
