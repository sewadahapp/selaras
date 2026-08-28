import { tv } from 'tailwind-variants'

export const inputNumberTheme = tv({
  slots: {
    // Same ring/bg/radius/hover/focus-within box language as Input's own
    // `base` (theme/input.ts) - this wraps real interactive children
    // (decrement button, input, increment button) rather than being the
    // input itself, so the focus ring keys off :focus-within, and the
    // disabled look off :has(:disabled) instead of a bare `disabled` prop.
    root: 'inline-flex w-full items-center gap-1 rounded-[var(--ui-radius-md)] bg-[var(--ui-bg)] ring-1 ring-inset ring-[var(--ui-border)] transition-[color,background-color,box-shadow] hover:ring-[var(--ui-border-hover)] hover:bg-[var(--ui-bg-elevated)] focus-within:ring-2 focus-within:ring-[var(--ui-primary)] has-[:disabled]:opacity-50 has-[:disabled]:pointer-events-none',
    // Borderless/transparent - root already carries the visual box, this is
    // just the editable text. Centered + tabular-nums so digits don't shift
    // width as the value changes.
    input: 'w-full min-w-0 flex-1 border-0 bg-transparent text-center tabular-nums text-[var(--ui-text)] outline-none placeholder:text-[var(--ui-text-muted)] disabled:cursor-not-allowed',
  },
  variants: {
    size: {
      sm: { root: 'h-8 px-1', input: 'text-sm' },
      md: { root: 'h-10 px-1.5', input: 'text-sm' },
      lg: { root: 'h-11 px-2', input: 'text-base' },
    },
    invalid: {
      true: { root: 'ring-[var(--ui-danger)] hover:ring-[var(--ui-danger)] focus-within:ring-[var(--ui-danger)]' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type InputNumberSlots = keyof (typeof inputNumberTheme)['slots']
