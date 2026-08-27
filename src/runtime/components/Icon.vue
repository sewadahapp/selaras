<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { IconSlots } from '../theme/icon'
import type { UiProp } from '../utils/ui'
import { computed } from 'vue'
import { iconTheme } from '../theme/icon'
import { useComponentTheme, useRootProps } from '../utils/ui'

type IconVariants = VariantProps<typeof iconTheme>

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  /** Any name Nuxt Icon resolves, e.g. `lucide:star`. */
  name: string
  color?: IconVariants['color']
  ui?: UiProp<IconSlots>
}>()

const theme = useComponentTheme('icon', iconTheme)
const ui = computed(() => theme.value({ color: props.color }))

const rootProps = useRootProps(() => ui.value.base, () => props.ui?.base)
</script>

<template>
  <Icon :name="name" v-bind="rootProps" />
</template>
