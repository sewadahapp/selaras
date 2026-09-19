<script setup lang="ts">
const primary = ref(true)
const success = ref(true)
const danger = ref(true)
</script>

<template>
  <div class="flex flex-col gap-4">
    <SSwitch v-model="primary" color="primary" label="Primary" />
    <SSwitch v-model="success" color="success" label="Success" />
    <SSwitch v-model="danger" color="danger" label="Danger" />
  </div>
</template>
