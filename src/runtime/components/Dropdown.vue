<script setup lang="ts">
import type { HotkeyOptions } from '../directives/hotkey'
import type { DropdownThemeSlots } from '../theme/dropdown'
import type { RoundedArrowConfig } from '../utils/arrow'
import type { MenuCheckboxItem, MenuItemOptions, MenuRadioGroup, MenuRadioItem } from '../utils/menu-items'
import type { OverlayPortal, OverlayPositioning } from '../utils/overlay'
import type { UiProp } from '../utils/ui'
import {
  DropdownMenuArrow,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemIndicator,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  RadioGroupIndicator,
  RadioGroupItem,
  RadioGroupRoot,
} from 'reka-ui'
import { computed, getCurrentInstance, onMounted, ref, useId, watch, watchPostEffect } from 'vue'
import { NuxtLink } from '#components'
import { useIcons } from '../composables/use-icons'
import { useIsMobile } from '../composables/use-media-query'
import { useMessages } from '../composables/use-messages'
import { vHotkey } from '../directives/hotkey'
import MenuItemContent from '../internal/MenuItemContent.vue'
import { dropdownTheme } from '../theme/dropdown'
import { arrowContentProps, arrowElementProps } from '../utils/arrow'
import { isMenuCheckboxItem, isMenuRadioGroup } from '../utils/menu-items'
import { overlayPortalProps } from '../utils/overlay'
import { resolveSlot, useComponentTheme, useFallthroughProps, useThemeBindings } from '../utils/ui'
import Icon from './Icon.vue'
import Modal from './Modal.vue'

export interface DropdownItem extends MenuItemOptions {
  /** Nuxt route or URL to navigate to instead of rendering an action item. */
  to?: string
  /** Link target, for example `_blank`. */
  target?: string
  rel?: string
}

type SelectionLinkFields = Partial<Record<'to' | 'target' | 'rel', never>>
type DropdownOption = (MenuCheckboxItem | MenuRadioItem) & SelectionLinkFields

export type DropdownEntry = DropdownItem | ((MenuCheckboxItem | MenuRadioGroup) & SelectionLinkFields)

export interface DropdownSlots {
  default?: () => any
  item?: (scope: { item: DropdownItem | DropdownOption }) => any
}

export interface DropdownProps {
  items: DropdownEntry[][]
  open?: boolean
  /** Initial visibility for an uncontrolled dropdown. Supplying `open` makes the parent authoritative. */
  defaultOpen?: boolean
  /** Shows the pointer; an object configures its size, rounding, and edge clearance. */
  arrow?: boolean | RoundedArrowConfig
  /** Anchored menu placement. */
  positioning?: OverlayPositioning
  /** Teleport target, or `false` to render inline. Defaults to `body`. */
  portal?: OverlayPortal
  /** Opens a dialog-style action list on mobile instead of the anchored menu. */
  adaptive?: boolean
  ui?: UiProp<DropdownThemeSlots>
}

export interface DropdownEmits {
  'update:open': [value: boolean]
}

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<DropdownProps>(), {
  open: undefined,
  arrow: false,
  portal: undefined,
})
const emit = defineEmits<DropdownEmits>()
defineSlots<DropdownSlots>()
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
const messages = useMessages()
const icons = useIcons()
const isMobile = useIsMobile()
const modalId = `selaras-dropdown-modal-${useId()}`
const triggerElement = ref<{ $el?: HTMLElement } | HTMLElement>()
const ui = computed(() => theme.value())

const triggerProps = useFallthroughProps()

const contentProps = computed(() => ({ ...resolveSlot(ui.value.content, props.ui?.content), ...arrowContentProps(props.arrow), ...props.positioning }))
const portalProps = computed(() => overlayPortalProps(props.portal))
const arrowProps = computed(() => ({ ...resolveSlot(ui.value.arrow, props.ui?.arrow), ...arrowElementProps(props.arrow) }))
// Resolved per item (not a single shared computed) - `destructive` can
// differ between items in the same menu, unlike every other themed slot
// here which is the same for every item.
function itemPropsFor(item: MenuItemOptions) {
  return resolveSlot(theme.value({ destructive: item.destructive }).item, props.ui?.item)
}
function mobileItemPropsFor(item: MenuItemOptions) {
  return resolveSlot(theme.value({ destructive: item.destructive, mobile: true }).item, props.ui?.item)
}
const mobileListProps = computed(() => resolveSlot(ui.value.mobileList, props.ui?.mobileList))
const mobileGroupProps = computed(() => resolveSlot(ui.value.mobileGroup, props.ui?.mobileGroup))
function iconPropsFor(item: MenuItemOptions) {
  return resolveSlot(theme.value({ destructive: item.destructive }).icon, props.ui?.icon)
}
function hotkeyFor(item: MenuItemOptions): HotkeyOptions | undefined {
  return item.hotkey && item.shortcut && !item.disabled
    ? { keys: item.shortcut, when: () => internalOpen.value }
    : undefined
}
const indicatorProps = computed(() => resolveSlot(ui.value.indicator, props.ui?.indicator))
const separatorProps = computed(() => resolveSlot(ui.value.separator, props.ui?.separator))

