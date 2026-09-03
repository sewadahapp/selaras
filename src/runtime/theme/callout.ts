import { tv } from 'tailwind-variants'

export const calloutTheme = tv({
  slots: {
    // Border-only accent (not a filled background like Alert) - a callout
    // sits inline in a long stretch of prose, so it stays closer to a
    // styled blockquote than a standalone UI element.
    root: 'flex gap-3 rounded-[var(--ui-radius-md)] border-s-4 bg-[var(--ui-bg-elevated)] p-4',
    icon: 'mt-0.5 size-5 shrink-0',
    content: 'min-w-0 flex-1 text-sm text-[var(--ui-text-muted)] [&>:first-child]:mt-0 [&>:last-child]:mb-0',
    title: 'font-medium text-[var(--ui-text)]',
  },
  variants: {
    type: {
      note: { root: 'border-s-[var(--ui-info)]', icon: 'text-[var(--ui-info)]' },
      tip: { root: 'border-s-[var(--ui-success)]', icon: 'text-[var(--ui-success)]' },
      warning: { root: 'border-s-[var(--ui-warning)]', icon: 'text-[var(--ui-warning)]' },
      danger: { root: 'border-s-[var(--ui-danger)]', icon: 'text-[var(--ui-danger)]' },
    },
  },
  defaultVariants: {
    type: 'note',
  },
})

export type CalloutThemeSlots = keyof (typeof calloutTheme)['slots']
