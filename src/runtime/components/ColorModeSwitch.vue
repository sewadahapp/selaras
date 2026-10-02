<script setup lang="ts">
import type { SwitchProps } from './Switch.vue'
import { computed, useAttrs, useSlots } from 'vue'
import { useColorMode } from '#imports'
import { useIcons } from '../composables/use-icons'
import { useMessages } from '../composables/use-messages'
import Switch from './Switch.vue'

export interface ColorModeSwitchProps extends Pick<SwitchProps, 'id' | 'label' | 'description' | 'size' | 'color' | 'disabled' | 'checkedIcon' | 'uncheckedIcon' | 'ui'> {}

defineOptions({ inheritAttrs: false })
const props = defineProps<ColorModeSwitchProps>()
const attrs = useAttrs()
const slots = useSlots()
const colorMode = useColorMode()
const icons = useIcons()
const messages = useMessages()
const isDark = computed(() => colorMode.value === 'dark')
const switchUi = computed(() => {
  const track = typeof props.ui?.track === 'string' ? { class: props.ui.track } : props.ui?.track
  return {
    ...props.ui,
    track: {
      'aria-label': attrs['aria-label'] ?? (props.label || slots.default ? undefined : messages.value.colorModeToggle),
      'aria-labelledby': attrs['aria-labelledby'],
      'aria-describedby': attrs['aria-describedby'],
      ...track,
    },
  }
})

function updateMode(dark: boolean) {
  colorMode.preference = dark ? 'dark' : 'light'
}
</script>

<template>
  <Switch
    v-bind="{ ...attrs, ...props }"
    :model-value="isDark"
    :disabled="disabled || colorMode.forced"
    :checked-icon="checkedIcon ?? icons.darkMode"
    :unchecked-icon="uncheckedIcon ?? icons.lightMode"
    :ui="switchUi"
    @update:model-value="updateMode"
  >
    <template v-if="$slots.default" #default>
      <slot />
    </template>
    <template v-if="$slots.description" #description>
      <slot name="description" />
    </template>
  </Switch>
</template>
