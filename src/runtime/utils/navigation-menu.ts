import type { PopoverProps } from '../components/Popover.vue'
import type { TooltipProps } from '../components/Tooltip.vue'
import type { HotkeyOptions } from '../directives/hotkey'
import type { OverlayPositioning } from './overlay'

export type NavigationMenuPopover = Pick<PopoverProps, 'side' | 'align' | 'positioning' | 'portal' | 'arrow' | 'ui'>
/** Alignment of a horizontal navigation menu's compact dropdown. */
export type NavigationMenuPositioning = Pick<OverlayPositioning, 'align'>

export interface NavigationMenuItem {
  label: string
  icon?: string
  to?: string
  target?: string
  rel?: string
  ariaLabel?: string
  /** Collapsed leaf tooltip override. `false` disables this item's tooltip. */
  tooltip?: boolean | TooltipProps
  /** Presentation of this item's collapsed child flyout. */
  popover?: NavigationMenuPopover
  disabled?: boolean
  /** Force active state - otherwise auto-detected against the current route when `to` is set. */
  active?: boolean
  /** One level for horizontal (Reka's own real limit for its shared-viewport flyout); arbitrary depth for vertical, which falls back to a recursive accordion instead. */
  children?: NavigationMenuItem[]
  onSelect?: (event: Event) => void
  /** Display a keyboard shortcut hint beside this item's label. */
  shortcut?: string
  /** Bind `shortcut` page-wide, so the key activates this item from anywhere except while typing in a field. */
  hotkey?: boolean
  /** Targets this item's own named slots (`#{slot}`, `#{slot}-leading`, `#{slot}-label`, `#{slot}-trailing`, `#{slot}-content`) ahead of the generic `#item`/`#item-leading`/etc, when the named one is actually provided. */
  slot?: string
  /**
   * `'link'` (default) is a real navigable/selectable item - everything
   * above applies. `'label'` renders a non-interactive section heading
   * above the items that follow it in the same top-level array - only
   * `label` (and optionally `icon`) are read, everything else is
   * ignored. `'separator'` renders a thin divider line and reads nothing
   * but still needs a unique `label` (unused for display) since every
   * item's `label` doubles as its list key.
   *
   * Top-level only - a `children` array doesn't check this, so a nested
   * tree can't group its own children under a sub-heading. A comparable
   * reference's own "group" concept isn't a separate type here either -
   * it's just a `'label'` item followed by the ordinary items it's meant
   * to introduce, no wrapping structure needed for a flat array.
   */
  type?: 'link' | 'label' | 'separator'
  /** Not read by NavigationMenu's own default rendering - carried purely so a custom #item-content/#{slot}-content slot override can display one (a "mega menu" style description under each link, say). */
  description?: string
}

// Shared between NavigationMenu.vue (top level, both orientations) and
// NavigationMenuAccordionItem.vue (vertical's recursive children) - kept
// as one function rather than duplicated per-file, since the two must
// stay behaviorally identical (unlike a whole component's worth of
// duplication, a route-matching boolean silently drifting apart between
// two copies would be a real, hard-to-notice bug).
export function isNavigationMenuItemActive(item: NavigationMenuItem, currentPath: string): boolean {
  if (item.active !== undefined)
    return item.active
  return item.to !== undefined && item.to === currentPath
}

/** The v-hotkey binding for an item that opts in with `hotkey: true`. */
export function navigationMenuHotkey(item: NavigationMenuItem): HotkeyOptions | undefined {
  return item.hotkey && item.shortcut && !item.disabled ? { keys: item.shortcut } : undefined
}

interface CollapsedNavigationMenuEntry {
  item: NavigationMenuItem
  boundary: false | 'separator' | 'spacing'
}

/** Defer a boundary until the next action, avoiding edge and repeated dividers. */
export function collapsedNavigationMenuEntries(items: NavigationMenuItem[], presentation: 'separator' | 'spacing' | 'none'): CollapsedNavigationMenuEntry[] {
  const entries: CollapsedNavigationMenuEntry[] = []
  let hasAction = false
  let groupBoundary = false
  let explicitBoundary = false
  for (const item of items) {
    if (item.type === 'separator') {
      explicitBoundary = hasAction
      continue
    }
    if (item.type === 'label') {
      entries.push({ item, boundary: false })
      groupBoundary = hasAction
      continue
    }
    const boundary = explicitBoundary ? 'separator' : groupBoundary && presentation !== 'none' ? presentation : false
    if (boundary)
      entries.push({ item: { label: item.label, type: 'separator' }, boundary })
    entries.push({ item, boundary: false })
    hasAction = true
    groupBoundary = false
    explicitBoundary = false
  }
  return entries
}
