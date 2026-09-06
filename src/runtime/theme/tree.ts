import { tv } from 'tailwind-variants'

export const treeTheme = tv({
  slots: {
    root: 'flex flex-col gap-0.5 text-sm',
    // Reka's own TreeItem sets data-selected/data-expanded/data-disabled
    // on its own rendered root itself (confirmed by reading TreeItem.js
    // directly) - so this styles off those attributes the same way every
    // other component here keys off Reka's own data-* state, rather than
    // a JS-computed variant like FileTree.vue's own hand-rolled one (it
    // has no Reka data-attribute of its own to key off).
    item: 'flex w-full items-center gap-1.5 rounded-[var(--ui-radius-sm)] px-1.5 py-1 text-[var(--ui-text)] outline-none cursor-pointer select-none data-[selected]:bg-[var(--ui-primary-soft)] data-[selected]:text-[var(--ui-primary)] not-data-[selected]:hover:bg-[var(--ui-bg-elevated)] data-[disabled]:opacity-50 data-[disabled]:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--ui-primary)]',
    // Same rotate-on-expand convention as Accordion/FileTree's own
    // chevron. A leaf row (no children) renders `spacer` instead, sized
    // identically, so labels still align into one column regardless of
    // depth.
    toggle: 'flex size-4 shrink-0 items-center justify-center text-[var(--ui-text-muted)] transition-transform data-[expanded]:rotate-90',
    spacer: 'size-4 shrink-0',
    checkbox: 'shrink-0 pointer-events-none',
    icon: 'size-4 shrink-0 text-[var(--ui-text-muted)]',
    label: 'truncate',
  },
  variants: {
    size: {
      sm: { item: 'text-xs', icon: 'size-3.5', toggle: 'size-3.5', spacer: 'size-3.5' },
      md: { item: 'text-sm' },
      lg: { item: 'text-base', icon: 'size-5', toggle: 'size-5', spacer: 'size-5' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type TreeThemeSlots = keyof (typeof treeTheme)['slots']
