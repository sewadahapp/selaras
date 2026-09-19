<script setup lang="ts">
const files = ref<File[]>([])
</script>

<template>
  <SFileUpload v-model="files" class="max-w-md" />
</template>
