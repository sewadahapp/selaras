<script setup lang="ts">
const page = ref(1)
</script>

<template>
  <SPagination
    v-model:page="page"
    :total="120"
    :items-per-page="10"
    :to="(p) => `#page-${p}`"
  />
</template>
