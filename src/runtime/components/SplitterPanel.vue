<script setup lang="ts">
import type { SplitterPanelThemeSlots } from '../theme/splitter-panel'
import type { UiProp } from '../utils/ui'
import { SplitterPanel as RekaSplitterPanel } from 'reka-ui'
import { computed, ref } from 'vue'
import { splitterPanelTheme } from '../theme/splitter-panel'
import { useComponentTheme, useRootProps } from '../utils/ui'

defineOptions({ inheritAttrs: false })

const props = defineProps<SplitterPanelProps>()

const emit = defineEmits<SplitterPanelEmits>()

defineSlots<SplitterPanelSlots>()

export interface SplitterPanelProps {
  /** Initial size - a percentage of the group's total by default (`sizeUnit="%"`), or pixels with `sizeUnit="px"`. */
  defaultSize?: number
  minSize?: number
  maxSize?: number
  /** How wide/tall the panel stays once collapsed - `0` hides it entirely. */
  collapsedSize?: number
  /** Whether dragging past `minSize` snaps the panel fully closed instead of stopping there. */
  collapsible?: boolean
  /** @default '%' */
  sizeUnit?: 'px' | '%'
  /** Where this panel sits among its siblings when they aren't already in that order in the template. */
  order?: number
  ui?: UiProp<SplitterPanelThemeSlots>
}

export interface SplitterPanelEmits {
  collapse: []
  expand: []
  resize: [size: number]
}

export interface SplitterPanelSlots {
  default?: (props: { isCollapsed: boolean, isExpanded: boolean, collapse: () => void, expand: () => void }) => any
}

const panelRef = ref<InstanceType<typeof RekaSplitterPanel>>()

defineExpose({
  collapse: () => panelRef.value?.collapse(),
  expand: () => panelRef.value?.expand(),
  resize: (size: number) => panelRef.value?.resize(size),
  getSize: () => panelRef.value?.getSize(),
  isCollapsed: computed(() => panelRef.value?.isCollapsed ?? false),
  isExpanded: computed(() => panelRef.value?.isExpanded ?? true),
})

const theme = useComponentTheme('splitterPanel', splitterPanelTheme)
const ui = computed(() => theme.value())

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
</script>

<template>
  <RekaSplitterPanel
    ref="panelRef"
    :default-size="defaultSize"
    :min-size="minSize"
    :max-size="maxSize"
    :collapsed-size="collapsedSize"
    :collapsible="collapsible"
    :size-unit="sizeUnit"
    :order="order"
    v-bind="rootProps"
    @collapse="emit('collapse')"
    @expand="emit('expand')"
    @resize="(size) => emit('resize', size)"
  >
    <template #default="{ isCollapsed, isExpanded, collapse, expand }">
      <slot :is-collapsed="isCollapsed" :is-expanded="isExpanded" :collapse="collapse" :expand="expand" />
    </template>
  </RekaSplitterPanel>
</template>
