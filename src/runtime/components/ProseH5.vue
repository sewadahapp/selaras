<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { ColorRole } from '../utils/color-registry'
import { computed } from 'vue'
import { proseTheme } from '../theme/prose'
import { resolveRegisteredColorRole } from '../utils/registered-colors'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'

defineOptions({ inheritAttrs: false })
const props = defineProps<ProseH5Props>()

type ProseVariants = VariantProps<typeof proseTheme>

export interface ProseH5Props {
  id?: string
  color?: ColorRole
}

const theme = useComponentTheme('prose', proseTheme)
const effectiveColor = computed(() => resolveRegisteredColorRole(props.color ?? 'primary', 'primary'))
const ui = computed(() => theme.value({ color: effectiveColor.value as ProseVariants['color'] }))
const rootProps = useRootProps(() => ui.value.h5, () => undefined)
</script>

<template>
  <h5 :id="id" :data-selaras-color="effectiveColor" v-bind="rootProps">
    <a v-if="id" :href="`#${id}`" v-bind="resolveSlot(ui.headingAnchor, undefined)">
      <slot />
    </a>
    <slot v-else />
  </h5>
</template>
