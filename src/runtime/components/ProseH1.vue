<script setup lang="ts">
import { computed } from 'vue'
import { proseTheme } from '../theme/prose'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'

defineOptions({ inheritAttrs: false })

defineProps<ProseH1Props>()

export interface ProseH1Props {
  id?: string
}

const theme = useComponentTheme('prose', proseTheme)
const ui = computed(() => theme.value())
const rootProps = useRootProps(() => ui.value.h1, () => undefined)
</script>

<template>
  <h1 :id="id" v-bind="rootProps">
    <a v-if="id" :href="`#${id}`" v-bind="resolveSlot(ui.headingAnchor, undefined)">
      <slot />
    </a>
    <slot v-else />
  </h1>
</template>
