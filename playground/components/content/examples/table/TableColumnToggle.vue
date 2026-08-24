<script setup lang="ts">
interface User { name: string, email: string, role: string }

const users = ref<User[]>([
  { name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
  { name: 'Bob Smith', email: 'bob@example.com', role: 'Member' },
])
</script>

<template>
  <STable :data="users" column-toggle>
    <SColumn field="name" header="Name" />
    <SColumn field="email" header="Email" />
    <SColumn field="role" header="Role" />
  </STable>
</template>
