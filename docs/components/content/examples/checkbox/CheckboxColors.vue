<script setup lang="ts">
const primary = ref(true)
const success = ref(true)
const danger = ref(true)
</script>

<template>
  <div class="flex flex-col gap-4">
    <SCheckbox v-model="primary" color="primary" label="Primary" />
    <SCheckbox v-model="success" color="success" label="Success" />
    <SCheckbox v-model="danger" color="danger" label="Danger" />
  </div>
</template>
