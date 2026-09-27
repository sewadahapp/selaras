import { tv } from 'tailwind-variants'

export const calloutTheme = tv({
  slots: {
    // Match Alert's soft surface by default. A masked pseudo-element draws
    // the striped accent over the edge on hover or focus within without
    // changing the box's size or the content's padding.
    root: 'relative flex items-start gap-3 rounded-[var(--selaras-resolved-radius-md)] bg-[var(--_selaras-color-subtle)] p-4 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[repeating-linear-gradient(135deg,var(--_selaras-color-border)_0_2px,transparent_2px_4px)] before:p-0.5 before:opacity-0 before:transition-opacity before:content-[\'\'] hover:before:opacity-100 focus-within:before:opacity-100',
    icon: 'mt-0.5 size-5 shrink-0',
    content: 'min-w-0 flex-1 text-sm text-[var(--selaras-resolved-text-muted)] [&>:first-child]:mt-0 [&>:last-child]:mb-0',
    title: 'font-medium text-[var(--selaras-resolved-text-default)]',
  },
  variants: {
    type: {
      note: { icon: 'text-[var(--_selaras-color-text)]' },
      tip: { icon: 'text-[var(--_selaras-color-text)]' },
      warning: { icon: 'text-[var(--_selaras-color-text)]' },
      danger: { icon: 'text-[var(--_selaras-color-text)]' },
    },
  },
  defaultVariants: {
    type: 'note',
  },
})

export type CalloutThemeSlots = keyof (typeof calloutTheme)['slots']
