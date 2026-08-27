<script setup lang="ts">
const page = ref(10)
</script>

<template>
  <SPagination v-model:page="page" :total="200" :items-per-page="10" show-first-last />
</template>
