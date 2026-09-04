<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { buttonTheme } from '../theme/button'
import type { NavigationMenuThemeSlots } from '../theme/navigation-menu'
import type { NavigationMenuItem } from '../utils/navigation-menu'
import type { UiProp } from '../utils/ui'
import {
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuRoot,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  NavigationMenuItem as RekaNavigationMenuItem,
} from 'reka-ui'
import { computed, ref, useSlots } from 'vue'
import { NuxtLink } from '#components'
import { useRoute } from '#imports'
import { useIcons } from '../composables/use-icons'
import { navigationMenuTheme } from '../theme/navigation-menu'
import { isNavigationMenuItemActive } from '../utils/navigation-menu'
import { resolveSlot, useComponentTheme } from '../utils/ui'
import Icon from './Icon.vue'
import NavigationMenuAccordionItem from './NavigationMenuAccordionItem.vue'
import NavigationMenuFlyoutTrigger from './NavigationMenuFlyoutTrigger.vue'

type ButtonVariants = VariantProps<typeof buttonTheme>

export interface NavigationMenuProps {
  items: NavigationMenuItem[]
  /** Horizontal uses Reka's real shared-viewport flyout for a single level of dropdown children. Vertical falls back to a recursive accordion (see NavigationMenuAccordionItem.vue) for arbitrary depth - Reka's own NavigationMenuContent isn't built for deep nested trees. */
  orientation?: 'horizontal' | 'vertical'
  color?: ButtonVariants['color']
  variant?: 'pill' | 'link'
  /** Draws a bar/underline next to the active item, in addition to its own color styling. */
  highlight?: boolean
  /** Icon-only rail mode (vertical only) - labels stay in the DOM for assistive tech (`sr-only`, not removed) but visually collapse to just each item's own leading icon. A parent with children renders as a themed Popover trigger instead of an expandable accordion row - no room for a nested list in an icon rail, so its children surface in a flyout next to the icon instead (the common "collapsed sidebar" pattern - VSCode's activity bar, Linear, Notion). */
  collapsed?: boolean
  ui?: UiProp<NavigationMenuThemeSlots>
}

const props = withDefaults(defineProps<NavigationMenuProps>(), {
  orientation: 'horizontal',
  variant: 'pill',
})

const route = useRoute()
const icons = useIcons()
const slots = useSlots()

// Mirrors a comparable reference's own per-item slot override: an item can set
// `slot: 'myName'` to target `#myName-content` etc ahead of the generic
// `#item-content`, but only if that named slot is actually provided -
// otherwise this falls through to the generic one.
function slotName(item: NavigationMenuItem, suffix: '' | '-leading' | '-label' | '-trailing' | '-content') {
  const named = item.slot ? `${item.slot}${suffix}` : undefined
  if (named && slots[named])
    return named
  return `item${suffix}`
}

const theme = useComponentTheme('navigationMenu', navigationMenuTheme)
const ui = computed(() => theme.value({ orientation: props.orientation, color: props.color, variant: props.variant, highlight: props.highlight, collapsed: props.collapsed }))

const rootProps = computed(() => resolveSlot(ui.value.root, props.ui?.root))
const listProps = computed(() => resolveSlot(ui.value.list, props.ui?.list))

function isActive(item: NavigationMenuItem) {
  return isNavigationMenuItemActive(item, route.path)
}

// Recomputed per item, not a single shared `ui` - active/disabled vary
// row-to-row (same reasoning as Dropdown.vue's own itemPropsFor).
function linkProps(item: NavigationMenuItem) {
  return resolveSlot(theme.value({ orientation: props.orientation, color: props.color, variant: props.variant, highlight: props.highlight, collapsed: props.collapsed, active: isActive(item), disabled: item.disabled }).link, props.ui?.link)
}

function childLinkProps(item: NavigationMenuItem) {
  return resolveSlot(theme.value({ orientation: props.orientation, color: props.color, variant: props.variant, highlight: props.highlight, collapsed: props.collapsed, active: isActive(item), disabled: item.disabled }).childLink, props.ui?.childLink)
}

// A collapsed rail's own flyout triggers (see NavigationMenuFlyoutTrigger.vue)
// each open on hover, but only one may be open at a time - held here, one
// level up from every trigger, rather than as local state per trigger, so
// opening one *synchronously* closes whichever other one was already open
// instead of leaving both open until an independent close timer catches
// up (the real cause of "hovering down the rail opens several flyouts at
// once", confirmed live). Guarded rather than a bare setter: a trigger's
// own stale close timer can still fire after focus has already moved to a
// different item - without the `openFlyoutLabel === item.label` check, that
// stale `false` would clobber whichever item is now legitimately open.
const openFlyoutLabel = ref<string | null>(null)
function onFlyoutOpenChange(item: NavigationMenuItem, value: boolean) {
  if (value)
    openFlyoutLabel.value = item.label
  else if (openFlyoutLabel.value === item.label)
    openFlyoutLabel.value = null
}

