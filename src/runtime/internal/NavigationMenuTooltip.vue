<script setup lang="ts">
import type { TooltipProps } from '../components/Tooltip.vue'
import Tooltip from '../components/Tooltip.vue'

defineProps<{ tooltip?: TooltipProps }>()
</script>

<template>
  <Tooltip v-if="tooltip" v-bind="tooltip">
    <slot />
  </Tooltip>
  <slot v-else />
</template>
