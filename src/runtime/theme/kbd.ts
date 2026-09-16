import { tv } from 'tailwind-variants'

export const kbdTheme = tv({
  slots: {
    base: 'inline-flex items-center justify-center rounded-[var(--selaras-resolved-radius-sm)] border border-[var(--selaras-resolved-border-default)] bg-[var(--selaras-resolved-surface-elevated)] font-mono font-medium text-[var(--selaras-resolved-text-muted)]',
  },
  variants: {
    size: {
      sm: { base: 'h-4.5 min-w-4.5 px-1 text-[10px]' },
      md: { base: 'h-5 min-w-5 px-1.5 text-xs' },
      lg: { base: 'h-6 min-w-6 px-2 text-sm' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type KbdThemeSlots = keyof (typeof kbdTheme)['slots']
