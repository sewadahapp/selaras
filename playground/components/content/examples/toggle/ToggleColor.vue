<script setup lang="ts">
const colors = ['primary', 'neutral', 'secondary', 'success', 'danger', 'info', 'warning'] as const
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <SToggle v-for="color in colors" :key="color" :color="color" default-value>
      {{ color }}
    </SToggle>
  </div>
</template>
