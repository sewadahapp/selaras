<script setup lang="ts">
const files = ref<File[]>([])
</script>

<template>
  <SFileUpload v-model="files" multiple :max-files="4" class="max-w-md" />
</template>
