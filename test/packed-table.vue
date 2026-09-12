<script setup lang="ts">
import type { TableColumnDef } from '@sewadah/selaras/types'
import STable from '@sewadah/selaras/components/Table.vue'

interface User {
  id: string
  name: string
  age: number
}

const users: User[] = [{ id: 'user-a', name: 'Alice', age: 30 }]
const columns: TableColumnDef<User>[] = [{ accessorKey: 'name', header: 'Name' }]
const getRowId = (row: User) => row.id
const getRowClass = (row: User) => row.age >= 18 ? 'adult' : undefined
const handleRowClick = (row: User) => row.name.toUpperCase()
</script>

<template>
  <STable
    :data="users"
    :columns="columns"
    :get-row-id="getRowId"
    :row-class="getRowClass"
    @row-click="handleRowClick"
  >
    <template #expanded="{ row }">
      {{ row.age.toFixed(0) }}
    </template>
  </STable>
</template>
