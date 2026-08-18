<script setup lang="ts">
interface Employee {
  name: string
  age: number
  city: string
  department: string
}

const employees = ref<Employee[]>([
  { name: 'Alice Johnson', age: 29, city: 'New York', department: 'Engineering' },
  { name: 'Bob Smith', age: 34, city: 'Austin', department: 'Sales' },
  { name: 'Cara Lee', age: 41, city: 'Seattle', department: 'Engineering' },
])
</script>

<template>
  <STable :data="employees">
    <SColumn field="name" header="Name" />
    <SColumnGroup header="Details">
      <SColumn field="age" header="Age" />
      <SColumn field="city" header="City" />
      <SColumn field="department" header="Department" />
    </SColumnGroup>
  </STable>
</template>
