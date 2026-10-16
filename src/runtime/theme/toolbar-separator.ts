import { tv } from 'tailwind-variants'

export const toolbarSeparatorTheme = tv({
  slots: { root: 'shrink-0 bg-[var(--selaras-resolved-border-default)]' },
  variants: {
    orientation: { vertical: { root: 'mx-1 h-5 w-px' }, horizontal: { root: 'my-1 h-px w-full' } },
  },
  defaultVariants: { orientation: 'vertical' },
})

export type ToolbarSeparatorThemeSlots = keyof (typeof toolbarSeparatorTheme)['slots']
