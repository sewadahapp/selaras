<script setup lang="ts">
const variants = ['solid', 'soft', 'outline'] as const
</script>

<template>
  <div class="flex w-full flex-col gap-3">
    <SAlert
      v-for="variant in variants"
      :key="variant"
      color="success"
      :variant="variant"
      title="Payment received"
      description="Your subscription is now active."
    />
  </div>
</template>
