<script setup lang="ts">
import { computed } from 'vue'
import { useColorMode } from '#imports'
import Button from './Button.vue'

const colorMode = useColorMode()

const isDark = computed(() => colorMode.value === 'dark')

function toggle() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>

<template>
  <Button
    :icon="isDark ? 'lucide:moon' : 'lucide:sun'"
    variant="ghost"
    color="neutral"
    aria-label="Toggle color mode"
    @click="toggle"
  />
</template>
