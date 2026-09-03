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
}

export const DASHBOARD_INJECTION_KEY: InjectionKey<DashboardContext> = Symbol('selaras-dashboard')
