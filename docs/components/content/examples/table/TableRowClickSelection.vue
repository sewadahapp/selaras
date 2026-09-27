<script setup lang="ts">
interface User {
  name: string
  email: string
  role: string
}

const users: User[] = [
  { name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
  { name: 'Bob Smith', email: 'bob@example.com', role: 'Member' },
  { name: 'Cara Lee', email: 'cara@example.com', role: 'Member' },
]

const rowSelection = ref<Record<string, true>>({})
const selectedUsers = computed(() => users.filter(user => rowSelection.value[user.email]))
</script>

<template>
  <div class="flex w-full flex-col gap-3">
    <STable
      v-model:row-selection="rowSelection"
      :data="users"
      :get-row-id="user => user.email"
      selectable
      select-on-row-click
      row-hover
    >
      <SColumn field="name" header="Name" />
      <SColumn field="email" header="Email" />
      <SColumn field="role" header="Role" />
    </STable>
    <p class="text-sm text-[var(--selaras-resolved-text-muted)]">
      Selected: {{ selectedUsers.length ? selectedUsers.map(user => user.name).join(', ') : 'none' }}
    </p>
  </div>
</template>
