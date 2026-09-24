<script setup lang="ts">
const active = ref('account')
const items = [
  { label: 'Account', value: 'account' },
  { label: 'Security', value: 'security' },
  { label: 'Notifications', value: 'notifications' },
]
</script>

<template>
  <STabs v-model="active" :items="items" orientation="vertical" variant="pill" class="max-w-xl">
    <template #account>
      Manage your account details.
    </template>
    <template #security>
      Review your security settings.
    </template>
    <template #notifications>
      Choose which notifications you receive.
    </template>
  </STabs>
</template>
