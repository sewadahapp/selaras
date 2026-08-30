<script setup lang="ts">
const airplaneMode = ref(true)
</script>

<template>
  <SSwitch
    v-model="airplaneMode"
    checked-icon="hugeicons:airplane-mode"
    unchecked-icon="hugeicons:airplane-mode-off"
    label="Airplane mode"
  />
</template>
