<script setup lang="ts">
const preset = useDocsThemePreset()
const colorMode = useColorMode()
</script>

<template>
  <DocsViewportPreview
    src="/examples/adaptive-interfaces"
    title="Adaptive interfaces interactive preview"
    :reload-key="`${preset}:${colorMode.value}`"
  />
</template>
