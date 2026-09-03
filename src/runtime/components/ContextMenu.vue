<script setup lang="ts">
import type { ContextMenuThemeSlots } from '../theme/context-menu'
import type { UiProp } from '../utils/ui'
import { ContextMenuContent, ContextMenuItem, ContextMenuPortal, ContextMenuRoot, ContextMenuSeparator, ContextMenuTrigger } from 'reka-ui'
import { computed } from 'vue'
import { contextMenuTheme } from '../theme/context-menu'
import { resolveSlot, useComponentTheme } from '../utils/ui'
import Icon from './Icon.vue'

export interface ContextMenuItemDef {
  label: string
  icon?: string
  disabled?: boolean
  /** Styles this item for a delete/remove-style action (danger text, danger-tinted hover) - matches Dropdown's own `destructive` flag. */
  destructive?: boolean
  onSelect?: () => void
}

const props = defineProps<ContextMenuProps>()

defineSlots<ContextMenuSlots>()

export interface ContextMenuProps {
  items: ContextMenuItemDef[][]
  ui?: UiProp<ContextMenuThemeSlots>
}

export interface ContextMenuSlots {
  /** The right-click target area. */
  default?: () => any
  item?: (props: { item: ContextMenuItemDef }) => any
}

const theme = useComponentTheme('contextMenu', contextMenuTheme)
const ui = computed(() => theme.value())

const contentProps = computed(() => resolveSlot(ui.value.content, props.ui?.content))
// Resolved per item (not a single shared computed) - `destructive` can
// differ between items in the same menu, unlike every other themed slot
// here which is the same for every item. Mirrors Dropdown.vue's own
// itemPropsFor/iconPropsFor exactly.
function itemPropsFor(item: ContextMenuItemDef) {
  return resolveSlot(theme.value({ destructive: item.destructive }).item, props.ui?.item)
}
function iconPropsFor(item: ContextMenuItemDef) {
  return resolveSlot(theme.value({ destructive: item.destructive }).icon, props.ui?.icon)
}
const separatorProps = computed(() => resolveSlot(ui.value.separator, props.ui?.separator))
</script>

<template>
  <ContextMenuRoot>
    <ContextMenuTrigger as-child>
      <slot />
    </ContextMenuTrigger>
    <ContextMenuPortal>
      <ContextMenuContent v-bind="contentProps">
        <template v-for="(group, groupIndex) in items" :key="groupIndex">
          <ContextMenuSeparator v-if="groupIndex > 0" v-bind="separatorProps" />
          <ContextMenuItem
            v-for="(item, itemIndex) in group"
            :key="itemIndex"
            :disabled="item.disabled"
            v-bind="itemPropsFor(item)"
            @select="item.onSelect?.()"
          >
            <Icon v-if="item.icon" :name="item.icon" v-bind="iconPropsFor(item)" />
            <slot name="item" :item="item">
              {{ item.label }}
            </slot>
          </ContextMenuItem>
        </template>
      </ContextMenuContent>
    </ContextMenuPortal>
  </ContextMenuRoot>
</template>
