import { tv } from 'tailwind-variants'

export const contentTocTheme = tv({
  slots: {
    // relative - the anchor marker (below) positions itself against this,
    // not the <ul>, so it stays correctly placed regardless of the title
    // above the list.
    root: 'relative flex flex-col gap-2 text-sm',
    title: 'font-medium text-[var(--ui-text)]',
    list: 'flex flex-col gap-1',
    item: 'flex flex-col',
    // border-l-2 border-transparent (not just padding) reserves the same
    // space the marker sits in - keeps text indent identical whether or
    // not a given link happens to be active right now.
    // A lighter touch than the main sidebar's - this is a secondary,
    // supplementary "on this page" list, not primary navigation - but
    // still meaningfully bigger than the original py-0.5.
    link: 'block border-l-2 border-transparent py-1.5 pl-3 text-[var(--ui-text-muted)] transition-colors hover:text-[var(--ui-text)]',
    content: 'ml-3 flex flex-col gap-1',
    // One shared indicator that animates to the active link's position,
    // instead of each link toggling its own static border - ContentToc.vue
    // computes its transform/height from the active <a>'s real
    // getBoundingClientRect() and only the root instance renders it (a
    // single rail makes sense regardless of how many nesting levels are
    // active - see its own comment for why it doesn't also track
    // horizontal indent per depth). ease-[cubic-bezier] is a deliberate
    // overshoot ("back-out") curve - the closest a pure CSS transition (no
    // JS animation dependency, per this library's own constraint) gets to
    // the spring-physics bounce the reference design uses.
    marker: 'absolute left-0 w-0.5 rounded-full bg-[var(--ui-primary)] opacity-0 pointer-events-none transition-[transform,height,opacity] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
  },
  variants: {
    active: {
      true: { link: 'text-[var(--ui-primary)]' },
    },
  },
})

export type ContentTocSlots = keyof (typeof contentTocTheme)['slots']
