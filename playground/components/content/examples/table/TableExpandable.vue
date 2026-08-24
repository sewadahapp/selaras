<script setup lang="ts">
interface Order { id: number, customer: string, total: string, items: string[] }

const orders = ref<Order[]>([
  { id: 1001, customer: 'Alice Johnson', total: '$120.00', items: ['Widget A', 'Widget B'] },
  { id: 1002, customer: 'Bob Smith', total: '$45.50', items: ['Gadget C'] },
])
</script>

<template>
  <STable :data="orders" expandable>
    <SColumn field="id" header="Order" />
    <SColumn field="customer" header="Customer" />
    <SColumn field="total" header="Total" />
    <template #expanded="{ row }">
      <strong>Items:</strong> {{ row.items.join(', ') }}
    </template>
  </STable>
</template>