// Keep one open state while choosing the presentation at open time. Switching
// a live menu focus scope into a dialog during a resize can strand focus, so
// the next opening samples the current breakpoint again.
const mobilePresentation = ref(false)
const isOpen = computed(() => isControlled ? props.open ?? false : internalOpen.value)
watch(isOpen, (open) => {
  if (open)
    mobilePresentation.value = !!props.adaptive && isMobile.value
})
onMounted(() => {
  if (isOpen.value)
    mobilePresentation.value = !!props.adaptive && isMobile.value
})

function onUpdateMenuOpen(value: boolean) {
  onUpdateOpen(value)
}

const desktopOpen = computed(() => isOpen.value && !mobilePresentation.value)
const mobileOpen = computed(() => isOpen.value && mobilePresentation.value)
const adaptiveUi = computed(() => ({
  content: {
    class: 'rounded-[var(--selaras-resolved-radius-md)]',
    id: modalId,
  },
}))

// Reka's menu trigger always declares aria-haspopup="menu" and its expanded
// state follows the anchored menu root. In adaptive mode the trigger can open
// either surface, so describe the one that is open - or, while closed, the one
// the next open will choose. Vue won't re-apply Reka's own static values after
// they're overwritten, so both directions are set here, not just the dialog one.
watchPostEffect(() => {
  if (!props.adaptive)
    return
  const element = triggerElement.value instanceof HTMLElement ? triggerElement.value : triggerElement.value?.$el
  if (!element)
    return
  const dialog = isOpen.value ? mobilePresentation.value : isMobile.value
  element.setAttribute('aria-haspopup', dialog ? 'dialog' : 'menu')
  element.setAttribute('aria-expanded', String(isOpen.value))
  if (dialog && isOpen.value)
    element.setAttribute('aria-controls', modalId)
  else if (element.getAttribute('aria-controls') === modalId)
    element.removeAttribute('aria-controls')
})

function selectMobileItem(item: DropdownItem | MenuCheckboxItem) {
  if (isMenuCheckboxItem(item)) {
    item.onUpdateChecked?.(!item.checked)
    item.onSelect?.()
    return
  }
  item.onSelect?.()
  onUpdateOpen(false)
}

function onModalAfterLeave() {
  if (!isOpen.value)
    mobilePresentation.value = false
}
</script>

