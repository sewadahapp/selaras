<script setup lang="ts">
const accepted = ref(true)
</script>

<template>
  <SCheckbox v-model="accepted" label="Accept terms" />
</template>
