<script setup lang="ts">
const people = [
  { id: 'ab', text: 'AB', color: 'primary' },
  { id: 'cd', text: 'CD', color: 'success' },
  { id: 'ef', text: 'EF', color: 'info' },
  { id: 'gh', text: 'GH', color: 'warning' },
] as const
</script>

<template>
  <SAvatarGroup :max="2">
    <SAvatar v-for="person in people" :key="person.id" :text="person.text" :color="person.color" />
  </SAvatarGroup>
</template>
