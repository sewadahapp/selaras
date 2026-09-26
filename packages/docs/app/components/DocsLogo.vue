<script setup lang="ts">
const logo = useDocsLogo()
</script>

<template>
  <template v-if="logo.light">
    <img :src="logo.light" :alt="logo.alt" class="selaras-docs-logo" :class="{ 'selaras-docs-logo--light': logo.distinct }">
    <img v-if="logo.distinct" :src="logo.dark" :alt="logo.alt" class="selaras-docs-logo selaras-docs-logo--dark">
  </template>
</template>
