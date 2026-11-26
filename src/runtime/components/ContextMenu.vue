<script setup lang="ts">
import type { HotkeyOptions } from '../directives/hotkey'
import type { ContextMenuThemeSlots } from '../theme/context-menu'
import type { MenuCheckboxItem, MenuItemOptions, MenuRadioGroup, MenuRadioItem } from '../utils/menu-items'
import type { ContextMenuPositioning, OverlayPortal } from '../utils/overlay'
import type { UiProp } from '../utils/ui'
import {
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuItemIndicator,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuRoot,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from 'reka-ui'
import { computed, ref } from 'vue'
import { useIcons } from '../composables/use-icons'
import { vHotkey } from '../directives/hotkey'
import MenuItemContent from '../internal/MenuItemContent.vue'
import { contextMenuTheme } from '../theme/context-menu'
import { overlayPortalProps } from '../utils/overlay'
import { resolveSlot, useComponentTheme, useFallthroughProps, useThemeBindings } from '../utils/ui'
import Icon from './Icon.vue'

export type ContextMenuItemDef = MenuItemOptions

export type ContextMenuEntry = (ContextMenuItemDef & { type?: never }) | MenuCheckboxItem | MenuRadioGroup

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<ContextMenuProps>(), { portal: undefined })
defineSlots<ContextMenuSlots>()

export interface ContextMenuProps {
  items: ContextMenuEntry[][]
  /** Collision and offset controls for the menu anchored to the right-click point. */
  positioning?: ContextMenuPositioning
  /** Teleport target, or `false` to render inline. Defaults to `body`. */
  portal?: OverlayPortal
  ui?: UiProp<ContextMenuThemeSlots>
}

export interface ContextMenuSlots {
  /** The right-click target area. */
  default?: () => any
  item?: (props: { item: ContextMenuItemDef | MenuCheckboxItem | MenuRadioItem }) => any
}

const theme = useComponentTheme('contextMenu', contextMenuTheme)
const open = ref(false)
const icons = useIcons()
const themeBindings = useThemeBindings()
const ui = computed(() => theme.value())

const triggerProps = useFallthroughProps()

const contentProps = computed(() => ({ ...resolveSlot(ui.value.content, props.ui?.content), ...props.positioning }))
const portalProps = computed(() => overlayPortalProps(props.portal))
// Resolved per item (not a single shared computed) - `destructive` can
// differ between items in the same menu, unlike every other themed slot
// here which is the same for every item. Mirrors Dropdown.vue's own
// itemPropsFor/iconPropsFor exactly.
function itemPropsFor(item: MenuItemOptions) {
  return resolveSlot(theme.value({ destructive: item.destructive }).item, props.ui?.item)
}
function iconPropsFor(item: MenuItemOptions) {
  return resolveSlot(theme.value({ destructive: item.destructive }).icon, props.ui?.icon)
}
const indicatorProps = computed(() => resolveSlot(ui.value.indicator, props.ui?.indicator))
const separatorProps = computed(() => resolveSlot(ui.value.separator, props.ui?.separator))
function hotkeyFor(item: MenuItemOptions): HotkeyOptions | undefined {
  return item.hotkey && item.shortcut && !item.disabled
    ? { keys: item.shortcut, when: () => open.value }
    : undefined
}
</script>

<template>
  <ContextMenuRoot :open="open" @update:open="open = $event">
    <ContextMenuTrigger as-child v-bind="triggerProps">
      <slot />
    </ContextMenuTrigger>
    <ContextMenuPortal v-bind="portalProps">
      <ContextMenuContent :data-selaras-theme="themeBindings['data-selaras-theme']" :data-selaras-mode="themeBindings['data-selaras-mode']" :style="themeBindings.style" v-bind="contentProps">
        <template v-for="(group, groupIndex) in items" :key="groupIndex">
          <ContextMenuSeparator v-if="groupIndex > 0" v-bind="separatorProps" />
          <template v-for="(entry, itemIndex) in group" :key="itemIndex">
            <ContextMenuRadioGroup
              v-if="entry.type === 'radio-group'"
              :aria-label="entry.label"
              :model-value="entry.value"
              @update:model-value="typeof $event === 'string' && entry.onUpdateValue?.($event)"
            >
              <ContextMenuRadioItem
                v-for="item in entry.items"
                :key="item.value"
                v-hotkey="hotkeyFor(item)"
                :value="item.value"
                :disabled="item.disabled"
                v-bind="itemPropsFor(item)"
                @select="item.onSelect?.()"
              >
                <span aria-hidden="true" v-bind="indicatorProps">
                  <ContextMenuItemIndicator as-child>
                    <Icon :name="icons.check" v-bind="iconPropsFor(item)" />
                  </ContextMenuItemIndicator>
                </span>
                <MenuItemContent :item="item" :icon-props="iconPropsFor(item)">
                  <slot name="item" :item="item" />
                </MenuItemContent>
              </ContextMenuRadioItem>
            </ContextMenuRadioGroup>
            <ContextMenuCheckboxItem
              v-else-if="entry.type === 'checkbox'"
              v-hotkey="hotkeyFor(entry)"
              :model-value="entry.checked"
              :disabled="entry.disabled"
              v-bind="itemPropsFor(entry)"
              @update:model-value="entry.onUpdateChecked?.($event)"
              @select="entry.onSelect?.()"
            >
              <span aria-hidden="true" v-bind="indicatorProps">
                <ContextMenuItemIndicator as-child>
                  <Icon :name="icons.check" v-bind="iconPropsFor(entry)" />
                </ContextMenuItemIndicator>
              </span>
              <MenuItemContent :item="entry" :icon-props="iconPropsFor(entry)">
                <slot name="item" :item="entry" />
              </MenuItemContent>
            </ContextMenuCheckboxItem>
            <ContextMenuItem
              v-else
              v-hotkey="hotkeyFor(entry)"
              :disabled="entry.disabled"
              v-bind="itemPropsFor(entry)"
              @select="entry.onSelect?.()"
            >
              <MenuItemContent :item="entry" :icon-props="iconPropsFor(entry)">
                <slot name="item" :item="entry" />
              </MenuItemContent>
            </ContextMenuItem>
          </template>
        </template>
      </ContextMenuContent>
    </ContextMenuPortal>
  </ContextMenuRoot>
</template>
