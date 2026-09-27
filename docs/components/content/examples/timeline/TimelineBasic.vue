<script setup lang="ts">
const items = [
  { id: 'created', date: '9:15 AM', title: 'Request created', description: 'A new access request was submitted.' },
  { id: 'review', date: '10:30 AM', title: 'Manager review', description: 'The request was approved by Maya.' },
  { id: 'complete', date: '11:05 AM', title: 'Access granted', description: 'The team workspace is ready to use.', color: 'success' as const },
]
</script>

<template>
  <STimeline :items="items" />
</template>
