<script setup lang="ts">
const sm = ref<number>()
const disabled = ref(3)
const invalid = ref<number>()
</script>

<template>
  <div class="flex flex-col items-start gap-4">
    <SInputNumber v-model="sm" size="sm" class="max-w-32" />
    <SInputNumber v-model="disabled" disabled class="max-w-32" />
    <SInputNumber v-model="invalid" invalid class="max-w-32" />
  </div>
</template>
