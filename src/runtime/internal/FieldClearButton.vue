<script setup lang="ts">
import type { ButtonThemeSlots } from '../theme/button'
import type { UiProp } from '../utils/ui'
import { computed } from 'vue'
import Button from '../components/Button.vue'
import Icon from '../components/Icon.vue'
import { useIcons } from '../composables/use-icons'
import { useMessages } from '../composables/use-messages'
import { fieldClearButtonTheme } from '../theme/field-clear-button'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'

defineOptions({ inheritAttrs: false })
const props = defineProps<{
  size?: 'sm' | 'md' | 'lg'
  ui?: UiProp<ButtonThemeSlots>
}>()
const theme = useComponentTheme('fieldClearButton', fieldClearButtonTheme)
const ui = computed(() => theme.value({ size: props.size }))
const rootProps = useRootProps(() => ui.value.base, () => props.ui?.base)
const iconProps = computed(() => resolveSlot(ui.value.icon, props.ui?.leadingIcon))
const icons = useIcons()
const messages = useMessages()
</script>

<template>
  <Button :size="size" variant="ghost" color="neutral" square :aria-label="messages.clear" v-bind="rootProps" :ui="{ leadingIcon: iconProps }" @mousedown.prevent>
    <template #icon="{ class: iconClass }">
      <slot :class="iconClass">
        <Icon :name="icons.close" :class="iconClass" />
      </slot>
    </template>
  </Button>
</template>
