<script setup lang="ts">
const colorMode = useColorMode()

function toggle() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <SButton
    variant="ghost"
    color="neutral"
    aria-label="Toggle color mode"
    @click="toggle"
  >
    Theme
  </SButton>
</template>
