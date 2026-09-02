<script setup lang="ts">
const items = [
  { title: 'Account', description: 'Create your login' },
  { title: 'Profile', description: 'Tell us about yourself' },
  { title: 'Confirm', description: 'Review and finish' },
]
</script>

<template>
  <SStepper :items="items" orientation="vertical" :default-value="2" class="max-w-64" />
</template>
