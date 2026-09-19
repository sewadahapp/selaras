<script setup lang="ts">
const value = ref(40)
</script>

<template>
  <div class="flex w-64 flex-col gap-3">
    <SProgress :model-value="value" />
    <div class="flex items-center gap-2">
      <SButton size="sm" variant="outline" @click="value = Math.max(0, value - 10)">
        -10
      </SButton>
      <SButton size="sm" variant="outline" @click="value = Math.min(100, value + 10)">
        +10
      </SButton>
    </div>
  </div>
</template>