<template>
  <DropdownMenuRoot :open="desktopOpen" @update:open="onUpdateMenuOpen">
    <DropdownMenuTrigger ref="triggerElement" as-child v-bind="triggerProps">
      <slot />
    </DropdownMenuTrigger>
    <DropdownMenuPortal v-if="!mobilePresentation" v-bind="portalProps">
      <DropdownMenuContent :side-offset="6" align="start" :data-selaras-theme="themeBindings['data-selaras-theme']" :data-selaras-mode="themeBindings['data-selaras-mode']" :style="themeBindings.style" v-bind="contentProps">
        <template v-for="(group, groupIndex) in items" :key="groupIndex">
          <DropdownMenuSeparator v-if="groupIndex > 0" v-bind="separatorProps" />
          <template v-for="(entry, itemIndex) in group" :key="itemIndex">
            <DropdownMenuRadioGroup
              v-if="isMenuRadioGroup(entry)"
              :aria-label="entry.label"
              :model-value="entry.value"
              @update:model-value="typeof $event === 'string' && entry.onUpdateValue?.($event)"
            >
              <DropdownMenuRadioItem
                v-for="item in entry.items"
                :key="item.value"
                v-hotkey="hotkeyFor(item)"
                :value="item.value"
                :disabled="item.disabled"
                v-bind="itemPropsFor(item)"
                @select="item.onSelect?.()"
              >
                <span aria-hidden="true" v-bind="indicatorProps">
                  <DropdownMenuItemIndicator as-child>
                    <Icon :name="icons.check" v-bind="iconPropsFor(item)" />
                  </DropdownMenuItemIndicator>
                </span>
                <MenuItemContent :item="item" :icon-props="iconPropsFor(item)">
                  <slot name="item" :item="item" />
                </MenuItemContent>
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuCheckboxItem
              v-else-if="isMenuCheckboxItem(entry)"
              v-hotkey="hotkeyFor(entry)"
              :model-value="entry.checked"
              :disabled="entry.disabled"
              v-bind="itemPropsFor(entry)"
              @update:model-value="entry.onUpdateChecked?.($event)"
              @select="entry.onSelect?.()"
            >
              <span aria-hidden="true" v-bind="indicatorProps">
                <DropdownMenuItemIndicator as-child>
                  <Icon :name="icons.check" v-bind="iconPropsFor(entry)" />
                </DropdownMenuItemIndicator>
              </span>
              <MenuItemContent :item="entry" :icon-props="iconPropsFor(entry)">
                <slot name="item" :item="entry" />
              </MenuItemContent>
            </DropdownMenuCheckboxItem>
            <DropdownMenuItem
              v-else
              v-hotkey="hotkeyFor(entry)"
              :disabled="entry.disabled"
              :as-child="Boolean(entry.to)"
              v-bind="itemPropsFor(entry)"
              @select="entry.onSelect?.()"
            >
              <NuxtLink v-if="entry.to" :to="entry.to" :target="entry.target" :rel="entry.rel">
                <MenuItemContent :item="entry" :icon-props="iconPropsFor(entry)">
                  <slot name="item" :item="entry" />
                </MenuItemContent>
              </NuxtLink>
              <MenuItemContent v-else :item="entry" :icon-props="iconPropsFor(entry)">
                <slot name="item" :item="entry" />
              </MenuItemContent>
            </DropdownMenuItem>
          </template>
        </template>
        <DropdownMenuArrow v-if="arrow" v-bind="arrowProps" />
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>

  <Modal
    v-if="mobilePresentation"
    :open="mobileOpen"
    :title="messages.dropdownMenu"
    :description="messages.dropdownMenuDescription"
    :close="false"
    :ui="adaptiveUi"
    @update:open="onUpdateOpen"
    @after-leave="onModalAfterLeave"
  >
    <template #content>
      <div v-bind="mobileListProps">
        <template v-for="(group, groupIndex) in items" :key="groupIndex">
          <div v-if="groupIndex > 0" role="separator" v-bind="separatorProps" />
          <div v-bind="mobileGroupProps">
            <template v-for="(entry, itemIndex) in group" :key="itemIndex">
              <RadioGroupRoot
                v-if="isMenuRadioGroup(entry)"
                :aria-label="entry.label"
                :model-value="entry.value"
                orientation="vertical"
                v-bind="mobileGroupProps"
                @update:model-value="typeof $event === 'string' && entry.onUpdateValue?.($event)"
              >
                <RadioGroupItem
                  v-for="item in entry.items"
                  :key="item.value"
                  v-hotkey="hotkeyFor(item)"
                  :value="item.value"
                  :disabled="item.disabled"
                  v-bind="mobileItemPropsFor(item)"
                  @select="item.onSelect?.()"
                >
                  <span aria-hidden="true" v-bind="indicatorProps">
                    <RadioGroupIndicator as-child>
                      <Icon :name="icons.check" v-bind="iconPropsFor(item)" />
                    </RadioGroupIndicator>
                  </span>
                  <MenuItemContent :item="item" :icon-props="iconPropsFor(item)">
                    <slot name="item" :item="item" />
                  </MenuItemContent>
                </RadioGroupItem>
              </RadioGroupRoot>
              <!-- A disabled link renders as the disabled button below, which is inert. -->
              <NuxtLink
                v-else-if="!isMenuCheckboxItem(entry) && entry.to && !entry.disabled"
                v-hotkey="hotkeyFor(entry)"
                :to="entry.to"
                :target="entry.target"
                :rel="entry.rel"
                v-bind="mobileItemPropsFor(entry)"
                @click="selectMobileItem(entry)"
              >
                <MenuItemContent :item="entry" :icon-props="iconPropsFor(entry)">
                  <slot name="item" :item="entry" />
                </MenuItemContent>
              </NuxtLink>
              <button
                v-else
                v-hotkey="hotkeyFor(entry)"
                type="button"
                :disabled="entry.disabled"
                :role="isMenuCheckboxItem(entry) ? 'checkbox' : undefined"
                :aria-checked="isMenuCheckboxItem(entry) ? entry.checked : undefined"
                v-bind="mobileItemPropsFor(entry)"
                @click="selectMobileItem(entry)"
              >
                <span v-if="isMenuCheckboxItem(entry)" aria-hidden="true" v-bind="indicatorProps">
                  <Icon v-if="entry.checked" :name="icons.check" v-bind="iconPropsFor(entry)" />
                </span>
                <MenuItemContent :item="entry" :icon-props="iconPropsFor(entry)">
                  <slot name="item" :item="entry" />
                </MenuItemContent>
              </button>
            </template>
          </div>
        </template>
      </div>
    </template>
  </Modal>
</template>
