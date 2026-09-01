<script setup lang="ts">
import type { ButtonVariants } from '../theme/button'
import type { NavigationMenuSlots } from '../theme/navigation-menu'
import type { NavigationMenuItem } from '../utils/navigation-menu'
import type { UiProp } from '../utils/ui'
import {
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuRoot,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  NavigationMenuItem as RekaNavigationMenuItem,
} from 'reka-ui'
import { computed, useSlots } from 'vue'
import { useRoute } from '#imports'
import { useIcons } from '../composables/use-icons'
import { navigationMenuTheme } from '../theme/navigation-menu'
import { isNavigationMenuItemActive } from '../utils/navigation-menu'
import { resolveSlot, useComponentTheme } from '../utils/ui'
import Icon from './Icon.vue'
import NavigationMenuAccordionItem from './NavigationMenuAccordionItem.vue'

const props = withDefaults(defineProps<{
  items: NavigationMenuItem[]
  /** Horizontal uses Reka's real shared-viewport flyout for a single level of dropdown children. Vertical falls back to a recursive accordion (see NavigationMenuAccordionItem.vue) for arbitrary depth - Reka's own NavigationMenuContent isn't built for deep nested trees. */
  orientation?: 'horizontal' | 'vertical'
  color?: ButtonVariants['color']
  variant?: 'pill' | 'link'
  /** Draws a bar/underline next to the active item, in addition to its own color styling. */
  highlight?: boolean
  ui?: UiProp<NavigationMenuSlots>
}>(), {
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
const ui = computed(() => theme.value({ orientation: props.orientation, color: props.color, variant: props.variant, highlight: props.highlight }))

const rootProps = computed(() => resolveSlot(ui.value.root, props.ui?.root))
const listProps = computed(() => resolveSlot(ui.value.list, props.ui?.list))

function isActive(item: NavigationMenuItem) {
  return isNavigationMenuItemActive(item, route.path)
}

// Recomputed per item, not a single shared `ui` - active/disabled vary
// row-to-row (same reasoning as Dropdown.vue's own itemPropsFor).
function linkProps(item: NavigationMenuItem) {
  return resolveSlot(theme.value({ orientation: props.orientation, color: props.color, variant: props.variant, highlight: props.highlight, active: isActive(item), disabled: item.disabled }).link, props.ui?.link)
}

function childLinkProps(item: NavigationMenuItem) {
  return resolveSlot(theme.value({ orientation: props.orientation, color: props.color, variant: props.variant, highlight: props.highlight, active: isActive(item), disabled: item.disabled }).childLink, props.ui?.childLink)
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
        <RekaNavigationMenuItem v-for="item in items" :key="item.label" v-bind="resolveSlot(ui.item, props.ui?.item)">
          <template v-if="orientation === 'vertical' && item.children?.length">
            <NavigationMenuAccordionItem :item="item" :color="color" :variant="variant" :highlight="highlight" :ui="props.ui">
              <template v-for="(_, name) in slots" #[name]="scope">
                <slot :name="name" v-bind="scope" />
              </template>
            </NavigationMenuAccordionItem>
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
                      <NuxtLink :to="child.to" v-bind="childLinkProps(child)" @click="onSelect(child, $event)">
                        <slot :name="slotName(child, '')" :item="child" :active="isActive(child)">
                          <slot :name="slotName(child, '-leading')" :item="child" :active="isActive(child)">
                            <Icon v-if="child.icon" :name="child.icon" v-bind="resolveSlot(ui.linkIcon, props.ui?.linkIcon)" />
                          </slot>
                          <slot :name="slotName(child, '-label')" :item="child" :active="isActive(child)">
                            <span v-bind="resolveSlot(ui.childLinkLabel, props.ui?.childLinkLabel)">{{ child.label }}</span>
                          </slot>
                          <slot :name="slotName(child, '-trailing')" :item="child" :active="isActive(child)" />
                        </slot>
                      </NuxtLink>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </slot>
            </NavigationMenuContent>
          </template>
          <NavigationMenuLink v-else as-child :active="isActive(item)">
            <NuxtLink :to="item.to" v-bind="linkProps(item)" :aria-disabled="item.disabled ? 'true' : undefined" @click="onSelect(item, $event)">
              <slot :name="slotName(item, '')" :item="item" :active="isActive(item)">
                <slot :name="slotName(item, '-leading')" :item="item" :active="isActive(item)">
                  <Icon v-if="item.icon" :name="item.icon" v-bind="resolveSlot(ui.linkIcon, props.ui?.linkIcon)" />
                </slot>
                <slot :name="slotName(item, '-label')" :item="item" :active="isActive(item)">
                  <span v-bind="resolveSlot(ui.linkLabel, props.ui?.linkLabel)">{{ item.label }}</span>
                </slot>
                <slot :name="slotName(item, '-trailing')" :item="item" :active="isActive(item)" />
              </slot>
            </NuxtLink>
          </NavigationMenuLink>
        </RekaNavigationMenuItem>
      </NavigationMenuList>
      <slot name="list-trailing" />

      <div v-if="orientation === 'horizontal'" v-bind="resolveSlot(ui.viewportWrapper, props.ui?.viewportWrapper)">
        <NavigationMenuIndicator v-bind="resolveSlot(ui.indicator, props.ui?.indicator)">
          <div v-bind="resolveSlot(ui.arrow, props.ui?.arrow)" />
        </NavigationMenuIndicator>
        <NavigationMenuViewport v-bind="resolveSlot(ui.viewport, props.ui?.viewport)" />
      </div>
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