// Regression: Reka returns focus to a popover's own trigger on close
// regardless of *why* it closed - including this one closing because a
// sibling just took over. That's correct default behavior for a genuine
// dismiss (Escape, outside click) but wrong for the mutual-exclusion
// case, where the *closing* item's own trigger stealing focus back from
// the sibling that's now legitimately open is exactly the bug the shared
// `openFlyoutLabel` above already fixed once - and did so again here,
// since NavigationMenuFlyoutTrigger.vue needs to tell them apart to
// know whether to allow Reka's own return-focus for a given close.
function anotherFlyoutOpen(item: NavigationMenuItem) {
  return openFlyoutLabel.value !== null && openFlyoutLabel.value !== item.label
}

// Reka's real NavigationMenuLink has no `disabled` prop (confirmed via its
// source) - a disabled leaf link stays visually/aria disabled and simply
// swallows the click rather than navigating or firing onSelect.
function onSelect(item: NavigationMenuItem, event: Event) {
  if (item.disabled) {
    event.preventDefault()
    return
  }
  item.onSelect?.(event)
}

// Flattens the whole tree (arbitrary depth) for the ClientOnly fallback
// below - a flat link list, not a recursive component, since the
// fallback's only job is basic no-JS/crawler accessibility, not feature
// completeness (mirrors Accordion.vue's own "permanently expanded,
// simplified" fallback).
function flatten(list: NavigationMenuItem[], depth = 0): { item: NavigationMenuItem, depth: number }[] {
  return list.flatMap(item => [
    { item, depth },
    ...(item.children ? flatten(item.children, depth + 1) : []),
  ])
}
const fallbackItems = computed(() => flatten(props.items))
</script>

