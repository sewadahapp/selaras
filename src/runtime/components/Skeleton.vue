<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { SkeletonThemeSlots } from '../theme/skeleton'
import type { UiProp } from '../utils/ui'
import { computed } from 'vue'
import { skeletonTheme } from '../theme/skeleton'
import { useComponentTheme, useRootProps } from '../utils/ui'

type SkeletonVariants = VariantProps<typeof skeletonTheme>

defineOptions({ inheritAttrs: false })

const props = defineProps<SkeletonProps>()

export interface SkeletonProps {
  /** @default 'pulse' */
  animation?: SkeletonVariants['animation']
  ui?: UiProp<SkeletonThemeSlots>
}

const theme = useComponentTheme('skeleton', skeletonTheme)
const ui = computed(() => theme.value({ animation: props.animation }))
const rootProps = useRootProps(() => ui.value.base, () => props.ui?.base)
</script>

<template>
  <div v-bind="rootProps" aria-hidden="true" />
</template>
