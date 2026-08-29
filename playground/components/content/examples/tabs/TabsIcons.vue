<script setup lang="ts">
const active = ref('profile')
const items = [
  { label: 'Profile', value: 'profile', icon: 'ph:user' },
  { label: 'Settings', value: 'settings', icon: 'ph:gear' },
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
