<script setup lang="ts">
const shipping = ref('standard')
</script>

<template>
  <SRadioGroup v-model="shipping" orientation="horizontal" :items="['standard', 'express', 'overnight']" />
</template>
