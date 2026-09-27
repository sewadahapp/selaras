<script setup lang="ts">
const items = [
  { id: 'plan', date: 'May', title: 'Plan' },
  { id: 'build', date: 'June', title: 'Build' },
  { id: 'launch', date: 'July', title: 'Launch' },
]
</script>

<template>
  <STimeline :items="items" orientation="horizontal" align="alternate" />
</template>
