<script setup lang="ts">
import { useIcons } from '../composables/use-icons'
import { useMessages } from '../composables/use-messages'
import { useColorModeControl } from '../internal/color-mode-control'
import Button from './Button.vue'

const { colorMode, isDark, isDisabled } = useColorModeControl()
const icons = useIcons()
const messages = useMessages()

function toggle() {
  if (isDisabled.value)
    return
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>

<template>
  <Button
    :icon="isDark ? icons.darkMode : icons.lightMode"
    variant="ghost"
    color="neutral"
    :aria-label="messages.colorModeToggle"
    :disabled="isDisabled"
    @click="toggle"
  />
</template>
