<script setup lang="ts">
const size = ref('md')
</script>

<template>
  <SRadioGroup v-model="size" :items="['sm', 'md', 'lg']" />
</template>
