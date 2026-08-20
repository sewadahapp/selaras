<script setup lang="ts">
import { computed } from 'vue'
import { proseTheme } from '../theme/prose'
import { useComponentTheme, useRootProps } from '../utils/ui'

defineOptions({ inheritAttrs: false })

defineProps<{
  src?: string
  alt?: string
  width?: string | number
  height?: string | number
}>()

const theme = useComponentTheme('prose', proseTheme)
const ui = computed(() => theme.value())
const rootProps = useRootProps(() => ui.value.img, () => undefined)
</script>

<template>
  <img :src="src" :alt="alt" :width="width" :height="height" v-bind="rootProps">
</template>
