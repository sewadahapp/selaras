<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { ContainerThemeSlots } from '../theme/container'
import type { UiProp } from '../utils/ui'
import { computed } from 'vue'
import { containerTheme } from '../theme/container'
import { useComponentTheme, useRootProps } from '../utils/ui'

type ContainerVariants = VariantProps<typeof containerTheme>

defineOptions({ inheritAttrs: false })

const props = defineProps<ContainerProps>()

export interface ContainerProps {
  size?: ContainerVariants['size']
  ui?: UiProp<ContainerThemeSlots>
}

const theme = useComponentTheme('container', containerTheme)

const ui = computed(() => theme.value({
  size: props.size,
}))

const rootProps = useRootProps(() => ui.value.base, () => props.ui?.base)
</script>

<template>
  <div v-bind="rootProps">
    <slot />
  </div>
</template>
