import { tv } from 'tailwind-variants'

export const toolbarTheme = tv({
  slots: { root: 'flex gap-1 rounded-[var(--selaras-resolved-radius-md)] border border-[var(--selaras-resolved-border-default)] bg-[var(--selaras-resolved-surface-default)] p-1' },
  variants: {
    orientation: {
      horizontal: { root: 'flex-row flex-wrap items-center' },
      vertical: { root: 'inline-flex flex-col items-stretch' },
    },
  },
  defaultVariants: { orientation: 'horizontal' },
})

export type ToolbarThemeSlots = keyof (typeof toolbarTheme)['slots']