<template>
  <ClientOnly>
    <NavigationMenuRoot :orientation="orientation" v-bind="rootProps">
      <slot name="list-leading" />
      <NavigationMenuList v-bind="listProps">
        <template v-for="item in items" :key="item.label">
          <li v-if="item.type === 'separator'" role="separator" v-bind="resolveSlot(ui.separator, props.ui?.separator)" />
          <li v-else-if="item.type === 'label'" v-bind="resolveSlot(ui.groupLabel, props.ui?.groupLabel)">
            <slot :name="slotName(item, '-label')" :item="item" :active="false">
              {{ item.label }}
            </slot>
          </li>
          <RekaNavigationMenuItem v-else v-bind="resolveSlot(ui.item, props.ui?.item)">
            <template v-if="orientation === 'vertical' && item.children?.length && !collapsed">
              <NavigationMenuAccordionItem :item="item" :color="color" :variant="variant" :highlight="highlight" :ui="props.ui">
                <template v-for="(_, name) in slots" #[name]="scope">
                  <slot :name="name" v-bind="scope" />
                </template>
              </NavigationMenuAccordionItem>
            </template>
            <template v-else-if="orientation === 'vertical' && item.children?.length && collapsed">
              <NavigationMenuFlyoutTrigger
                :item="item" :color="color" :variant="variant" :highlight="highlight" :on-select="onSelect" :ui="props.ui"
                :open="openFlyoutLabel === item.label" :another-flyout-open="anotherFlyoutOpen(item)"
                @update:open="onFlyoutOpenChange(item, $event)"
              >
                <template v-for="(_, name) in slots" #[name]="scope">
                  <slot :name="name" v-bind="scope" />
                </template>
              </NavigationMenuFlyoutTrigger>
            </template>
            <template v-else-if="orientation === 'horizontal' && item.children?.length">
              <NavigationMenuTrigger :disabled="item.disabled" v-bind="linkProps(item)">
                <slot :name="slotName(item, '')" :item="item" :active="isActive(item)">
                  <slot :name="slotName(item, '-leading')" :item="item" :active="isActive(item)">
                    <Icon v-if="item.icon" :name="item.icon" v-bind="resolveSlot(ui.linkIcon, props.ui?.linkIcon)" />
                  </slot>
                  <slot :name="slotName(item, '-label')" :item="item" :active="isActive(item)">
                    <span v-bind="resolveSlot(ui.linkLabel, props.ui?.linkLabel)">{{ item.label }}</span>
                  </slot>
                  <slot :name="slotName(item, '-trailing')" :item="item" :active="isActive(item)">
                    <Icon :name="icons.chevronDown" v-bind="resolveSlot(ui.linkTrailingIcon, props.ui?.linkTrailingIcon)" />
                  </slot>
                </slot>
              </NavigationMenuTrigger>
              <NavigationMenuContent v-bind="resolveSlot(ui.content, props.ui?.content)">
                <slot :name="slotName(item, '-content')" :item="item">
                  <ul v-bind="resolveSlot(ui.childList, props.ui?.childList)">
                    <li v-for="child in item.children" :key="child.label" v-bind="resolveSlot(ui.childItem, props.ui?.childItem)">
                      <NavigationMenuLink as-child :active="isActive(child)">
                        <component
                          :is="child.to ? NuxtLink : 'button'" :to="child.to" :type="child.to ? undefined : 'button'"
                          :disabled="child.to ? undefined : child.disabled" v-bind="childLinkProps(child)"
                          :aria-disabled="child.to && child.disabled ? 'true' : undefined" @click="onSelect(child, $event)"
                        >
                          <slot :name="slotName(child, '')" :item="child" :active="isActive(child)">
                            <slot :name="slotName(child, '-leading')" :item="child" :active="isActive(child)">
                              <Icon v-if="child.icon" :name="child.icon" v-bind="resolveSlot(ui.linkIcon, props.ui?.linkIcon)" />
                            </slot>
                            <slot :name="slotName(child, '-label')" :item="child" :active="isActive(child)">
                              <span v-bind="resolveSlot(ui.childLinkLabel, props.ui?.childLinkLabel)">{{ child.label }}</span>
                            </slot>
                            <slot :name="slotName(child, '-trailing')" :item="child" :active="isActive(child)" />
                          </slot>
                        </component>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </slot>
              </NavigationMenuContent>
            </template>
            <NavigationMenuLink v-else as-child :active="isActive(item)">
              <component
                :is="item.to ? NuxtLink : 'button'" :to="item.to" :type="item.to ? undefined : 'button'"
                :disabled="item.to ? undefined : item.disabled" v-bind="linkProps(item)"
                :aria-disabled="item.to && item.disabled ? 'true' : undefined" @click="onSelect(item, $event)"
              >
                <slot :name="slotName(item, '')" :item="item" :active="isActive(item)">
                  <slot :name="slotName(item, '-leading')" :item="item" :active="isActive(item)">
                    <Icon v-if="item.icon" :name="item.icon" v-bind="resolveSlot(ui.linkIcon, props.ui?.linkIcon)" />
                    <span v-else-if="collapsed" v-bind="resolveSlot(ui.linkIconFallback, props.ui?.linkIconFallback)" aria-hidden="true">{{ item.label.charAt(0) }}</span>
                  </slot>
                  <slot :name="slotName(item, '-label')" :item="item" :active="isActive(item)">
                    <span v-bind="resolveSlot(ui.linkLabel, props.ui?.linkLabel)">{{ item.label }}</span>
                  </slot>
                  <slot :name="slotName(item, '-trailing')" :item="item" :active="isActive(item)" />
                </slot>
              </component>
            </NavigationMenuLink>
          </RekaNavigationMenuItem>
        </template>
      </NavigationMenuList>
      <slot name="list-trailing" />

      <NavigationMenuViewport v-if="orientation === 'horizontal'" v-bind="resolveSlot(ui.viewport, props.ui?.viewport)" />
    </NavigationMenuRoot>

    <!--
      Reka UI compound components (provide/inject based) crash production SSR
      builds in this project with `null is not an object (evaluating
      'currentRenderingInstance.ce')` - the same pre-existing issue
      Accordion.vue/ScrollArea.vue already work around (confirmed here too,
      via a real `nuxt build` + serving the built output - dev mode SSR does
      not reproduce it). The fallback flattens the whole tree into plain
      links - no dropdown/accordion interactivity, but fully readable/
      navigable for SSR, no-JS, and crawlers, rather than nothing.
    -->
    <template #fallback>
      <nav v-bind="rootProps">
        <ul v-bind="listProps">
          <li v-for="{ item, depth } in fallbackItems" :key="item.label" :style="{ paddingInlineStart: `${depth}rem` }" v-bind="resolveSlot(ui.item, props.ui?.item)">
            <NuxtLink v-if="item.to" :to="item.to" v-bind="linkProps(item)" :aria-disabled="item.disabled ? 'true' : undefined">
              <Icon v-if="item.icon" :name="item.icon" v-bind="resolveSlot(ui.linkIcon, props.ui?.linkIcon)" />
              <span v-bind="resolveSlot(ui.linkLabel, props.ui?.linkLabel)">{{ item.label }}</span>
            </NuxtLink>
            <span v-else v-bind="resolveSlot(ui.linkLabel, props.ui?.linkLabel)">
              <Icon v-if="item.icon" :name="item.icon" v-bind="resolveSlot(ui.linkIcon, props.ui?.linkIcon)" />
              {{ item.label }}
            </span>
          </li>
        </ul>
      </nav>
    </template>
  </ClientOnly>
</template>
