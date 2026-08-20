<script setup lang="ts">
import { computed } from 'vue'
import { proseTheme } from '../theme/prose'
import { useComponentTheme, useRootProps } from '../utils/ui'

defineOptions({ inheritAttrs: false })

defineProps<{
  href?: string
  target?: string
}>()

const theme = useComponentTheme('prose', proseTheme)
const ui = computed(() => theme.value())
const rootProps = useRootProps(() => ui.value.a, () => undefined)
</script>

<template>
  <NuxtLink :href="href" :target="target" v-bind="rootProps">
    <slot />
  </NuxtLink>
</template>
