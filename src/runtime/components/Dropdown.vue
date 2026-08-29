<script setup lang="ts">
import type { DropdownSlots } from '../theme/dropdown'
import type { UiProp } from '../utils/ui'
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRoot, DropdownMenuSeparator, DropdownMenuTrigger } from 'reka-ui'
import { computed } from 'vue'
import { dropdownTheme } from '../theme/dropdown'
import { resolveSlot, useComponentTheme } from '../utils/ui'
import Icon from './Icon.vue'

export interface DropdownItem {
  label: string
  icon?: string
  disabled?: boolean
  /** Styles this item for a delete/remove-style action (danger text, danger-tinted hover) - just this one flag rather than the full color palette, since a menu item realistically only ever needs this one special case. */
  destructive?: boolean
  onSelect?: () => void
}

const props = defineProps<{
  items: DropdownItem[][]
  ui?: UiProp<DropdownSlots>
}>()

const theme = useComponentTheme('dropdown', dropdownTheme)
const ui = computed(() => theme.value())

const contentProps = computed(() => resolveSlot(ui.value.content, props.ui?.content))
// Resolved per item (not a single shared computed) - `destructive` can
// differ between items in the same menu, unlike every other themed slot
// here which is the same for every item.
function itemPropsFor(item: DropdownItem) {
  return resolveSlot(theme.value({ destructive: item.destructive }).item, props.ui?.item)
}
function iconPropsFor(item: DropdownItem) {
  return resolveSlot(theme.value({ destructive: item.destructive }).icon, props.ui?.icon)
}
const separatorProps = computed(() => resolveSlot(ui.value.separator, props.ui?.separator))
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger as-child>
      <slot />
    </DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent :side-offset="6" align="start" v-bind="contentProps">
        <template v-for="(group, groupIndex) in items" :key="groupIndex">
          <DropdownMenuSeparator v-if="groupIndex > 0" v-bind="separatorProps" />
          <DropdownMenuItem
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
          </DropdownMenuItem>
        </template>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
