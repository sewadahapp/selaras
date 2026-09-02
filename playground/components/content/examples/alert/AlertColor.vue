<script setup lang="ts">
const alerts = [
  { color: 'success' as const, title: 'Success', description: 'Your changes have been saved.' },
  { color: 'danger' as const, title: 'Error', description: 'Something went wrong while saving.' },
  { color: 'warning' as const, title: 'Warning', description: 'This action can\'t be undone.' },
  { color: 'info' as const, title: 'Note', description: 'This feature is still in beta.' },
]
</script>

<template>
  <div class="flex w-full flex-col gap-3">
    <SAlert v-for="alert in alerts" :key="alert.color" :color="alert.color" :title="alert.title" :description="alert.description" />
  </div>
</template>
