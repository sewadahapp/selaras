<script setup lang="ts">
const items = ['Apple', 'Banana', 'Cherry']
const primary = ref()
const success = ref()
const danger = ref()
</script>

<template>
  <div class="flex w-full max-w-xs flex-col gap-4">
    <SSelect v-model="primary" :items="items" color="primary" placeholder="Primary" />
    <SSelect v-model="success" :items="items" color="success" placeholder="Success" />
    <SSelect v-model="danger" :items="items" color="danger" placeholder="Danger" />
  </div>
</template>
