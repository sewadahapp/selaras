<script setup lang="ts">
import type { DropdownThemeSlots } from '../theme/dropdown'
import type { RoundedArrowConfig } from '../utils/arrow'
import type { UiProp } from '../utils/ui'
import { DropdownMenuArrow, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRoot, DropdownMenuSeparator, DropdownMenuTrigger } from 'reka-ui'
import { computed, getCurrentInstance, ref, watch } from 'vue'
import { dropdownTheme } from '../theme/dropdown'
import { arrowContentProps, arrowElementProps } from '../utils/arrow'
import { resolveSlot, useComponentTheme, useThemeBindings } from '../utils/ui'
import Icon from './Icon.vue'

export interface DropdownItem {
  label: string
  icon?: string
  disabled?: boolean
  /** Styles this item for a delete/remove-style action (danger text, danger-tinted hover) - just this one flag rather than the full color palette, since a menu item realistically only ever needs this one special case. */
  destructive?: boolean
  onSelect?: () => void
  /** Not read by Dropdown's own default item rendering - carried purely so a custom #item slot override can display one. */
  shortcut?: string
}

export interface DropdownProps {
  items: DropdownItem[][]
  open?: boolean
  /** Initial visibility for an uncontrolled dropdown. Supplying `open` makes the parent authoritative. */
  defaultOpen?: boolean
  /** Shows the pointer; an object configures its size, rounding, and edge clearance. */
  arrow?: boolean | RoundedArrowConfig
  ui?: UiProp<DropdownThemeSlots>
}

export interface DropdownEmits {
  'update:open': [value: boolean]
}

const props = withDefaults(defineProps<DropdownProps>(), {
  open: undefined,
  arrow: false,
})

const emit = defineEmits<DropdownEmits>()
const isControlled = Object.hasOwn(getCurrentInstance()?.vnode.props ?? {}, 'open')
const internalOpen = ref(props.open ?? props.defaultOpen ?? false)
watch(() => props.open, (value) => {
  if (isControlled)
    internalOpen.value = value ?? false
})
function onUpdateOpen(value: boolean) {
  if (!isControlled)
    internalOpen.value = value
  emit('update:open', value)
}

const theme = useComponentTheme('dropdown', dropdownTheme)
const themeBindings = useThemeBindings()
const ui = computed(() => theme.value())

const contentProps = computed(() => ({ ...resolveSlot(ui.value.content, props.ui?.content), ...arrowContentProps(props.arrow) }))
const arrowProps = computed(() => ({ ...resolveSlot(ui.value.arrow, props.ui?.arrow), ...arrowElementProps(props.arrow) }))
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
  <DropdownMenuRoot :open="internalOpen" @update:open="onUpdateOpen">
    <DropdownMenuTrigger as-child>
      <slot />
    </DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent :side-offset="6" align="start" :data-selaras-theme="themeBindings['data-selaras-theme']" :data-selaras-mode="themeBindings['data-selaras-mode']" :style="themeBindings.style" v-bind="contentProps">
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
        <DropdownMenuArrow v-if="arrow" v-bind="arrowProps" />
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
