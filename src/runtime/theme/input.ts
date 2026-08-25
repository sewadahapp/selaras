import { tv } from 'tailwind-variants'

export const inputTheme = tv({
  slots: {
    root: 'relative inline-flex items-center w-full',
    base: 'w-full rounded-[var(--ui-radius-md)] bg-[var(--ui-bg)] text-[var(--ui-text)] ring-1 ring-inset ring-[var(--ui-border)] placeholder:text-[var(--ui-text-muted)] outline-none transition-[color,background-color,box-shadow] hover:ring-[var(--ui-border-hover)] hover:bg-[var(--ui-bg-elevated)] focus:ring-2 focus:ring-[var(--ui-primary)] disabled:opacity-50 disabled:pointer-events-none',
    leadingIcon: 'absolute left-2.5 shrink-0 text-[var(--ui-text-muted)]',
    trailingIcon: 'absolute right-2.5 shrink-0 text-[var(--ui-text-muted)]',
    // A separate slot from trailingIcon (not reused) - that one is a
    // decorative, non-interactive icon; this is a real dismiss button.
    // Rendered as an <SButton> (ghost/neutral) - real chrome, focus ring
    // and rounded-full (this dismiss-glyph family reads better circular
    // than the library's usual rounded-md) come from Button's own theme;
    // this slot only positions it and shrinks it below the input's full
    // height (Button's own size steps match that height exactly, which
    // once centered still touches both edges with zero margin) - explicit
    // top-1/2 -translate-y-1/2 centering, not the root's items-center,
    // since position:absolute drops it out of that flex flow.
    clear: 'absolute right-1 top-1/2 -translate-y-1/2 shrink-0 rounded-full',
  },
  variants: {
    size: {
      sm: { base: 'h-8 px-2.5 text-sm', leadingIcon: 'size-4', trailingIcon: 'size-4', clear: 'size-7' },
      md: { base: 'h-10 px-3 text-sm', leadingIcon: 'size-4.5', trailingIcon: 'size-4.5', clear: 'size-9' },
      lg: { base: 'h-11 px-3.5 text-base', leadingIcon: 'size-5', trailingIcon: 'size-5', clear: 'size-10' },
    },
    invalid: {
      true: { base: 'ring-[var(--ui-danger)] hover:ring-[var(--ui-danger)] focus:ring-[var(--ui-danger)]' },
    },
    hasLeadingIcon: {
      true: {},
    },
    hasTrailingIcon: {
      true: {},
    },
  },
  compoundVariants: [
    { size: 'sm', hasLeadingIcon: true, class: { base: 'pl-8' } },
    { size: 'md', hasLeadingIcon: true, class: { base: 'pl-9' } },
    { size: 'lg', hasLeadingIcon: true, class: { base: 'pl-10' } },
    { size: 'sm', hasTrailingIcon: true, class: { base: 'pr-8' } },
    { size: 'md', hasTrailingIcon: true, class: { base: 'pr-9' } },
    { size: 'lg', hasTrailingIcon: true, class: { base: 'pr-10' } },
  ],
  defaultVariants: {
    size: 'md',
  },
})

export type InputSlots = keyof (typeof inputTheme)['slots']
