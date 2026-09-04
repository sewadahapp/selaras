<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { buttonTheme } from '../theme/button'
import type { NavigationMenuThemeSlots } from '../theme/navigation-menu'
import type { NavigationMenuItem } from '../utils/navigation-menu'
import type { UiProp } from '../utils/ui'
import { computed, useId, useSlots } from 'vue'
import { NuxtLink } from '#components'
import { useRoute } from '#imports'
import { navigationMenuTheme } from '../theme/navigation-menu'
import { isNavigationMenuItemActive } from '../utils/navigation-menu'
import { resolveSlot, useComponentTheme } from '../utils/ui'
import Accordion from './Accordion.vue'
import Icon from './Icon.vue'
// Explicit self-import for the recursive reference below - this file is
// deliberately excluded from Nuxt's global component auto-scan (see the
// `ignore` entry in module.ts), so it can't rely on that scanner's own
// self-recursion resolution the way ContentNavigation.vue does; importing
// itself directly works regardless, via plain SFC self-recursion.
import NavigationMenuAccordionItem from './NavigationMenuAccordionItem.vue'

type ButtonVariants = VariantProps<typeof buttonTheme>

// Reka's real NavigationMenuContent/Viewport is a shallow, single-level
// flyout (see NavigationMenu.vue's own top-of-file note) - arbitrary-depth
// vertical trees recurse through this internal helper instead, which
// never re-invokes NavigationMenuRoot (that would nest a <nav> landmark
// inside a <nav> for every level - a real accessibility regression, not
// just a style mismatch). Mirrors ContentNavigation.vue's own recursive
// single-item-SAccordion-per-group technique.
//
// Every level (top or nested, leaf or group) styles itself off the exact
// same `link` slot - see navigation-menu.ts's own comment on that slot
// for why this file doesn't (and used to, wrongly) carry any of its own
// depth-specific styling. The visual step-in per level comes entirely
// from `childList`'s own start-margin/border below, not from anything a
// `nested`/depth prop would need to toggle here.
export interface NavigationMenuAccordionItemProps {
  item: NavigationMenuItem
  color?: ButtonVariants['color']
  variant?: 'pill' | 'link'
  highlight?: boolean
  ui?: UiProp<NavigationMenuThemeSlots>
}

const props = defineProps<NavigationMenuAccordionItemProps>()

const route = useRoute()
const slots = useSlots()

// Same resolver as NavigationMenu.vue - duplicated, not shared, matching
// this pair's existing precedent (onSelect is duplicated the same way).
function slotName(item: NavigationMenuItem, suffix: '' | '-leading' | '-label' | '-trailing' | '-content') {
  const named = item.slot ? `${item.slot}${suffix}` : undefined
  if (named && slots[named])
    return named
  return `item${suffix}`
}

const theme = useComponentTheme('navigationMenu', navigationMenuTheme)
const ui = computed(() => theme.value({ orientation: 'vertical', color: props.color, variant: props.variant, highlight: props.highlight }))

const accordionValue = useId()
const accordionItems = computed(() => [{ value: accordionValue, label: props.item.label, disabled: props.item.disabled }])

// Accordion's own generic trigger doesn't know about this item's active
// state or the nav theme's link styling - built here from the same `link`
// slot every leaf link uses, so a parent-with-children row looks like a
// natural extension of its own sibling leaf links, not a visually
// different "accordion" widget.
const groupUi = computed(() => ({
  item: '',
  trigger: `${ui.value.link({ active: false, disabled: props.item.disabled })} w-full justify-between text-start`,
  label: 'inline-flex min-w-0 items-center gap-2',
  chevron: ui.value.linkTrailingIcon(),
  content: ui.value.content(),
}))

function isActive(item: NavigationMenuItem) {
  return isNavigationMenuItemActive(item, route.path)
}

// Recomputed per child, not the shared `ui` above - active/disabled vary
// row-to-row (same reasoning as NavigationMenu.vue's own linkProps). Must
// live in <script>, not called inline in the template - a top-level
// `computed()` like `theme` is auto-unwrapped in templates, so writing
// `theme.value(...)` there would try to read `.value` off the already-
// unwrapped function itself.
function linkProps(child: NavigationMenuItem) {
  return resolveSlot(theme.value({ orientation: 'vertical', color: props.color, variant: props.variant, highlight: props.highlight, active: isActive(child), disabled: child.disabled }).link, props.ui?.link)
}

// Reka's real NavigationMenuLink has no `disabled` prop - a disabled leaf
// link stays visually/aria disabled and simply swallows the click rather
// than navigating or firing onSelect. Mirrors NavigationMenu.vue's own
// onSelect guard.
function onSelect(item: NavigationMenuItem, event: Event) {
  if (item.disabled) {
    event.preventDefault()
    return
  }
  item.onSelect?.(event)
}
</script>

<template>
  <Accordion :items="accordionItems" :default-value="[]" :ui="groupUi">
    <template #label>
      <slot :name="slotName(item, '')" :item="item" :active="false">
        <slot :name="slotName(item, '-leading')" :item="item" :active="false">
          <Icon v-if="item.icon" :name="item.icon" v-bind="resolveSlot(ui.linkIcon, props.ui?.linkIcon)" />
        </slot>
        <slot :name="slotName(item, '-label')" :item="item" :active="false">
          <span v-bind="resolveSlot(ui.linkLabel, props.ui?.linkLabel)">{{ item.label }}</span>
        </slot>
      </slot>
    </template>
    <template #[accordionValue]>
      <slot :name="slotName(item, '-content')" :item="item">
        <ul v-bind="resolveSlot(ui.childList, props.ui?.childList)">
          <li v-for="child in item.children" :key="child.label" v-bind="resolveSlot(ui.childItem, props.ui?.childItem)">
            <NavigationMenuAccordionItem
              v-if="child.children?.length"
              :item="child"
              :color="color"
              :variant="variant"
              :highlight="highlight"
              :ui="props.ui"
            >
              <template v-for="(_, name) in slots" #[name]="scope">
                <slot :name="name" v-bind="scope" />
              </template>
            </NavigationMenuAccordionItem>
            <component
              :is="child.to ? NuxtLink : 'button'"
              v-else
              :to="child.to"
              :type="child.to ? undefined : 'button'"
              :disabled="child.to ? undefined : child.disabled"
              v-bind="linkProps(child)"
              :aria-disabled="child.to && child.disabled ? 'true' : undefined"
              @click="onSelect(child, $event)"
            >
              <slot :name="slotName(child, '')" :item="child" :active="isActive(child)">
                <slot :name="slotName(child, '-leading')" :item="child" :active="isActive(child)">
                  <Icon v-if="child.icon" :name="child.icon" v-bind="resolveSlot(ui.linkIcon, props.ui?.linkIcon)" />
                </slot>
                <slot :name="slotName(child, '-label')" :item="child" :active="isActive(child)">
                  <span v-bind="resolveSlot(ui.linkLabel, props.ui?.linkLabel)">{{ child.label }}</span>
                </slot>
                <slot :name="slotName(child, '-trailing')" :item="child" :active="isActive(child)" />
              </slot>
            </component>
          </li>
        </ul>
      </slot>
    </template>
  </Accordion>
</template>
