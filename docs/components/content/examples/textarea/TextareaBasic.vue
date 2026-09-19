<script setup lang="ts">
const value = ref('')
</script>

<template>
  <STextarea v-model="value" placeholder="Write something..." />
</template>
