<script setup lang="ts">
const tableRef = ref()

const users = ref([
  { name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
  { name: 'Bob Smith', email: 'bob@example.com', role: 'Member' },
])
</script>

<template>
  <div class="flex flex-col gap-3">
    <SButton variant="outline" size="sm" icon="ph:download" class="self-end" @click="tableRef.exportCsv('users.csv')">
      Export CSV
    </SButton>
    <STable ref="tableRef" :data="users">
      <SColumn field="name" header="Name" />
      <SColumn field="email" header="Email" />
      <SColumn field="role" header="Role" />
    </STable>
  </div>
</template>
