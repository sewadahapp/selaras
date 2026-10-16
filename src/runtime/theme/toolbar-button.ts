import { tv } from 'tailwind-variants'

export const toolbarButtonTheme = tv({
  slots: {
    base: '',
    leadingIcon: '',
    trailingIcon: '',
  },
  variants: {
    size: { sm: {}, md: {}, lg: {} },
    variant: {
      solid: {},
      soft: {},
      subtle: {},
      outline: {},
      ghost: { base: 'text-[var(--selaras-resolved-text-muted)] hover:bg-[var(--selaras-resolved-surface-elevated)] hover:text-[var(--selaras-resolved-text-default)] data-[state=on]:bg-[var(--_selaras-color-subtle)] data-[state=on]:text-[var(--_selaras-color-on-subtle)] data-[state=on]:hover:bg-[var(--_selaras-color-subtle-hover)]' },
      text: {},
      link: {},
    },
  },
  defaultVariants: { variant: 'ghost' },
})

export type ToolbarButtonThemeSlots = keyof (typeof toolbarButtonTheme)['slots']
