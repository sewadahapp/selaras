<script setup lang="ts">
import type { HeaderThemeSlots } from '../theme/header'
import type { UiProp } from '../utils/ui'
import { computed } from 'vue'
import { headerTheme } from '../theme/header'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'

defineOptions({ inheritAttrs: false })

const props = defineProps<HeaderProps>()

export interface HeaderProps {
  ui?: UiProp<HeaderThemeSlots>
}

const theme = useComponentTheme('header', headerTheme)
const ui = computed(() => theme.value())

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
</script>

<template>
  <header v-bind="rootProps">
    <div v-bind="resolveSlot(ui.left, props.ui?.left)">
      <slot />
    </div>
    <div v-if="$slots.right" v-bind="resolveSlot(ui.right, props.ui?.right)">
      <slot name="right" />
    </div>
  </header>
</template>
