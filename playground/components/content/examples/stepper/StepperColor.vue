<script setup lang="ts">
const colors = ['primary', 'neutral', 'secondary', 'success', 'danger', 'info', 'warning'] as const
const items = [{ title: 'One' }, { title: 'Two' }, { title: 'Three' }]
</script>

<template>
  <div class="flex w-full flex-col gap-6">
    <SStepper v-for="color in colors" :key="color" :items="items" :color="color" :default-value="2" />
  </div>
</template>
