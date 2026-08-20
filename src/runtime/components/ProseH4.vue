<script setup lang="ts">
import { computed } from 'vue'
import { proseTheme } from '../theme/prose'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'

defineOptions({ inheritAttrs: false })

defineProps<{
  id?: string
}>()

const theme = useComponentTheme('prose', proseTheme)
const ui = computed(() => theme.value())
const rootProps = useRootProps(() => ui.value.h4, () => undefined)
</script>

<template>
  <h4 :id="id" v-bind="rootProps">
    <a v-if="id" :href="`#${id}`" v-bind="resolveSlot(ui.headingAnchor, undefined)">
      <slot />
    </a>
    <slot v-else />
  </h4>
</template>
