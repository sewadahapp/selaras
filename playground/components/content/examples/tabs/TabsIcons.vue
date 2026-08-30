<script setup lang="ts">
const active = ref('profile')
const items = [
  { label: 'Profile', value: 'profile', icon: 'hugeicons:user' },
  { label: 'Settings', value: 'settings', icon: 'hugeicons:settings-01' },
]
</script>

<template>
  <STabs v-model="active" :items="items">
    <template #profile>
      Profile details.
    </template>
    <template #settings>
      Account settings.
    </template>
  </STabs>
</template>
