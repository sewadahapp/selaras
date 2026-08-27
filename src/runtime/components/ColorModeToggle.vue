<script setup lang="ts">
import { computed } from 'vue'
import { useColorMode } from '#imports'
import { useIcons } from '../composables/use-icons'
import { useMessages } from '../composables/use-messages'
import Button from './Button.vue'

const colorMode = useColorMode()
const icons = useIcons()
const messages = useMessages()

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
    :aria-label="messages.colorModeToggle"
    @click="toggle"
  />
</template>
