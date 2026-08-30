<script setup lang="ts">
const items = ['Apple', 'Banana', 'Cherry']
const primary = ref()
const success = ref()
const danger = ref()
</script>

<template>
  <div class="flex flex-col gap-4 max-w-xs">
    <SSelect v-model="primary" :items="items" color="primary" placeholder="Primary" />
    <SSelect v-model="success" :items="items" color="success" placeholder="Success" />
    <SSelect v-model="danger" :items="items" color="danger" placeholder="Danger" />
  </div>
</template>
