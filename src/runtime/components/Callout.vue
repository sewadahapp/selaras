<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { CalloutThemeSlots } from '../theme/callout'
import type { IconRegistry } from '../utils/icons'
import type { UiProp } from '../utils/ui'
import { computed } from 'vue'
import { useIcons } from '../composables/use-icons'
import { calloutTheme } from '../theme/callout'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import Icon from './Icon.vue'

type CalloutVariants = VariantProps<typeof calloutTheme>

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<CalloutProps>(), {
  // Vue's compiler-inferred runtime prop type for `string | false` includes
  // Boolean (since `false` is a boolean literal) - without this, an omitted
  // `icon` casts to `false` instead of staying `undefined`, the same
  // absent-Boolean-prop gotcha Button.vue's own `square` prop works around.
  icon: undefined,
})

defineSlots<CalloutSlots>()

export interface CalloutProps {
  /** @default 'note' */
  type?: CalloutVariants['type']
  title?: string
  /** Falls back to the type's own default icon (info/success/warning/danger) - pass `false` to render no icon at all. */
  icon?: string | false
  ui?: UiProp<CalloutThemeSlots>
}

export interface CalloutSlots {
  title?: () => any
  default?: () => any
}

const icons = useIcons()

// Reuses the same semantic icons Alert falls back to per color (see
// icons.ts) - `note`/`tip`/`danger` read better than `info`/`success`/
// `danger` as markdown admonition labels, but they still map onto exactly
// the same status glyphs the rest of the library already uses.
const DEFAULT_ICON: Record<NonNullable<CalloutVariants['type']>, keyof IconRegistry> = {
  note: 'info',
  tip: 'success',
  warning: 'warning',
  danger: 'danger',
}

const iconName = computed(() => {
  if (props.icon === false)
    return undefined
  return props.icon ?? icons.value[DEFAULT_ICON[props.type ?? 'note']]
})

const theme = useComponentTheme('callout', calloutTheme)
const ui = computed(() => theme.value({ type: props.type }))

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
const iconProps = computed(() => resolveSlot(ui.value.icon, props.ui?.icon))
const contentProps = computed(() => resolveSlot(ui.value.content, props.ui?.content))
const titleProps = computed(() => resolveSlot(ui.value.title, props.ui?.title))
</script>

<template>
  <div v-bind="rootProps" role="note">
    <Icon v-if="iconName" :name="iconName" v-bind="iconProps" />
    <div v-bind="contentProps">
      <p v-if="title || $slots.title" v-bind="titleProps">
        <slot name="title">
          {{ title }}
        </slot>
      </p>
      <slot />
    </div>
  </div>
</template>
