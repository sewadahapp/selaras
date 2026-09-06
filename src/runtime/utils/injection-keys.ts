import type { ComputedRef, InjectionKey, Ref } from 'vue'

export const AVATAR_SIZE_INJECTION_KEY: InjectionKey<ComputedRef<'sm' | 'md' | 'lg' | undefined>> = Symbol('selaras-avatar-size')

/**
 * Shared from DashboardGroup down to DashboardSidebar, DashboardPanel, and
 * DashboardNavbar - all three need it, and DashboardGroup is the one
 * actual common ancestor of all three (DashboardSidebar/DashboardNavbar
 * are themselves siblings under it, not ancestor/descendant of each
 * other, so a `provide()` from either one directly would never reach the
 * other - confirmed the hard way: DashboardSidebar originally provided
 * its own toggle function directly, which DashboardNavbar's inject()
 * silently never received).
 *
 * `toggleSidebar` is a ref (not a plain function) because DashboardGroup
 * itself doesn't know how to toggle anything - only DashboardSidebar
 * does, once it mounts and knows which mechanism (the Splitter panel's
 * collapse, or the mobile drawer's open state) is actually active - so
 * DashboardSidebar populates this ref with the real function, and
 * DashboardNavbar just calls whatever's currently in it.
 */
export interface DashboardContext {
  isMobile: Ref<boolean>
  toggleSidebar: Ref<(() => void) | undefined>
  /**
   * Same populate-after-mount reasoning as `toggleSidebar` - DashboardGroup
   * doesn't know the sidebar's own collapsed state, only DashboardSidebar
   * does, so it keeps this ref's value in sync. On mobile this tracks the
   * drawer's own closed/open state (closed = "collapsed", the same
   * "sidebar isn't currently taking up space" meaning collapsed has on
   * desktop) rather than a hardcoded `false` - DashboardSidebarToggle
   * mirrors its icon off this one flag regardless of which mode is active.
   */
  isSidebarCollapsed: Ref<boolean>
  /**
   * Owned by DashboardGroup itself (not DashboardSidebar) for a real
   * reason, not just consistency with the other two - DashboardGroup's
   * own `v-if="!isMobile"`/`v-else` wraps its *entire* default slot, not
   * just the Splitter, so DashboardSidebar (along with everything else in
   * that slot) is fully unmounted and re-created on every mobile
   * transition, not merely swapping an internal branch. A value living on
   * DashboardSidebar's own instance can't survive that - it's gone the
   * moment the old instance is torn down, before a fresh instance's own
   * watchers ever get a chance to observe the transition. DashboardGroup
   * is the one thing that actually persists across it, so the last known
   * desktop pixel width has to live here instead, written by
   * DashboardSidebar's own `resize` handler and read back by a freshly
   * mounted DashboardSidebar to correct Reka's own cookie-restored
   * percentage (recalibrated against whatever the container's width
   * happens to be at that specific remount - see DashboardSidebar.vue's
   * own comment for the full explanation).
   */
  lastDesktopWidthPx: Ref<number | undefined>
}

export const DASHBOARD_INJECTION_KEY: InjectionKey<DashboardContext> = Symbol('selaras-dashboard')

/**
 * Provided by STheme (Theme.vue), read by useComponentTheme/useThemeProps
 * (utils/ui.ts) - `parent` is a deliberate back-reference to whatever
 * STheme (if any) the providing one is itself nested inside, rather than
 * a pre-merged bag: this lets the read side walk the *whole* ancestor
 * chain and compose overrides in the correct outermost-to-innermost
 * order (see useComponentTheme's own collectThemeChain), so nesting two
 * STheme components inherits an outer one's unset slots/props instead of
 * an inner one wholesale replacing it.
 */
export interface ThemeContext {
  ui?: Partial<Record<string, object>>
  props?: Partial<Record<string, Record<string, unknown>>>
  parent?: ThemeContext
}
export const THEME_INJECTION_KEY: InjectionKey<ComputedRef<ThemeContext>> = Symbol('selaras-theme')
