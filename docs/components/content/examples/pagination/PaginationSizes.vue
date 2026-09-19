<script setup lang="ts">
const sm = ref(2)
const md = ref(2)
const lg = ref(2)
</script>

<template>
  <div class="flex flex-col items-start gap-4">
    <SPagination v-model:page="sm" size="sm" :total="50" :items-per-page="10" />
    <SPagination v-model:page="md" size="md" :total="50" :items-per-page="10" />
    <SPagination v-model:page="lg" size="lg" :total="50" :items-per-page="10" />
  </div>
</template>
