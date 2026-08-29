<script setup lang="ts">
const value = ref('')
</script>

<template>
  <STextarea v-model="value" invalid placeholder="Write something..." />
</template>
