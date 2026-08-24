<script setup lang="ts">
const loading = ref(true)

const users = ref([{ name: 'Alice Johnson', email: 'alice@example.com' }])
</script>

<template>
  <STable :data="users" :loading="loading">
    <SColumn field="name" header="Name" />
    <SColumn field="email" header="Email" />
  </STable>
</template>
