<script setup lang="ts">
const sizes = ['sm', 'md', 'lg'] as const
</script>

<template>
  <div class="flex w-full flex-col gap-3">
    <SRating v-for="size in sizes" :key="size" :default-value="4" :size="size" :aria-label="size" />
  </div>
</template>
