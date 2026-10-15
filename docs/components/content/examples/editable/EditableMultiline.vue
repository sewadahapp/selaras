<script setup lang="ts">
const description = ref('A shared space for our components, patterns, and documentation.')
</script>

<template>
  <SFormField label="Project description" description="Enter adds a line. Ctrl/Cmd+Enter saves." class="w-full max-w-md">
    <SEditable v-model="description" multiline :rows="4" />
  </SFormField>
</template>
