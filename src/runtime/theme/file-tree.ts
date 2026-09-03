import { tv } from 'tailwind-variants'

export const fileTreeTheme = tv({
  slots: {
    // The outer box - only the top-level call renders this (see
    // FileTree.vue's own `isNested`); a recursive call for a directory's
    // children renders `list` directly instead, no extra wrapping element.
    root: 'flex flex-col gap-0.5 rounded-[var(--ui-radius-md)] border border-[var(--ui-border)] bg-[var(--ui-bg)] p-2 font-mono text-sm',
    // Real indentation, not a border/padding trick - each recursive level
    // renders its own nested <FileTree>, so depth accumulates naturally
    // via this same left padding stacking once per level.
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
  },
})

export type FileTreeThemeSlots = keyof (typeof fileTreeTheme)['slots']
