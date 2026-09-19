<script setup lang="ts">
const tight = ref(10)
const wide = ref(10)
const noEdges = ref(10)
</script>

<template>
  <div class="flex flex-col items-start gap-4">
    <SPagination v-model:page="tight" :total="200" :items-per-page="10" :sibling-count="1" />
    <SPagination v-model:page="wide" :total="200" :items-per-page="10" :sibling-count="3" />
    <SPagination v-model:page="noEdges" :total="200" :items-per-page="10" :sibling-count="1" :show-edges="false" />
  </div>
</template>
