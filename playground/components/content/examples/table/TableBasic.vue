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
  { name: 'Dave Kim', email: 'dave@example.com', role: 'Viewer' },
  { name: 'Eve Torres', email: 'eve@example.com', role: 'Admin' },
])

const rowSelection = ref({})
const globalFilter = ref('')
</script>

<template>
  <div class="flex w-full flex-col gap-3">
    <SInput v-model="globalFilter" placeholder="Search users..." class="max-w-64" />
    <STable
      v-model:row-selection="rowSelection"
      v-model:global-filter="globalFilter"
      :data="users"
      selectable
      :page-size="3"
    >
      <SColumn field="name" header="Name" filterable />
      <SColumn field="email" header="Email" />
      <SColumn field="role" header="Role" />
    </STable>
  </div>
</template>
