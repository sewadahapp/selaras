<script setup lang="ts">
import { computed } from 'vue'
import { proseTheme } from '../theme/prose'
import { useComponentTheme, useRootProps } from '../utils/ui'

defineOptions({ inheritAttrs: false })

const theme = useComponentTheme('prose', proseTheme)
const ui = computed(() => theme.value())
const rootProps = useRootProps(() => ui.value.th, () => undefined)
</script>

<template>
  <th v-bind="rootProps">
    <slot />
  </th>
</template>
