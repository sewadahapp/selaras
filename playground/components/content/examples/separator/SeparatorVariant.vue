<script setup lang="ts">
const variants = ['solid', 'dashed', 'dotted', 'double'] as const
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <SSeparator v-for="variant in variants" :key="variant" :variant="variant" />
  </div>
</template>
