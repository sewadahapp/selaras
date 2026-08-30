<script setup lang="ts">
const search = ref('')
const amount = ref('')
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <SInput v-model="search" icon="hugeicons:search-01" placeholder="Search..." class="max-w-xs" />
    <SInput v-model="amount" trailing-icon="hugeicons:dollar-01" placeholder="0.00" class="max-w-xs" />
  </div>
</template>
