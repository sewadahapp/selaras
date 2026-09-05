import { tv } from 'tailwind-variants'

export const toggleGroupTheme = tv({
  slots: {
    // Same joined-segment technique as ButtonGroup's own theme: squares
    // off each item's inner corner and overlaps adjacent 1px rings by
    // -1px so the shared edge doesn't render double-thick; the hover/
    // focus z-index bump keeps a hovered/focused item's own edge drawn
    // on top of its neighbor's instead of being clipped by it.
    root: 'inline-flex [&>*]:relative [&>*:hover]:z-10 [&>*:focus-visible]:z-10',
    item: 'inline-flex items-center justify-center gap-1.5 font-medium rounded-[var(--ui-radius-md)] transition-colors ring-1 ring-inset ring-[var(--ui-border)] text-[var(--ui-text-muted)] hover:bg-[var(--ui-bg-elevated)] hover:text-[var(--ui-text)] disabled:opacity-50 disabled:pointer-events-none focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--ui-primary)]',
    icon: 'shrink-0',
  },
  variants: {
    orientation: {
      horizontal: { root: 'flex-row [&>*:not(:first-child)]:-ms-px [&>*:not(:first-child)]:rounded-s-none [&>*:not(:last-child)]:rounded-e-none' },
      vertical: { root: 'flex-col [&>*:not(:first-child)]:-mt-px [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none' },
    },
    size: {
      sm: { item: 'h-8 px-3 text-sm', icon: 'size-4' },
      md: { item: 'h-10 px-4 text-sm', icon: 'size-4.5' },
      lg: { item: 'h-11 px-5 text-base', icon: 'size-5' },
    },
    color: {
      primary: '',
      neutral: '',
      secondary: '',
      success: '',
      danger: '',
      info: '',
      warning: '',
    },
  },
  compoundVariants: [
    // Pressed (data-[state=on]) - matches Toggle's own per-color treatment.
    { color: 'primary', class: { item: 'data-[state=on]:bg-[var(--ui-primary-soft)] data-[state=on]:text-[var(--ui-primary)] data-[state=on]:hover:bg-[var(--ui-primary-soft)]/70' } },
    { color: 'neutral', class: { item: 'data-[state=on]:bg-[var(--ui-neutral-soft)] data-[state=on]:text-[var(--ui-text)] data-[state=on]:hover:bg-[var(--ui-neutral-soft)]/70' } },
    { color: 'secondary', class: { item: 'data-[state=on]:bg-[var(--ui-secondary-soft)] data-[state=on]:text-[var(--ui-secondary)] data-[state=on]:hover:bg-[var(--ui-secondary-soft)]/70' } },
    { color: 'success', class: { item: 'data-[state=on]:bg-[var(--ui-success-soft)] data-[state=on]:text-[var(--ui-success)] data-[state=on]:hover:bg-[var(--ui-success-soft)]/70' } },
    { color: 'danger', class: { item: 'data-[state=on]:bg-[var(--ui-danger-soft)] data-[state=on]:text-[var(--ui-danger)] data-[state=on]:hover:bg-[var(--ui-danger-soft)]/70' } },
    { color: 'info', class: { item: 'data-[state=on]:bg-[var(--ui-info-soft)] data-[state=on]:text-[var(--ui-info)] data-[state=on]:hover:bg-[var(--ui-info-soft)]/70' } },
    { color: 'warning', class: { item: 'data-[state=on]:bg-[var(--ui-warning-soft)] data-[state=on]:text-[var(--ui-warning)] data-[state=on]:hover:bg-[var(--ui-warning-soft)]/70' } },
  ],
  defaultVariants: {
    orientation: 'horizontal',
    size: 'md',
    color: 'primary',
  },
})

export type ToggleGroupThemeSlots = keyof (typeof toggleGroupTheme)['slots']
