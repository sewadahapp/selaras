<script setup lang="ts">
const airplaneMode = ref(true)
</script>

<template>
  <SSwitch
    v-model="airplaneMode"
    checked-icon="ph:airplane-tilt-fill"
    unchecked-icon="ph:airplane-tilt"
    label="Airplane mode"
  />
</template>
