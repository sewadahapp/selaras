<script setup lang="ts">
const sm = ref(true)
const md = ref(true)
const lg = ref(true)
</script>

<template>
  <div class="flex items-center gap-4">
    <SSwitch v-model="sm" size="sm" label="Small" />
    <SSwitch v-model="md" size="md" label="Medium" />
    <SSwitch v-model="lg" size="lg" label="Large" />
  </div>
</template>
