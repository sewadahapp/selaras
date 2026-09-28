<script setup lang="ts">
import type { HotkeyOptions } from '../directives/hotkey'
import type { DropdownThemeSlots } from '../theme/dropdown'
import type { RoundedArrowConfig } from '../utils/arrow'
import type { OverlayPortal, OverlayPositioning } from '../utils/overlay'
import type { UiProp } from '../utils/ui'
import { DropdownMenuArrow, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRoot, DropdownMenuSeparator, DropdownMenuTrigger } from 'reka-ui'
import { computed, getCurrentInstance, onMounted, ref, useId, watch, watchPostEffect } from 'vue'
import { NuxtLink } from '#components'
import { useIsMobile } from '../composables/use-media-query'
import { useMessages } from '../composables/use-messages'
import { vHotkey } from '../directives/hotkey'
import ShortcutHint from '../internal/ShortcutHint.vue'
import { dropdownTheme } from '../theme/dropdown'
import { arrowContentProps, arrowElementProps } from '../utils/arrow'
import { overlayPortalProps } from '../utils/overlay'
import { resolveSlot, useComponentTheme, useThemeBindings } from '../utils/ui'
import Icon from './Icon.vue'
import Modal from './Modal.vue'

export interface DropdownItem {
  label: string
  icon?: string
  disabled?: boolean
  /** Styles this item for a delete/remove-style action (danger text, danger-tinted hover) - just this one flag rather than the full color palette, since a menu item realistically only ever needs this one special case. */
  destructive?: boolean
  onSelect?: () => void
  /** Displays a keyboard shortcut hint. */
  shortcut?: string
  /** Bind `shortcut` while this menu is open; activation follows the normal menu item click path. */
  hotkey?: boolean
  /** Nuxt route or URL to navigate to instead of rendering an action item. */
  to?: string
  /** Link target, for example `_blank`. */
  target?: string
  rel?: string
}

export interface DropdownProps {
  items: DropdownItem[][]
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

const props = withDefaults(defineProps<DropdownProps>(), {
  open: undefined,
  arrow: false,
  portal: undefined,
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
const messages = useMessages()
const isMobile = useIsMobile()
const modalId = `selaras-dropdown-modal-${useId()}`
const triggerElement = ref<{ $el?: HTMLElement } | HTMLElement>()
const ui = computed(() => theme.value())

const contentProps = computed(() => ({ ...resolveSlot(ui.value.content, props.ui?.content), ...arrowContentProps(props.arrow), ...props.positioning }))
const portalProps = computed(() => overlayPortalProps(props.portal))
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
function hotkeyFor(item: DropdownItem): HotkeyOptions | undefined {
  return item.hotkey && item.shortcut && !item.disabled
    ? { keys: item.shortcut, when: () => internalOpen.value }
    : undefined
}
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

function selectMobileItem(item: DropdownItem) {
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
    <DropdownMenuTrigger ref="triggerElement" as-child>
      <slot />
    </DropdownMenuTrigger>
    <DropdownMenuPortal v-if="!mobilePresentation" v-bind="portalProps">
      <DropdownMenuContent :side-offset="6" align="start" :data-selaras-theme="themeBindings['data-selaras-theme']" :data-selaras-mode="themeBindings['data-selaras-mode']" :style="themeBindings.style" v-bind="contentProps">
        <template v-for="(group, groupIndex) in items" :key="groupIndex">
          <DropdownMenuSeparator v-if="groupIndex > 0" v-bind="separatorProps" />
          <DropdownMenuItem
            v-for="(item, itemIndex) in group"
            :key="itemIndex"
            v-hotkey="hotkeyFor(item)"
            :disabled="item.disabled"
            :as-child="Boolean(item.to)"
            v-bind="itemPropsFor(item)"
            @select="item.onSelect?.()"
          >
            <NuxtLink v-if="item.to" :to="item.to" :target="item.target" :rel="item.rel">
              <Icon v-if="item.icon" :name="item.icon" v-bind="iconPropsFor(item)" />
              <slot name="item" :item="item">
                {{ item.label }}
                <ShortcutHint :shortcut="item.shortcut" />
              </slot>
            </NuxtLink>
            <template v-else>
              <Icon v-if="item.icon" :name="item.icon" v-bind="iconPropsFor(item)" />
              <slot name="item" :item="item">
                {{ item.label }}
                <ShortcutHint :shortcut="item.shortcut" />
              </slot>
            </template>
          </DropdownMenuItem>
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
      <div class="max-h-[calc(100dvh-8rem)] overflow-y-auto p-2">
        <template v-for="(group, groupIndex) in items" :key="groupIndex">
          <div v-if="groupIndex > 0" role="separator" v-bind="separatorProps" />
          <div class="flex flex-col gap-1">
            <template v-for="(item, itemIndex) in group" :key="itemIndex">
              <!-- A disabled link renders as the disabled button below, which is inert. -->
              <NuxtLink
                v-if="item.to && !item.disabled"
                v-hotkey="hotkeyFor(item)"
                :to="item.to"
                :target="item.target"
                :rel="item.rel"
                class="flex min-h-11 w-full items-center gap-3 rounded-[var(--selaras-resolved-radius-sm)] px-3 py-2 text-start text-base outline-none transition-colors hover:bg-[var(--selaras-resolved-surface-elevated)] focus-visible:bg-[var(--selaras-resolved-surface-elevated)] focus-visible:ring-2 focus-visible:ring-[var(--selaras-resolved-color-primary-fill)]"
                :class="item.destructive ? 'hover:bg-[var(--selaras-resolved-color-danger-subtle-hover)] hover:text-[var(--selaras-resolved-color-danger-on-subtle)]' : undefined"
                v-bind="itemPropsFor(item)"
                @click="selectMobileItem(item)"
              >
                <Icon v-if="item.icon" :name="item.icon" v-bind="iconPropsFor(item)" />
                <slot name="item" :item="item">
                  {{ item.label }}
                  <ShortcutHint :shortcut="item.shortcut" />
                </slot>
              </NuxtLink>
              <button
                v-else
                v-hotkey="hotkeyFor(item)"
                type="button"
                :disabled="item.disabled"
                class="flex min-h-11 w-full items-center gap-3 rounded-[var(--selaras-resolved-radius-sm)] px-3 py-2 text-start text-base outline-none transition-colors hover:bg-[var(--selaras-resolved-surface-elevated)] focus-visible:bg-[var(--selaras-resolved-surface-elevated)] focus-visible:ring-2 focus-visible:ring-[var(--selaras-resolved-color-primary-fill)] disabled:pointer-events-none disabled:opacity-50"
                :class="item.destructive ? 'hover:bg-[var(--selaras-resolved-color-danger-subtle-hover)] hover:text-[var(--selaras-resolved-color-danger-on-subtle)]' : undefined"
                v-bind="itemPropsFor(item)"
                @click="selectMobileItem(item)"
              >
                <Icon v-if="item.icon" :name="item.icon" v-bind="iconPropsFor(item)" />
                <slot name="item" :item="item">
                  {{ item.label }}
                  <ShortcutHint :shortcut="item.shortcut" />
                </slot>
              </button>
            </template>
          </div>
        </template>
      </div>
    </template>
  </Modal>
</template>
