<script setup lang="ts">
interface Employee { id: number, name: string, department: string, email: string, phone: string, city: string, actions: string }

const employees = ref<Employee[]>(
  Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: `Employee ${i + 1}`,
    department: 'Engineering',
    email: `employee${i + 1}@example.com`,
    phone: '+1 555 0100',
    city: 'San Francisco',
    actions: '',
  })),
)
</script>

<template>
  <STable :data="employees" scroll-height="16rem">
    <SColumn field="name" header="Name" pinned="left" />
    <SColumn field="department" header="Department" />
    <SColumn field="email" header="Email" />
    <SColumn field="phone" header="Phone" />
    <SColumn field="city" header="City" />
    <SColumn field="actions" header="Actions" pinned="right" />
  </STable>
</template>
