import { tv } from 'tailwind-variants'

export const calloutTheme = tv({
  slots: {
    // Border-only accent (not a filled background like Alert) - a callout
    // sits inline in a long stretch of prose, so it stays closer to a
    // styled blockquote than a standalone UI element.
    root: 'flex gap-3 rounded-[var(--selaras-resolved-radius-md)] border-s-4 bg-[var(--selaras-resolved-surface-elevated)] p-4',
    icon: 'mt-0.5 size-5 shrink-0',
    content: 'min-w-0 flex-1 text-sm text-[var(--selaras-resolved-text-muted)] [&>:first-child]:mt-0 [&>:last-child]:mb-0',
    title: 'font-medium text-[var(--selaras-resolved-text-default)]',
  },
  variants: {
    type: {
      note: { root: 'border-s-[var(--selaras-resolved-color-info-border)]', icon: 'text-[var(--selaras-resolved-color-info-text)]' },
      tip: { root: 'border-s-[var(--selaras-resolved-color-success-border)]', icon: 'text-[var(--selaras-resolved-color-success-text)]' },
      warning: { root: 'border-s-[var(--selaras-resolved-color-warning-border)]', icon: 'text-[var(--selaras-resolved-color-warning-text)]' },
      danger: { root: 'border-s-[var(--selaras-resolved-color-danger-border)]', icon: 'text-[var(--selaras-resolved-color-danger-text)]' },
    },
  },
  defaultVariants: {
    type: 'note',
  },
})

export type CalloutThemeSlots = keyof (typeof calloutTheme)['slots']
