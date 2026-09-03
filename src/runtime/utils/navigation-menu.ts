export interface NavigationMenuItem {
  label: string
  icon?: string
  to?: string
  disabled?: boolean
  /** Force active state - otherwise auto-detected against the current route when `to` is set. */
  active?: boolean
  /** One level for horizontal (Reka's own real limit for its shared-viewport flyout); arbitrary depth for vertical, which falls back to a recursive accordion instead. */
  children?: NavigationMenuItem[]
  onSelect?: (event: Event) => void
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
   * tree can't group its own children under a sub-heading. A comparable reference's own
   * "group" concept isn't a separate type here either - it's just a
   * `'label'` item followed by the ordinary items it's meant to
   * introduce, no wrapping structure needed for a flat array.
   */
  type?: 'link' | 'label' | 'separator'
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
