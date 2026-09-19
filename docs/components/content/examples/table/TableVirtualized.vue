<script setup lang="ts">
const rows = ref(Array.from({ length: 10000 }, (_, i) => ({ id: i + 1, name: `Row ${i + 1}` })))
</script>

<template>
  <STable :data="rows" scroll-height="16rem" virtualize>
    <SColumn field="id" header="ID" />
    <SColumn field="name" header="Name" />
  </STable>
</template>
