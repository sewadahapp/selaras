<script setup lang="ts">
const items = [
  { title: 'Account', icon: 'hugeicons:user' },
  { title: 'Preferences', icon: 'hugeicons:settings-01' },
  { title: 'Billing', icon: 'hugeicons:credit-card' },
]
</script>

<template>
  <SStepper :items="items" :default-value="2" />
</template>
