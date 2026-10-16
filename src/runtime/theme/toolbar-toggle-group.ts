import { tv } from 'tailwind-variants'

export const toolbarToggleGroupTheme = tv({
  slots: {
    root: 'inline-flex gap-1',
    item: 'text-[var(--selaras-resolved-text-muted)] hover:bg-[var(--selaras-resolved-surface-elevated)] hover:text-[var(--selaras-resolved-text-default)] data-[state=on]:bg-[var(--_selaras-color-subtle)] data-[state=on]:text-[var(--_selaras-color-on-subtle)] data-[state=on]:hover:bg-[var(--_selaras-color-subtle-hover)]',
    icon: 'shrink-0',
  },
  variants: {
    orientation: { horizontal: { root: 'flex-row' }, vertical: { root: 'flex-col' } },
    size: { sm: { icon: 'size-4' }, md: { icon: 'size-4.5' }, lg: { icon: 'size-5' } },
  },
  defaultVariants: { orientation: 'horizontal', size: 'sm' },
})

export type ToolbarToggleGroupThemeSlots = keyof (typeof toolbarToggleGroupTheme)['slots']
