<script setup lang="ts">
const page = ref(1)
</script>

<template>
  <SPagination v-model:page="page" :total="50" :items-per-page="10" color="primary" variant="outline" active-color="danger" active-variant="solid" />
</template>
