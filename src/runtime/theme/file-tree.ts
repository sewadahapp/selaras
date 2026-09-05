import { tv } from 'tailwind-variants'

export const fileTreeTheme = tv({
  slots: {
    // The outer box - only the top-level call renders this (see
    // FileTree.vue's own `isNested`); a recursive call for a directory's
    // children renders `list` directly instead, no extra wrapping element.
    root: 'flex flex-col gap-0.5 rounded-[var(--ui-radius-md)] border border-[var(--ui-border)] bg-[var(--ui-bg)] p-2 font-mono text-sm',
    // Real indentation, not a border/padding trick - each recursive level
    // renders its own nested <FileTree>, so depth accumulates naturally
    // via this same left padding stacking once per level. `ps-4` also
    // reserves the gutter a nested row's own tree-connector rail (see
    // the `isNested` variant below) reaches back into.
    list: 'flex flex-col gap-0.5 ps-4 font-mono text-sm',
    item: 'flex flex-col',
    row: 'flex w-full items-center gap-1.5 rounded-[var(--ui-radius-sm)] px-1.5 py-1 text-start text-[var(--ui-text-muted)] transition-colors hover:bg-[var(--ui-bg-elevated)] hover:text-[var(--ui-text)]',
    icon: 'size-4 shrink-0',
    label: 'truncate',
  },
  variants: {
    selected: {
      true: { row: 'bg-[var(--ui-primary-soft)] text-[var(--ui-primary)] hover:bg-[var(--ui-primary-soft)] hover:text-[var(--ui-primary)]' },
    },
    // FileTree.vue recurses into itself for every directory's own
    // children, reusing this exact same `item` slot at every depth -
    // mirrors ContentNavigation's own `isNested` variant exactly (same
    // reasoning: a root-level entry has no parent trunk to its left to
    // branch off of, so the tree-connector rail - see theme.css's own
    // `.selaras-nav-elbow` comment - only applies once nested).
    isNested: {
      true: { item: 'selaras-nav-elbow selaras-nav-elbow--file-tree' },
    },
  },
})

export type FileTreeThemeSlots = keyof (typeof fileTreeTheme)['slots']
