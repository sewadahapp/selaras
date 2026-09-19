<script setup lang="ts">
const value = ref('')
</script>

<template>
  <STextarea v-model="value" icon="hugeicons:chat" placeholder="Leave a comment..." />
</template>
