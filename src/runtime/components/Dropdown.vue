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
  onSelect?: () => void
}

const props = defineProps<{
  items: DropdownItem[][]
  ui?: UiProp<DropdownSlots>
}>()

const theme = useComponentTheme('dropdown', dropdownTheme)
const ui = computed(() => theme.value())

const contentProps = computed(() => resolveSlot(ui.value.content, props.ui?.content))
const itemProps = computed(() => resolveSlot(ui.value.item, props.ui?.item))
const iconProps = computed(() => resolveSlot(ui.value.icon, props.ui?.icon))
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
            v-bind="itemProps"
            @select="item.onSelect?.()"
          >
            <Icon v-if="item.icon" :name="item.icon" v-bind="iconProps" />
            {{ item.label }}
          </DropdownMenuItem>
        </template>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
