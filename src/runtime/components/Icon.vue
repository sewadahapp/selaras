<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { IconThemeSlots } from '../theme/icon'
import type { ColorRole } from '../utils/color-registry'
import type { UiProp } from '../utils/ui'
import { computed } from 'vue'
import { iconTheme } from '../theme/icon'
import { isBuiltinColorRole } from '../utils/color-registry'
import { resolveRegisteredColorRole } from '../utils/registered-colors'
import { useComponentTheme, useRootProps } from '../utils/ui'

type IconVariants = VariantProps<typeof iconTheme>

defineOptions({ inheritAttrs: false })

const props = defineProps<IconProps>()

export interface IconProps {
  /** Any name Nuxt Icon resolves, e.g. `hugeicons:star` (or any other registered set, like `lucide:star`). */
  name: string
  color?: ColorRole
  ui?: UiProp<IconThemeSlots>
}

const theme = useComponentTheme('icon', iconTheme)
const effectiveColor = computed(() => props.color ? resolveRegisteredColorRole(props.color, 'primary') : undefined)
const recipeColor = computed(() => effectiveColor.value && isBuiltinColorRole(effectiveColor.value) ? effectiveColor.value as IconVariants['color'] : effectiveColor.value ? 'primary' : undefined)
const ui = computed(() => theme.value({ color: recipeColor.value }))

const rootProps = useRootProps(() => ui.value.base, () => props.ui?.base)
</script>

<template>
  <Icon :name="name" :data-selaras-color="effectiveColor" v-bind="rootProps" />
</template>
