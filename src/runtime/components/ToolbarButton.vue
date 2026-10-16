<script setup lang="ts">
import type { ButtonProps } from './Button.vue'
import { ToolbarButton } from 'reka-ui'
import { computed, inject } from 'vue'
import { toolbarButtonTheme } from '../theme/toolbar-button'
import { TOOLBAR_CONTEXT } from '../utils/toolbar'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import Button from './Button.vue'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<ToolbarButtonProps>(), { pressed: undefined, square: undefined })
defineSlots<ToolbarButtonSlots>()

export interface ToolbarButtonProps extends ButtonProps {
  /** Formatting state owned by the editor; omitted for ordinary actions. */
  pressed?: boolean
  /** Composes a custom trigger into the toolbar's keyboard navigation. */
  asChild?: boolean
}
export interface ToolbarButtonSlots { default?: () => any }

const toolbar = inject(TOOLBAR_CONTEXT, undefined)
const disabled = computed(() => props.disabled || toolbar?.value.disabled)
const size = computed(() => props.size ?? toolbar?.value.size ?? 'sm')
const color = computed(() => props.color ?? toolbar?.value.color ?? 'primary')
const theme = useComponentTheme('toolbarButton', toolbarButtonTheme)
const ui = computed(() => theme.value({ size: size.value, variant: props.variant ?? 'ghost' }))
const rootProps = useRootProps(() => ui.value.base, () => props.ui?.base)
</script>

<template>
  <ToolbarButton as-child :disabled="disabled" :aria-pressed="pressed" :data-state="pressed === undefined ? undefined : pressed ? 'on' : 'off'" v-bind="rootProps">
    <slot v-if="asChild" />
    <Button v-else v-bind="as ? { as } : {}" :to="to" :type="type" :disabled="disabled" :size="size" :color="color" :variant="variant ?? 'ghost'" :icon="icon" :trailing-icon="trailingIcon" :square="square" :loading="loading" :raised="raised" :block="block" :ui="{ leadingIcon: resolveSlot(ui.leadingIcon, props.ui?.leadingIcon), trailingIcon: resolveSlot(ui.trailingIcon, props.ui?.trailingIcon) }">
      <template v-if="$slots.default" #default>
        <slot />
      </template>
    </Button>
  </ToolbarButton>
</template>
