import { tv } from 'tailwind-variants'

export const textareaTheme = tv({
  slots: {
    root: 'relative w-full',
    // not-focus: on the hover ring - see input.ts's own base slot for why
    // (same fix, same reasoning).
    base: 'w-full resize-y rounded-[var(--ui-radius-md)] bg-[var(--ui-bg)] px-3 py-2 text-sm text-[var(--ui-text)] ring-1 ring-inset ring-[var(--ui-border)] placeholder:text-[var(--ui-text-muted)] outline-none transition-[color,background-color,box-shadow] not-focus:hover:ring-[var(--ui-border-hover)] hover:bg-[var(--ui-bg-elevated)] focus:ring-2 disabled:opacity-50 disabled:pointer-events-none disabled:resize-none',
    // Anchored to the top corner (`top-2.5`), not vertically centered the
    // way Input's own icons are - once content wraps past one line,
    // centering against the whole (variable) box height would drift the
    // icon away from the first line of text it's meant to sit beside.
    leadingIcon: 'absolute start-3 top-2.5 shrink-0 text-[var(--ui-text-muted)]',
    trailingIcon: 'absolute end-3 top-2.5 shrink-0 text-[var(--ui-text-muted)]',
    clear: 'absolute end-1 top-1 shrink-0 rounded-full',
  },
  variants: {
    size: {
      sm: { base: 'text-sm', leadingIcon: 'size-4', trailingIcon: 'size-4', clear: 'size-7' },
      md: { base: 'text-sm', leadingIcon: 'size-4.5', trailingIcon: 'size-4.5', clear: 'size-9' },
      lg: { base: 'text-base', leadingIcon: 'size-5', trailingIcon: 'size-5', clear: 'size-10' },
    },
    // Focus-ring color only - the resting ring stays --ui-border regardless
    // of `color`, matching Input's own scope (see input.ts).
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
      true: { base: 'ps-9' },
    },
    hasTrailingIcon: {
      true: { base: 'pe-9' },
    },
    // Manual drag-resize and JS-driven autoresize fight each other - the
    // resize handle lets a user set a height the next keystroke's resize()
    // call would immediately override.
    autoresize: {
      true: { base: 'resize-none' },
    },
    // Declared last (after color) so tailwind-merge lets its own focus:ring
    // override win over color's - see input.ts for why declaration order
    // (not runtime call order) is what decides this.
    invalid: {
      true: { base: 'ring-[var(--ui-danger)] hover:ring-[var(--ui-danger)] focus:ring-[var(--ui-danger)]' },
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'primary',
  },
})

export type TextareaSlots = keyof (typeof textareaTheme)['slots']
