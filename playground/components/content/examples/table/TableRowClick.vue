<script setup lang="ts">
interface User {
  name: string
  email: string
  role: string
}

const users = ref<User[]>([
  { name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
  { name: 'Bob Smith', email: 'bob@example.com', role: 'Member' },
  { name: 'Cara Lee', email: 'cara@example.com', role: 'Member' },
])

const selected = ref<User>()

function onRowClick(row: unknown) {
  selected.value = row as User
}
</script>

<template>
  <div class="flex w-full flex-col gap-3">
    <STable :data="users" @row-click="onRowClick">
      <SColumn field="name" header="Name" />
      <SColumn field="email" header="Email" />
      <SColumn field="role" header="Role" />
    </STable>
    <p v-if="selected" class="text-sm text-[var(--ui-text-muted)]">
      Selected: {{ selected.name }}
    </p>
  </div>
</template>
