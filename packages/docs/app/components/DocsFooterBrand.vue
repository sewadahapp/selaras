<script setup lang="ts">
const appConfig = useAppConfig()
const text = computed(() => appConfig.selarasDocs?.footer?.text)
</script>

<template>
  <p v-if="text" class="selaras-docs-footer-text">
    {{ text }}
  </p>
</template>
