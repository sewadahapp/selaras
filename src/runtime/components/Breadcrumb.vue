<script setup lang="ts">
import type { BreadcrumbThemeSlots } from '../theme/breadcrumb'
import type { UiProp } from '../utils/ui'
import { computed } from 'vue'
import { useIcons } from '../composables/use-icons'
import { breadcrumbTheme } from '../theme/breadcrumb'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
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

const theme = useComponentTheme('breadcrumb', breadcrumbTheme)
const ui = computed(() => theme.value())

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
const listProps = computed(() => resolveSlot(ui.value.list, props.ui?.list))
const itemProps = computed(() => resolveSlot(ui.value.item, props.ui?.item))
const linkProps = computed(() => resolveSlot(ui.value.link, props.ui?.link))
const currentProps = computed(() => resolveSlot(ui.value.current, props.ui?.current))
const disabledProps = computed(() => resolveSlot(ui.value.disabled, props.ui?.disabled))
const iconProps = computed(() => resolveSlot(ui.value.icon, props.ui?.icon))
const separatorProps = computed(() => resolveSlot(ui.value.separator, props.ui?.separator))
const separatorIconProps = computed(() => resolveSlot(ui.value.separatorIcon, props.ui?.separatorIcon))

// The last item is always "where you are" - never a link, regardless of
// whether it has its own `to` (there's no reason to link to the current
// page). Every earlier item is a real link only if it has `to` and
// isn't disabled; otherwise it's inert, same look as `current` minus
// the emphasis and aria-current.
function isLast(index: number) {
  return index === props.items.length - 1
}
function isLink(item: BreadcrumbItem, index: number) {
  return !!item.to && !item.disabled && !isLast(index)
}
</script>

<template>
  <nav aria-label="Breadcrumb" v-bind="rootProps">
    <ol v-bind="listProps">
      <template v-for="(item, index) in items" :key="item.label">
        <li v-bind="itemProps">
          <slot name="item" :item="item" :index="index" :current="isLast(index)">
            <NuxtLink v-if="isLink(item, index)" :to="item.to!" v-bind="linkProps">
              <Icon v-if="item.icon" :name="item.icon" v-bind="iconProps" />
              {{ item.label }}
            </NuxtLink>
            <span
              v-else
              v-bind="isLast(index) ? currentProps : disabledProps"
              :aria-current="isLast(index) ? 'page' : undefined"
            >
              <Icon v-if="item.icon" :name="item.icon" v-bind="iconProps" />
              {{ item.label }}
            </span>
          </slot>
        </li>
        <li v-if="!isLast(index)" v-bind="separatorProps" aria-hidden="true">
          <slot name="separator">
            <Icon :name="separatorIcon ?? icons.chevronRight" v-bind="separatorIconProps" />
          </slot>
        </li>
      </template>
    </ol>
  </nav>
</template>
