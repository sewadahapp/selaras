<script setup lang="ts">
const value = ref('')
</script>

<template>
  <STextarea v-model="value" icon="ph:chat-circle" placeholder="Leave a comment..." />
</template>
