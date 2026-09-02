<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { InputGroupThemeSlots } from '../theme/input-group'
import type { UiProp } from '../utils/ui'
import { computed } from 'vue'
import { inputGroupTheme } from '../theme/input-group'
import { useComponentTheme, useRootProps } from '../utils/ui'

type InputGroupVariants = VariantProps<typeof inputGroupTheme>

defineOptions({ inheritAttrs: false })

const props = defineProps<InputGroupProps>()

export interface InputGroupProps {
  orientation?: InputGroupVariants['orientation']
  ui?: UiProp<InputGroupThemeSlots>
}

const theme = useComponentTheme('inputGroup', inputGroupTheme)
const ui = computed(() => theme.value({
  orientation: props.orientation,
}))

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
</script>

<template>
  <div v-bind="rootProps">
    <slot />
  </div>
</template>
