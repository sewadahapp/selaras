<script setup lang="ts">
const userId = ref('')

const users = [
  { id: '1', fullName: 'Ada Lovelace' },
  { id: '2', fullName: 'Grace Hopper' },
  { id: '3', fullName: 'Margaret Hamilton' },
]
</script>

<template>
  <SSelect v-model="userId" placeholder="Pick a user" :items="users" label-key="fullName" value-key="id" />
</template>
