import { tv } from 'tailwind-variants'

export const toggleTheme = tv({
  slots: {
    base: 'inline-flex items-center justify-center gap-1.5 font-medium rounded-[var(--ui-radius-md)] transition-colors text-[var(--ui-text-muted)] hover:bg-[var(--ui-bg-elevated)] hover:text-[var(--ui-text)] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--_selaras-color-focus)] data-[state=on]:bg-[var(--_selaras-color-subtle)] data-[state=on]:text-[var(--_selaras-color-text)] data-[state=on]:hover:bg-[var(--_selaras-color-subtle-hover)]',
    icon: 'shrink-0',
  },
  variants: {
    color: {
      primary: '',
      neutral: '',
      secondary: '',
      success: '',
      danger: '',
      info: '',
      warning: '',
    },
    size: {
      sm: { base: 'h-8 px-3 text-sm', icon: 'size-4' },
      md: { base: 'h-10 px-4 text-sm', icon: 'size-4.5' },
      lg: { base: 'h-11 px-5 text-base', icon: 'size-5' },
    },
    square: {
      true: {},
    },
  },
  compoundVariants: [
    // Icon-only: swap the size's text-oriented horizontal padding for an
    // equal-width square matching its own height - same technique as
    // Button's own `square` compound variants.
    { size: 'sm', square: true, class: { base: 'w-8 px-0' } },
    { size: 'md', square: true, class: { base: 'w-10 px-0' } },
    { size: 'lg', square: true, class: { base: 'w-11 px-0' } },

  ],
  defaultVariants: {
    color: 'primary',
    size: 'md',
  },
})

export type ToggleThemeSlots = keyof (typeof toggleTheme)['slots']
