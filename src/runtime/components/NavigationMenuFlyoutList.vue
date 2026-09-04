<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { buttonTheme } from '../theme/button'
import type { NavigationMenuThemeSlots } from '../theme/navigation-menu'
import type { NavigationMenuItem } from '../utils/navigation-menu'
import type { UiProp } from '../utils/ui'
import { computed } from 'vue'
import { NuxtLink } from '#components'
import { useRoute } from '#imports'
import { navigationMenuTheme } from '../theme/navigation-menu'
import { isNavigationMenuItemActive } from '../utils/navigation-menu'
import { resolveSlot, useComponentTheme } from '../utils/ui'
import Icon from './Icon.vue'
import NavigationMenuAccordionItem from './NavigationMenuAccordionItem.vue'

type ButtonVariants = VariantProps<typeof buttonTheme>

// A collapsed rail's own flyout (see NavigationMenu.vue) has nowhere
// further to collapse to - a child inside it that itself has children (a
// 3rd-level group, say) can't become its own nested flyout trigger the
// way a top-level one does. It renders as NavigationMenuAccordionItem
// instead - the exact same collapsible, chevron-toggled row the expanded
// (non-collapsed) sidebar already uses for its own nested groups - rather
// than a hand-rolled, permanently-expanded heading: a flyout can still
// hold an arbitrarily deep tree, and with no chevron there was no way to
// tell a 2nd-level group apart from one that was simply always fully
// expanded, nor any way to collapse it back down once open. This also
// means this file no longer recurses into itself - a group's own further
// nesting is entirely AccordionItem's own concern from here down, the
// same as it already is for the sidebar's expanded tree.
export interface NavigationMenuFlyoutListProps {
  items: NavigationMenuItem[]
  color?: ButtonVariants['color']
  variant?: 'pill' | 'link'
  highlight?: boolean
  onSelect: (item: NavigationMenuItem, event: Event) => void
  /** Set only from NavigationMenuFlyoutTrigger.vue, on this list's one top-level call - strips this list's own guide-line/indent, since (unlike every nesting level below it) it has no visible parent row inside the popover to connect to; the real "parent" is the icon trigger sitting outside the popover entirely. A group's own nested AccordionItem below keeps the normal indent/line treatment against its own real heading row untouched. */
  root?: boolean
  ui?: UiProp<NavigationMenuThemeSlots>
}

const props = defineProps<NavigationMenuFlyoutListProps>()

const route = useRoute()

function isActive(item: NavigationMenuItem) {
  return isNavigationMenuItemActive(item, route.path)
}

// Deliberately `collapsed: false` - same reasoning as NavigationMenu.vue's
// own flyoutUi, this content has room to show real labels.
const theme = useComponentTheme('navigationMenu', navigationMenuTheme)
const ui = computed(() => theme.value({ orientation: 'vertical', color: props.color, variant: props.variant, highlight: props.highlight, collapsed: false, flyoutRoot: props.root }))

function linkProps(item: NavigationMenuItem) {
  return resolveSlot(theme.value({ orientation: 'vertical', color: props.color, variant: props.variant, highlight: props.highlight, collapsed: false, active: isActive(item), disabled: item.disabled }).link, props.ui?.link)
}
</script>

<template>
  <ul v-bind="resolveSlot(ui.childList, props.ui?.childList)">
    <li v-for="item in items" :key="item.label" v-bind="resolveSlot(ui.childItem, props.ui?.childItem)">
      <NavigationMenuAccordionItem v-if="item.children?.length" :item="item" :color="color" :variant="variant" :highlight="highlight" :ui="props.ui" />
      <component
        :is="item.to ? NuxtLink : 'button'" v-else :to="item.to" :type="item.to ? undefined : 'button'"
        :disabled="item.to ? undefined : item.disabled" v-bind="linkProps(item)"
        :aria-disabled="item.to && item.disabled ? 'true' : undefined" @click="onSelect(item, $event)"
      >
        <Icon v-if="item.icon" :name="item.icon" v-bind="resolveSlot(ui.linkIcon, props.ui?.linkIcon)" />
        <span v-bind="resolveSlot(ui.linkLabel, props.ui?.linkLabel)">{{ item.label }}</span>
      </component>
    </li>
  </ul>
</template>
