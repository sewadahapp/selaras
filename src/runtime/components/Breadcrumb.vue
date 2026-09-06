<script setup lang="ts">
import type { BreadcrumbThemeSlots } from '../theme/breadcrumb'
import type { UiProp } from '../utils/ui'
import { computed } from 'vue'
import { navigateTo } from '#imports'
import { useIcons } from '../composables/use-icons'
import { useMessages } from '../composables/use-messages'
import { breadcrumbTheme } from '../theme/breadcrumb'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import Dropdown from './Dropdown.vue'
import Icon from './Icon.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<BreadcrumbProps>()

defineSlots<BreadcrumbSlots>()

export interface BreadcrumbItem {
  label: string
  icon?: string
  to?: string
  disabled?: boolean
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  /** Collapses the middle items behind an overflow menu once items.length exceeds this - the first item plus the last (maxItems - 1) stay visible. */
  maxItems?: number
  /** Truncates each item's label with an ellipsis. `true` caps at 12rem; a string sets a custom CSS max-width (e.g. '20rem', '300px'). @default false */
  truncate?: boolean | string
  /** @default icons.chevronRight */
  separatorIcon?: string
  ui?: UiProp<BreadcrumbThemeSlots>
}

export interface BreadcrumbSlots {
  /** Replaces one item's content, scoped with item, index, and whether it's the trail's last (current) item. */
  item?: (props: { item: BreadcrumbItem, index: number, current: boolean }) => any
  separator?: () => any
}

const icons = useIcons()
const messages = useMessages()

const theme = useComponentTheme('breadcrumb', breadcrumbTheme)
const ui = computed(() => theme.value())

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
const listProps = computed(() => resolveSlot(ui.value.list, props.ui?.list))
const itemProps = computed(() => resolveSlot(ui.value.item, props.ui?.item))
const linkProps = computed(() => resolveSlot(ui.value.link, props.ui?.link))
const currentProps = computed(() => resolveSlot(ui.value.current, props.ui?.current))
const disabledProps = computed(() => resolveSlot(ui.value.disabled, props.ui?.disabled))
const iconProps = computed(() => resolveSlot(ui.value.icon, props.ui?.icon))
const labelProps = computed(() => resolveSlot(ui.value.label, props.ui?.label))
const separatorProps = computed(() => resolveSlot(ui.value.separator, props.ui?.separator))
const separatorIconProps = computed(() => resolveSlot(ui.value.separatorIcon, props.ui?.separatorIcon))
const ellipsisProps = computed(() => resolveSlot(ui.value.ellipsis, props.ui?.ellipsis))

// The hidden middle slice, once there are more items than `maxItems`
// allows visible: keep the first item plus the last (maxItems - 1),
// collapse everything between behind the ellipsis trigger.
const hiddenItems = computed(() => {
  if (!props.maxItems || props.items.length <= props.maxItems)
    return []
  return props.items.slice(1, props.items.length - (props.maxItems - 1))
})
const visibleItems = computed(() => {
  if (!hiddenItems.value.length)
    return props.items
  // Guard the degenerate maxItems === 1 case: `-(1 - 1)` is `-0`, and
  // `array.slice(-0)` returns the *whole* array (not empty), since -0
  // and 0 are the same slice argument in JS.
  const tailCount = props.maxItems! - 1
  return [props.items[0]!, ...(tailCount > 0 ? props.items.slice(-tailCount) : [])]
})
const hiddenDropdownItems = computed(() => hiddenItems.value.map(item => ({
  label: item.label,
  icon: item.icon,
  disabled: item.disabled,
  onSelect: () => {
    if (item.to)
      navigateTo(item.to)
  },
})))

const isTruncating = computed(() => props.truncate === true || typeof props.truncate === 'string')
const truncateStyle = computed(() => isTruncating.value
  ? { maxWidth: props.truncate === true ? '12rem' : props.truncate as string }
  : undefined)

// The last item is always "where you are" - never a link, regardless of
// whether it has its own `to` (there's no reason to link to the current
// page). Every earlier item is a real link only if it has `to` and
// isn't disabled; otherwise it's inert, same look as `current` minus
// the emphasis and aria-current.
function isLast(item: BreadcrumbItem) {
  return item === props.items[props.items.length - 1]
}
function isLink(item: BreadcrumbItem) {
  return !!item.to && !item.disabled && !isLast(item)
}
// The item slot's `index` is the item's real position in the full
// `items` array, not its position among the (possibly collapsed)
// visible items - stable regardless of whether `maxItems` is set.
function realIndex(item: BreadcrumbItem) {
  return props.items.indexOf(item)
}
</script>

<template>
  <nav :aria-label="messages.breadcrumb" v-bind="rootProps">
    <ol v-bind="listProps">
      <template v-for="(item, index) in visibleItems" :key="realIndex(item)">
        <li v-bind="itemProps">
          <slot name="item" :item="item" :index="realIndex(item)" :current="isLast(item)">
            <NuxtLink v-if="isLink(item)" :to="item.to!" v-bind="linkProps">
              <Icon v-if="item.icon" :name="item.icon" v-bind="iconProps" />
              <span v-bind="labelProps" :style="truncateStyle" :title="isTruncating ? item.label : undefined">{{ item.label }}</span>
            </NuxtLink>
            <span
              v-else
              v-bind="isLast(item) ? currentProps : disabledProps"
              :aria-current="isLast(item) ? 'page' : undefined"
            >
              <Icon v-if="item.icon" :name="item.icon" v-bind="iconProps" />
              <span v-bind="labelProps" :style="truncateStyle" :title="isTruncating ? item.label : undefined">{{ item.label }}</span>
            </span>
          </slot>
        </li>
        <li v-if="!isLast(item)" v-bind="separatorProps" aria-hidden="true">
          <slot name="separator">
            <Icon :name="separatorIcon ?? icons.chevronRight" v-bind="separatorIconProps" />
          </slot>
        </li>
        <template v-if="index === 0 && hiddenItems.length">
          <li v-bind="itemProps">
            <Dropdown :items="[hiddenDropdownItems]">
              <button type="button" v-bind="ellipsisProps" :aria-label="messages.showHiddenBreadcrumbItems">
                <Icon :name="icons.more" v-bind="separatorIconProps" />
              </button>
            </Dropdown>
          </li>
          <li v-bind="separatorProps" aria-hidden="true">
            <slot name="separator">
              <Icon :name="separatorIcon ?? icons.chevronRight" v-bind="separatorIconProps" />
            </slot>
          </li>
        </template>
      </template>
    </ol>
  </nav>
</template>
