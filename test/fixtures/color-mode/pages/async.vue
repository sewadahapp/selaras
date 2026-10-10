<script setup>
await new Promise(resolve => setTimeout(resolve, import.meta.client ? 150 : 5))
</script>

<template>
  <AppearanceControls />
</template>
