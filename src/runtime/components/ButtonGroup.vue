<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { ButtonGroupSlots } from '../theme/button-group'
import type { UiProp } from '../utils/ui'
import { computed } from 'vue'
import { buttonGroupTheme } from '../theme/button-group'
import { useComponentTheme, useRootProps } from '../utils/ui'

type ButtonGroupVariants = VariantProps<typeof buttonGroupTheme>

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  orientation?: ButtonGroupVariants['orientation']
  ui?: UiProp<ButtonGroupSlots>
}>()

const theme = useComponentTheme('buttonGroup', buttonGroupTheme)
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
