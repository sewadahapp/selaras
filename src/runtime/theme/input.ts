import { tv } from 'tailwind-variants'

export const inputTheme = tv({
  slots: {
    root: 'relative inline-flex items-center w-full',
    // not-focus: on the hover ring - without it, hovering while focused
    // (unavoidable while the pointer sits on the input) let the plain gray
    // hover ring beat the primary focus ring, since both are equal-
    // specificity pseudo-class selectors and hover's happened to win. The
    // focus ring's own color comes from the `color` variant below, not
    // hardcoded here - hover's own color stays neutral regardless of
    // `color`, matching every other component's own hover state.
    base: 'w-full rounded-[var(--ui-radius-md)] bg-[var(--ui-bg)] text-[var(--ui-text)] ring-1 ring-inset ring-[var(--ui-border)] placeholder:text-[var(--ui-text-muted)] outline-none transition-[color,background-color,box-shadow] not-focus:hover:ring-[var(--ui-border-hover)] hover:bg-[var(--ui-bg-elevated)] focus:ring-2 disabled:opacity-50 disabled:pointer-events-none',
    leadingIcon: 'absolute start-2.5 shrink-0 text-[var(--ui-text-muted)]',
    trailingIcon: 'absolute end-2.5 shrink-0 text-[var(--ui-text-muted)]',
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
    clear: 'absolute end-1 top-1/2 -translate-y-1/2 shrink-0 rounded-full',
  },
  variants: {
    size: {
      sm: { base: 'h-8 px-2.5 text-sm', leadingIcon: 'size-4', trailingIcon: 'size-4', clear: 'size-7' },
      md: { base: 'h-10 px-3 text-sm', leadingIcon: 'size-4.5', trailingIcon: 'size-4.5', clear: 'size-9' },
      lg: { base: 'h-11 px-3.5 text-base', leadingIcon: 'size-5', trailingIcon: 'size-5', clear: 'size-10' },
    },
    // Focus-ring color only - the resting ring stays --ui-border regardless
    // of `color`, matching a Nuxt-ecosystem component kit's own Input
    // (confirmed by reading its docs directly, not assumed).
    color: {
      primary: { base: 'focus:ring-[var(--ui-primary)]' },
      neutral: { base: 'focus:ring-[var(--ui-bg-inverted)]' },
      secondary: { base: 'focus:ring-[var(--ui-secondary)]' },
      success: { base: 'focus:ring-[var(--ui-success)]' },
      danger: { base: 'focus:ring-[var(--ui-danger)]' },
      info: { base: 'focus:ring-[var(--ui-info)]' },
      warning: { base: 'focus:ring-[var(--ui-warning)]' },
    },
    hasLeadingIcon: {
      true: {},
    },
    hasTrailingIcon: {
      true: {},
    },
    // Declared last (after color) so tailwind-merge lets its own focus:ring
    // override win over color's - invalid should always show danger
    // regardless of what color was also requested. See this session's own
    // Checkbox/Switch fix for why declaration order (not runtime call
    // order) is what decides this.
    invalid: {
      true: { base: 'ring-[var(--ui-danger)] hover:ring-[var(--ui-danger)] focus:ring-[var(--ui-danger)]' },
    },
  },
  compoundVariants: [
    { size: 'sm', hasLeadingIcon: true, class: { base: 'ps-8' } },
    { size: 'md', hasLeadingIcon: true, class: { base: 'ps-9' } },
    { size: 'lg', hasLeadingIcon: true, class: { base: 'ps-10' } },
    { size: 'sm', hasTrailingIcon: true, class: { base: 'pe-8' } },
    { size: 'md', hasTrailingIcon: true, class: { base: 'pe-9' } },
    { size: 'lg', hasTrailingIcon: true, class: { base: 'pe-10' } },
  ],
  defaultVariants: {
    size: 'md',
    color: 'primary',
  },
})

export type InputSlots = keyof (typeof inputTheme)['slots']
