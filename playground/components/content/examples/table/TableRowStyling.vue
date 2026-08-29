<script setup lang="ts">
interface Order {
  id: string
  customer: string
  total: number
  overdue: boolean
}

const orders = ref<Order[]>([
  { id: '#1001', customer: 'Alice Johnson', total: 42, overdue: false },
  { id: '#1002', customer: 'Bob Smith', total: 128, overdue: true },
  { id: '#1003', customer: 'Cara Lee', total: 76, overdue: false },
])

function rowClass(row: unknown) {
  return (row as Order).overdue ? 'bg-[var(--ui-danger-soft)]' : undefined
}
</script>

<template>
  <STable :data="orders" :row-class="rowClass">
    <SColumn field="id" header="Order" />
    <SColumn field="customer" header="Customer" />
    <SColumn field="total" header="Total" />
  </STable>
</template>
