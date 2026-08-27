<script setup lang="ts">
const shipping = ref('standard')
</script>

<template>
  <SRadioGroup
    v-model="shipping"
    :items="[
      { label: 'Standard', value: 'standard' },
      { label: 'Express', value: 'express', disabled: true },
      { label: 'Overnight', value: 'overnight' },
    ]"
  />
</template>
