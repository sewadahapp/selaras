import { tv } from 'tailwind-variants'

export const selectTheme = tv({
  slots: {
    root: 'w-full',
    trigger: 'inline-flex w-full min-h-10 flex-wrap items-center gap-1.5 rounded-[var(--ui-radius-md)] bg-[var(--ui-bg)] px-3 py-1.5 text-sm ring-1 ring-inset ring-[var(--ui-border)] outline-none transition-[color,background-color,box-shadow] hover:ring-[var(--ui-border-hover)] hover:bg-[var(--ui-bg-elevated)] focus:ring-2 focus:ring-[var(--ui-primary)] focus-within:ring-2 focus-within:ring-[var(--ui-primary)] data-[state=open]:ring-2 data-[state=open]:ring-[var(--ui-primary)] disabled:opacity-50 disabled:pointer-events-none',
    value: 'flex-1 truncate text-start text-[var(--ui-text)] data-[placeholder]:text-[var(--ui-text-muted)]',
    // Both chip display branches render a real Chip (see
    // ComboboxSelectBase.vue) instead of hand-rolled markup, styled/
    // colored via its own props and :ui override - only the "+N more"
    // overflow indicator still needs a Select-owned slot. bg-primary-soft
    // (not bg-elevated) - elevated is the same token the trigger itself
    // switches to on hover, so it used to vanish on hover exactly like
    // the chips did before they moved to Chip's own primary/soft. Text
    // matches the chips' own primary too, not text-muted - muted-on-
    // primary-soft measures 4.46:1, just under AA; primary-on-primary-
    // soft (the same pairing Chip's own soft variant uses) clears 6.5:1.
    chipOverflow: 'inline-flex items-center rounded-[var(--ui-radius-sm)] bg-[var(--ui-primary-soft)] px-2 py-0.5 text-xs text-[var(--ui-primary)]',
    icon: 'shrink-0 text-[var(--ui-text-muted)]',
    // Rendered as an <SButton> (ghost/neutral) - real chrome, focus ring
    // and touch target come from Button's own theme; only rounded-full
    // (this dismiss-glyph family reads better circular) stays here.
    clear: 'shrink-0 rounded-full',
    dropdown: 'shrink-0 rounded-[var(--ui-radius-sm)] p-0.5 text-[var(--ui-text-muted)] transition-colors hover:bg-[var(--ui-border)] hover:text-[var(--ui-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ui-primary)]',
    searchWrapper: 'flex items-center gap-2 border-b border-[var(--ui-border)] px-2',
    searchInput: 'h-9 min-w-16 flex-1 bg-transparent text-sm text-[var(--ui-text)] outline-none placeholder:text-[var(--ui-text-muted)]',
    content: 'z-50 max-h-72 min-w-[var(--reka-combobox-trigger-width)] overflow-hidden rounded-[var(--ui-radius-md)] bg-[var(--ui-bg)] shadow-[var(--ui-shadow-md)] ring-1 ring-[var(--ui-border)] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
    viewport: 'max-h-72 overflow-y-auto p-1',
    group: 'px-2 pt-2 pb-1 text-xs font-medium text-[var(--ui-text-muted)]',
    item: 'relative flex items-center gap-2 rounded-[var(--ui-radius-sm)] py-1.5 ps-2 pe-8 text-sm text-[var(--ui-text)] outline-none cursor-pointer select-none data-[highlighted]:bg-[var(--ui-bg-elevated)] data-[disabled]:opacity-50 data-[disabled]:pointer-events-none',
    itemIndicator: 'absolute end-2 flex items-center text-[var(--ui-primary)]',
    empty: 'px-2 py-6 text-center text-sm text-[var(--ui-text-muted)]',
  },
  variants: {
    size: {
      sm: { trigger: 'min-h-8 text-sm' },
      md: { trigger: 'min-h-10' },
      lg: { trigger: 'min-h-11 text-base' },
    },
    invalid: {
      true: { trigger: 'ring-[var(--ui-danger)] hover:ring-[var(--ui-danger)] focus:ring-[var(--ui-danger)] focus-within:ring-[var(--ui-danger)]' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type SelectSlots = keyof (typeof selectTheme)['slots']
