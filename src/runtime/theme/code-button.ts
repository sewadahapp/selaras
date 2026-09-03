import { tv } from 'tailwind-variants'

export const codeButtonTheme = tv({
  slots: {
    root: 'inline-flex items-center gap-1.5 rounded-[var(--ui-radius-sm)] bg-[var(--ui-bg-elevated)] px-2 py-1 font-mono text-sm text-[var(--ui-text)] transition-colors hover:bg-[var(--ui-bg-elevated)]/70',
    icon: 'size-3.5 shrink-0 text-[var(--ui-text-muted)]',
  },
})

export type CodeButtonThemeSlots = keyof (typeof codeButtonTheme)['slots']
