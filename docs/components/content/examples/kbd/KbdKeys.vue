<script setup lang="ts">
const keys = ['meta', 'shift', 'alt', 'ctrl', 'enter', 'backspace', 'escape', 'up', 'down', 'left', 'right']
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <SKbd v-for="key in keys" :key="key" :value="key" />
  </div>
</template>
