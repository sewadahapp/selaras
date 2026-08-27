<script setup lang="ts">
import { computed } from 'vue'
import { useColorMode } from '#imports'
import { useIcons } from '../composables/use-icons'
import Button from './Button.vue'

const colorMode = useColorMode()
const icons = useIcons()

const isDark = computed(() => colorMode.value === 'dark')

function toggle() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>

<template>
  <Button
    :icon="isDark ? icons.darkMode : icons.lightMode"
    variant="ghost"
    color="neutral"
    aria-label="Toggle color mode"
    @click="toggle"
  />
</template>
