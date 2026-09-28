<script setup lang="ts">
const logo = useDocsLogo()
</script>

<template>
  <template v-if="logo.light">
    <span
      v-if="logo.tint"
      role="img"
      :aria-label="logo.alt"
      class="selaras-docs-logo selaras-docs-logo--tinted"
      :style="{ '--selaras-docs-logo-mask': `url('${logo.light}')` }"
    />
    <template v-else>
      <img :src="logo.light" :alt="logo.alt" class="selaras-docs-logo" :class="{ 'selaras-docs-logo--light': logo.distinct }">
      <img v-if="logo.distinct" :src="logo.dark" :alt="logo.alt" class="selaras-docs-logo selaras-docs-logo--dark">
    </template>
  </template>
</template>
