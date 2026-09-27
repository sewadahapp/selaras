<script setup lang="ts">
const items = [
  { id: 'submitted', date: '9:15 AM', title: 'Request submitted', icon: 'hugeicons:file-01' },
  { id: 'reviewed', date: '10:30 AM', title: 'Review completed', icon: 'hugeicons:checkmark-circle-01', color: 'success' as const },
  { id: 'released', date: '11:05 AM', title: 'Access granted', icon: 'hugeicons:rocket-01', color: 'info' as const },
]
</script>

<template>
  <STimeline :items="items" />
</template>
