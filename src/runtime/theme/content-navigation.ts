import { tv } from 'tailwind-variants'

export const contentNavigationTheme = tv({
  slots: {
    root: 'flex flex-col gap-0.5 text-sm',
    // The tree-connector rail (trunk segment + elbow, see theme.css's
    // own comment on `.selaras-nav-elbow` for the full technique) -
    // both pieces live on this item, not the parent `content` list, so
    // neither can bleed into any nested content this same item stacks
    // below its own row when expanded.
    item: 'selaras-nav-elbow selaras-nav-elbow--content-navigation flex flex-col',
    // py-2.5 (+ text-sm's 20px line-height) lands close to the 44px touch
    // target guideline without doubling the sidebar's height the way a
    // literal py-3 would across ~40 entries.
    link: 'flex items-center gap-2 rounded-[var(--ui-radius-sm)] px-2 py-2.5 text-[var(--ui-text-muted)] transition-colors hover:bg-[var(--ui-bg-elevated)] hover:text-[var(--ui-text)]',
    linkActive: 'flex items-center gap-2 rounded-[var(--ui-radius-sm)] bg-[var(--ui-primary-soft)] px-2 py-2.5 text-[var(--ui-primary)]',
    trigger: 'group flex w-full items-center justify-between gap-2 rounded-[var(--ui-radius-sm)] px-2 py-2.5 text-start font-medium text-[var(--ui-text)] transition-colors hover:bg-[var(--ui-bg-elevated)]',
    // A separate slot from label - this styles the icon a link/group-header
    // shows before its title, not the title text itself.
    icon: 'size-4 shrink-0 text-[var(--ui-text-muted)]',
    chevron: 'size-4 shrink-0 text-[var(--ui-text-muted)] transition-transform group-data-[state=open]:rotate-180',
    // `ps-4` (16px) reserves the gutter each child's own trunk segment
    // and elbow (on the `item` slot above) reach back into - the trunk
    // line itself has no presence here at all, see theme.css's own
    // `.selaras-nav-elbow` comment for why it lives per-item instead.
    content: 'ms-3 flex flex-col gap-0.5 ps-4',
  },
})

export type ContentNavigationThemeSlots = keyof (typeof contentNavigationTheme)['slots']
