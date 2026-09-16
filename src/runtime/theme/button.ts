import { tv } from 'tailwind-variants'

export const buttonTheme = tv({
  slots: {
    base: 'inline-flex items-center justify-center gap-1.5 font-medium rounded-[var(--selaras-resolved-radius-md)] transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--_selaras-color-focus)]',
    leadingIcon: 'shrink-0',
    trailingIcon: 'shrink-0',
  },
  variants: {
    // Keep color conditions available to recipe extensions; bindings own color CSS.
    color: {
      primary: '',
      neutral: '',
      secondary: '',
      success: '',
      danger: '',
      info: '',
      warning: '',
    },
    variant: {
      solid: { base: 'bg-[var(--_selaras-color-fill)] text-[var(--_selaras-color-on-fill)] hover:bg-[var(--_selaras-color-fill-hover)] active:bg-[var(--_selaras-color-fill-pressed)]' },
      soft: { base: 'bg-[var(--_selaras-color-subtle)] text-[var(--_selaras-color-on-subtle)] hover:bg-[var(--_selaras-color-subtle-hover)] active:bg-[var(--_selaras-color-subtle-pressed)]' },
      outline: { base: 'ring-1 ring-inset ring-[var(--_selaras-color-border)] text-[var(--_selaras-color-text)] hover:bg-[var(--_selaras-color-subtle-hover)] active:bg-[var(--_selaras-color-subtle-pressed)]' },
      ghost: { base: 'text-[var(--_selaras-color-text)] hover:bg-[var(--_selaras-color-subtle-hover)] active:bg-[var(--_selaras-color-subtle-pressed)]' },
      // Text actions never paint a background, including their interaction states.
      text: { base: 'text-[var(--_selaras-color-text)] hover:text-[var(--_selaras-color-text-hover)] active:text-[var(--_selaras-color-text-pressed)]' },
    },
    size: {
      sm: { base: 'h-8 px-3 text-sm', leadingIcon: 'size-4', trailingIcon: 'size-4' },
      md: { base: 'h-10 px-4 text-sm', leadingIcon: 'size-4.5', trailingIcon: 'size-4.5' },
      lg: { base: 'h-11 px-5 text-base', leadingIcon: 'size-5', trailingIcon: 'size-5' },
    },
    block: {
      true: { base: 'w-full' },
    },
    raised: {
      true: { base: 'shadow-[var(--selaras-resolved-shadow-md)]' },
    },
    square: {
      true: {},
    },
  },
  compoundVariants: [
    { size: 'sm', square: true, class: { base: 'w-8 px-0' } },
    { size: 'md', square: true, class: { base: 'w-10 px-0' } },
    { size: 'lg', square: true, class: { base: 'w-11 px-0' } },
  ],
  defaultVariants: {
    color: 'primary',
    variant: 'solid',
    size: 'md',
  },
})

export type ButtonThemeSlots = keyof (typeof buttonTheme)['slots']
