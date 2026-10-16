import { tv } from 'tailwind-variants'

export const fieldClearButtonTheme = tv({
  slots: {
    base: 'shrink-0 rounded-full text-[var(--selaras-resolved-text-muted)] hover:bg-[var(--selaras-resolved-border-default)] hover:text-[var(--selaras-resolved-text-default)] active:bg-[var(--selaras-resolved-border-hover)] focus-visible:outline-offset-0',
    icon: 'shrink-0',
  },
  variants: {
    size: {
      sm: { base: 'size-6', icon: 'size-4' },
      md: { base: 'size-7', icon: 'size-4.5' },
      lg: { base: 'size-8', icon: 'size-5' },
    },
  },
  defaultVariants: { size: 'md' },
})

export type FieldClearButtonThemeSlots = keyof (typeof fieldClearButtonTheme)['slots']
