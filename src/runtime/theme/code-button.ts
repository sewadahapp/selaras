import { tv } from 'tailwind-variants'

export const codeButtonTheme = tv({
  slots: {
    root: 'inline-flex items-center gap-1.5 rounded-[var(--selaras-resolved-radius-sm)] bg-[var(--selaras-resolved-surface-elevated)] px-2 py-1 font-mono text-sm text-[var(--selaras-resolved-text-default)] transition-colors hover:bg-[var(--selaras-resolved-surface-elevated)]/70',
    icon: 'size-3.5 shrink-0 text-[var(--selaras-resolved-text-muted)]',
  },
  variants: {
    failed: {
      true: { icon: 'text-[var(--selaras-resolved-color-danger-text)]' },
    },
  },
})

export type CodeButtonThemeSlots = keyof (typeof codeButtonTheme)['slots']
