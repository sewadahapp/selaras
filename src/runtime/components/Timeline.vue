<script setup lang="ts" generic="Item extends TimelineItem">
import type { VariantProps } from 'tailwind-variants'
import type { TimelineThemeSlots } from '../theme/timeline'
import type { TimelineItem, TimelineProps, TimelineSlotProps, TimelineSlots } from '../utils/timeline-contracts'
import { computed } from 'vue'
import { timelineTheme } from '../theme/timeline'
import { resolveRegisteredColorRole } from '../utils/registered-colors'
import { applyClassPrefix, resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import Icon from './Icon.vue'

type TimelineVariants = VariantProps<typeof timelineTheme>

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<TimelineProps<Item>>(), {
  orientation: 'vertical',
  align: 'start',
  size: 'md',
  color: 'primary',
})

defineSlots<TimelineSlots<Item>>()

const theme = useComponentTheme('timeline', timelineTheme)
const effectiveColor = computed(() => resolveRegisteredColorRole(props.color, 'primary'))
const ui = computed(() => theme.value({
  orientation: props.orientation,
  align: props.align,
  size: props.size,
  color: effectiveColor.value as TimelineVariants['color'],
}))

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
const isHorizontal = computed(() => props.orientation === 'horizontal')
const slotProps = (item: Item, index: number): TimelineSlotProps<Item> => ({ item, index })

function itemUi(item: TimelineItem, slot: TimelineThemeSlots) {
  return resolveSlot(ui.value[slot], item.ui?.[slot] ?? props.ui?.[slot])
}

function contentPlacement(index: number) {
  if (props.align !== 'alternate')
    return undefined
  if (isHorizontal.value)
    return applyClassPrefix(index % 2 === 0 ? 'row-start-1' : 'row-start-3')
  return applyClassPrefix(index % 2 === 0 ? 'col-start-3 text-start' : 'col-start-1 text-end')
}
</script>

<template>
  <ol
    :data-selaras-color="effectiveColor"
    :data-orientation="orientation"
    :data-align="align"
    v-bind="rootProps"
  >
    <li
      v-for="(item, index) in items"
      :key="item.id ?? index"
      :data-selaras-color="resolveRegisteredColorRole(item.color ?? color, 'primary')"
      :class="item.class"
      v-bind="itemUi(item, 'item')"
    >
      <div v-bind="itemUi(item, 'track')">
        <span
          aria-hidden="true"
          :data-marker-type="item.icon ? 'icon' : $slots.marker ? 'custom' : 'dot'"
          v-bind="itemUi(item, 'marker')"
        >
          <slot name="marker" v-bind="slotProps(item, index)">
            <Icon v-if="item.icon" :name="item.icon" v-bind="itemUi(item, 'icon')" />
          </slot>
        </span>
        <template v-if="index < items.length - 1">
          <span aria-hidden="true" v-bind="itemUi(item, 'connector')">
            <slot name="connector" v-bind="slotProps(item, index)" />
          </span>
        </template>
      </div>

      <div v-if="item.slot && $slots[item.slot]" :class="contentPlacement(index)" v-bind="itemUi(item, 'content')">
        <slot :name="item.slot" v-bind="slotProps(item, index)" />
      </div>
      <slot v-else-if="$slots.item" name="item" v-bind="slotProps(item, index)" />
      <div v-else :class="contentPlacement(index)" v-bind="itemUi(item, 'content')">
        <slot name="content" v-bind="slotProps(item, index)">
          <div v-if="item.date || $slots.date" v-bind="itemUi(item, 'date')">
            <slot name="date" v-bind="slotProps(item, index)">
              <time v-if="item.datetime" :datetime="item.datetime">{{ item.date }}</time>
              <template v-else>
                {{ item.date }}
              </template>
            </slot>
          </div>
          <div v-if="item.title || $slots.title" v-bind="itemUi(item, 'title')">
            <slot name="title" v-bind="slotProps(item, index)">
              {{ item.title }}
            </slot>
          </div>
          <div v-if="item.description || $slots.description" v-bind="itemUi(item, 'description')">
            <slot name="description" v-bind="slotProps(item, index)">
              {{ item.description }}
            </slot>
          </div>
        </slot>
      </div>
    </li>
  </ol>
</template>
