<script setup lang="ts">
import type { PageAsideSlots } from '../theme/page-aside'
import type { UiProp } from '../utils/ui'
import { computed } from 'vue'
import { pageAsideTheme } from '../theme/page-aside'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  ui?: UiProp<PageAsideSlots>
}>()

const theme = useComponentTheme('pageAside', pageAsideTheme)
const ui = computed(() => theme.value())

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
</script>

<template>
  <aside v-bind="rootProps">
    <div v-if="$slots.header" v-bind="resolveSlot(ui.header, props.ui?.header)">
      <slot name="header" />
    </div>
    <SScrollArea v-bind="resolveSlot(ui.scrollArea, props.ui?.scrollArea)">
      <div v-bind="resolveSlot(ui.body, props.ui?.body)">
        <slot />
      </div>
    </SScrollArea>
  </aside>
</template>
