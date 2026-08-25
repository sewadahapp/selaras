<script setup lang="ts">
interface Employee {
  id: number
  name: string
  department: string
  role: string
  email: string
  phone: string
  city: string
  startDate: string
  actions: string
}

const employees = ref<Employee[]>(
  Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: `Employee ${i + 1}`,
    department: 'Engineering',
    role: 'Software Engineer',
    email: `employee${i + 1}@example.com`,
    phone: '+1 555 0100',
    city: 'San Francisco',
    startDate: '2023-01-15',
    actions: '',
  })),
)
</script>

<template>
  <STable :data="employees" scroll-height="16rem" :ui="{ table: 'min-w-[960px]' }">
    <SColumn field="name" header="Name" pinned="left" />
    <SColumn field="department" header="Department" />
    <SColumn field="role" header="Role" />
    <SColumn field="email" header="Email" />
    <SColumn field="phone" header="Phone" />
    <SColumn field="city" header="City" />
    <SColumn field="startDate" header="Start date" />
    <SColumn field="actions" header="Actions" sortable="false" pinned="right">
      <template #default>
        <div class="flex gap-2">
          <SButton variant="outline" size="sm">
            Edit
          </SButton>
          <SButton variant="outline" size="sm">
            Delete
          </SButton>
        </div>
      </template>
    </SColumn>
  </STable>
</template>
