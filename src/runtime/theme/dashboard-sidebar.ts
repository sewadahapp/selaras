import { tv } from 'tailwind-variants'

export const dashboardSidebarTheme = tv({
  slots: {
    // flex flex-col so header/body/footer stack correctly regardless of
    // which root element renders (SplitterPanel on desktop, Drawer's own
    // content area on mobile) - both need the same internal layout. No
    // border of its own on the end edge - DashboardResizeHandle's own
    // line already draws that divider on desktop, and doubling it up
    // here just reads as two parallel lines a couple pixels apart.
    // transition-[flex-grow] animates the collapse/expand triggered via
    // DashboardNavbar's toggle button - a live drag updates flex-grow on
    // every pointermove instead, frequently enough that a short duration
    // like this reads as smoothed-out tracking rather than lag, not a
    // rubber-band fight against the cursor.
    // --ui-bg-elevated (not the base --ui-bg the main content area sits
    // on) - a step darker/lighter than the page background, the same
    // token hover states elsewhere already use for "a surface slightly
    // apart from the page" - gives the sidebar a genuine, real contrast
    // against DashboardPanel's own content instead of both areas reading
    // as one contiguous white/dark surface with only the resize-handle's
    // thin line between them.
    root: 'flex h-full flex-col overflow-hidden bg-[var(--ui-bg-elevated)] transition-[flex-grow] duration-200 ease-out',
    // No border, no height lock to DashboardNavbar's own h-14 - an
    // earlier version of this tried exactly that (to fix a real reported
    // bug: the two areas' bottom borders landing a few px apart), but
    // coupling this slot's height to a sibling it has no relationship to
    // is fragile in the wrong direction - it only stays aligned for
    // whatever header content happens to fit in 56px, and actively
    // clips anything taller (a logo plus a tagline, a search box). Sized
    // to its own content via plain padding instead, the same as footer
    // below - the sidebar's header and the navbar are independent areas
    // that don't need a shared horizontal datum line; a consumer who
    // wants a border under their own header content can add one via
    // `:ui="{ header: 'border-b ...' }"`.
    header: 'shrink-0 p-4',
    scrollArea: 'flex-1 min-h-0',
    body: 'p-2',
    footer: 'shrink-0 border-t border-[var(--ui-border)] p-4',
  },
})

export type DashboardSidebarThemeSlots = keyof (typeof dashboardSidebarTheme)['slots']
