<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { buttonTheme } from '../theme/button'
import type { NavigationMenuThemeSlots } from '../theme/navigation-menu'
import type { NavigationMenuItem } from '../utils/navigation-menu'
import type { UiProp } from '../utils/ui'
import { computed, useSlots } from 'vue'
import { navigationMenuTheme } from '../theme/navigation-menu'
import { resolveSlot, useComponentTheme } from '../utils/ui'
import Icon from './Icon.vue'
import NavigationMenuFlyoutList from './NavigationMenuFlyoutList.vue'
import Popover from './Popover.vue'

type ButtonVariants = VariantProps<typeof buttonTheme>

// A collapsed rail's own parent-with-children trigger (see NavigationMenu.vue's
// own `collapsed` prop) - split out from that file for the same reason
// NavigationMenuAccordionItem/NavigationMenuFlyoutList already are: this
// needs its own local, per-instance state (the open/close hover timers
// below), which a `v-for` iteration in the parent template can't hold.
//
// Opens on hover as well as on click - a collapsed rail's icon has no
// chevron/label to hint that it even has children, so requiring a click
// just to find that out is a real discoverability dead end. A short
// close delay (rather than closing the instant the pointer leaves the
// trigger) survives the real gap the pointer has to cross to reach the
// portaled popover content itself; both the trigger and the content
// cancel it on re-entry. Click still works unassisted (Reka's own
// PopoverTrigger toggles `open` regardless of how it got there), so touch
// devices - which never fire hover at all - aren't left with no way in.
// Deliberately no `@focus`/`@blur` pair here alongside the hover one - Reka's
// own PopoverContent returns focus to its trigger on close by default
// (regardless of *why* it closed, including this component's own
// programmatic `open:false`), which would fire a `focus` event on this
// exact button; pairing that with an `@focus` handler that reopens it
// created a live reopen loop against the mutual-exclusion logic below.
//
// `open` is a *controlled* prop, not local state - NavigationMenu.vue owns
// a single shared "which flyout is open" value across every sibling
// trigger in the rail. Regression: this used to be a local `ref` per
// instance, which meant hovering down a tightly-packed rail could leave
// several siblings open at once (each one's own close timer hadn't fired
// yet by the time the next one's hover opened it) - sharing one value
// upstream makes opening item B *synchronously* close item A's popover
// the instant B opens, rather than racing two independent 200ms timers
// against each other.
//
// `anotherFlyoutOpen` (also from NavigationMenu.vue's shared state) drives
// `return-focus-on-close` below, and needs to be reactive rather than a
// flat `false` - Reka's default return-focus-to-trigger-on-close is
// exactly what a *genuine* Escape/outside-click dismiss should do (skip
// it entirely and keyboard focus is simply abandoned on close, a real
// regression on its own); it only needs suppressing for the one case
// where *this* item is closing because a sibling just took over, whose
// own delayed return-focus (it waits on this item's close transition)
// would otherwise land back on this trigger well after the sibling has
// already opened and taken focus into its own content - which Reka reads
// as focus having moved "outside" the sibling's popover and dismisses it
// too, even though the pointer never left it (confirmed live: hovering
// a second trigger closed the first correctly, but a few hundred ms
// later the first's return-focus silently closed the second as well).
export interface NavigationMenuFlyoutTriggerProps {
  item: NavigationMenuItem
  color?: ButtonVariants['color']
  variant?: 'pill' | 'link'
  highlight?: boolean
  open: boolean
  /** Whether a *different* sibling trigger currently holds the flyout - see the note above on why `return-focus-on-close` needs this rather than a flat `false`. */
  anotherFlyoutOpen?: boolean
  onSelect: (item: NavigationMenuItem, event: Event) => void
  ui?: UiProp<NavigationMenuThemeSlots>
}

export interface NavigationMenuFlyoutTriggerEmits {
  'update:open': [value: boolean]
}

const props = defineProps<NavigationMenuFlyoutTriggerProps>()
const emit = defineEmits<NavigationMenuFlyoutTriggerEmits>()

const slots = useSlots()

// Same resolver as NavigationMenu.vue/NavigationMenuAccordionItem.vue -
// duplicated, not shared, matching this trio's existing precedent.
function slotName(item: NavigationMenuItem, suffix: '' | '-leading' | '-label' | '-content') {
  const named = item.slot ? `${item.slot}${suffix}` : undefined
  if (named && slots[named])
    return named
  return `item${suffix}`
}

const theme = useComponentTheme('navigationMenu', navigationMenuTheme)
const ui = computed(() => theme.value({ orientation: 'vertical', color: props.color, variant: props.variant, highlight: props.highlight, collapsed: true, active: false, disabled: props.item.disabled }))

let closeTimer: ReturnType<typeof setTimeout> | undefined

function cancelClose() {
  if (closeTimer !== undefined) {
    clearTimeout(closeTimer)
    closeTimer = undefined
  }
}

// Tracks whether the *current* open happened via hover, so `onOpenAutoFocus`
// below can tell a mouse-hover open apart from a click/keyboard one - Reka
// autofocusing content is exactly what a keyboard user needs to actually
// reach a flyout portaled elsewhere in the DOM (there's no natural Tab
// order from this button into it otherwise), but the same programmatic
// focus for a hover-driven open paints a visible focus ring on whatever
// it lands on despite no keyboard ever being touched (confirmed live:
// hovering "Team" alone put a ring around "Permissions" inside it, before
// any click). Reset to `false` on a real click of this button - a mouse
// click on the trigger should keep Reka's normal autofocus behavior
// (matching how every other Popover-based trigger in the app already
// behaves), it's only the hover path that's new here and needs opting out.
let openedViaHover = false

function openNow() {
  cancelClose()
  openedViaHover = true
  emit('update:open', true)
}
function scheduleClose() {
  cancelClose()
  closeTimer = setTimeout(() => {
    emit('update:open', false)
  }, 200)
}
function onTriggerClick() {
  openedViaHover = false
}
function onOpenAutoFocus(event: Event) {
  if (openedViaHover)
    event.preventDefault()
}
</script>

<template>
  <Popover
    :open="open" side="right" align="start" :return-focus-on-close="!anotherFlyoutOpen" :ui="{ content: 'p-2' }"
    @update:open="emit('update:open', $event)" @open-auto-focus="onOpenAutoFocus"
  >
    <button
      type="button"
      :disabled="item.disabled"
      v-bind="resolveSlot(ui.link, props.ui?.link)"
      @mouseenter="openNow"
      @mouseleave="scheduleClose"
      @click="onTriggerClick"
    >
      <slot :name="slotName(item, '-leading')" :item="item" :active="false">
        <Icon v-if="item.icon" :name="item.icon" v-bind="resolveSlot(ui.linkIcon, props.ui?.linkIcon)" />
        <span v-else v-bind="resolveSlot(ui.linkIconFallback, props.ui?.linkIconFallback)" aria-hidden="true">{{ item.label.charAt(0) }}</span>
      </slot>
      <slot :name="slotName(item, '-label')" :item="item" :active="false">
        <span v-bind="resolveSlot(ui.linkLabel, props.ui?.linkLabel)">{{ item.label }}</span>
      </slot>
    </button>
    <template #content>
      <div @mouseenter="cancelClose" @mouseleave="scheduleClose">
        <slot :name="slotName(item, '-content')" :item="item">
          <NavigationMenuFlyoutList :items="item.children ?? []" :color="color" :variant="variant" :highlight="highlight" :on-select="onSelect" :ui="props.ui" root />
        </slot>
      </div>
    </template>
  </Popover>
</template>
