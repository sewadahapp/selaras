<script setup lang="ts">
const amount = ref('125')
</script>

<template>
  <SInput v-model="amount" inputmode="decimal" aria-label="Amount in rupiah" class="max-w-sm" :ui="{ trailing: 'pe-3' }">
    <template #leading>
      <span>Rp</span>
    </template>
    <template #trailing>
      <span>per month</span>
    </template>
  </SInput>
</template>
