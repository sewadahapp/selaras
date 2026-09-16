import { tv } from 'tailwind-variants'

export const selectTheme = tv({
  slots: {
    root: 'w-full',
    // Hover ring excludes all three focus-ish states (focus, focus-within,
    // the popover being open) - without it, hovering while any of those is
    // true (unavoidable while interacting with the trigger or its options)
    // let the plain gray hover ring beat the primary one in the cascade,
    // since they're all equal-specificity pseudo-class/attribute selectors.
    trigger: 'inline-flex w-full min-h-10 flex-wrap items-center gap-1.5 rounded-[var(--selaras-resolved-radius-md)] bg-[var(--selaras-resolved-surface-default)] px-3 py-1.5 text-sm ring-1 ring-inset ring-[var(--selaras-resolved-border-default)] outline-none transition-[color,background-color,box-shadow] not-focus:not-focus-within:not-data-[state=open]:hover:ring-[var(--selaras-resolved-border-hover)] hover:bg-[var(--selaras-resolved-surface-elevated)] focus:ring-2 focus:ring-[var(--_selaras-color-focus)] focus-within:ring-2 focus-within:ring-[var(--_selaras-color-focus)] data-[state=open]:ring-2 data-[state=open]:ring-[var(--_selaras-color-focus)] disabled:opacity-50 disabled:pointer-events-none',
    value: 'flex-1 truncate text-start text-[var(--selaras-resolved-text-default)] data-[placeholder]:text-[var(--selaras-resolved-text-muted)]',
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
    chipOverflow: 'inline-flex items-center rounded-[var(--selaras-resolved-radius-sm)] bg-[var(--_selaras-color-subtle)] px-2 py-0.5 text-xs text-[var(--_selaras-color-text)]',
    icon: 'shrink-0 text-[var(--selaras-resolved-text-muted)]',
    // Rendered as an <SButton> (ghost/neutral) - real chrome, focus ring
    // and touch target come from Button's own theme; only rounded-full
    // (this dismiss-glyph family reads better circular) stays here.
    clear: 'shrink-0 rounded-full',
    dropdown: 'shrink-0 rounded-[var(--selaras-resolved-radius-sm)] p-0.5 text-[var(--selaras-resolved-text-muted)] transition-colors hover:bg-[var(--selaras-resolved-border-default)] hover:text-[var(--selaras-resolved-text-default)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--_selaras-color-focus)]',
    searchWrapper: 'flex items-center gap-2 border-b border-[var(--selaras-resolved-border-default)] px-2',
    searchInput: 'h-9 min-w-16 flex-1 bg-transparent text-sm text-[var(--selaras-resolved-text-default)] outline-none placeholder:text-[var(--selaras-resolved-text-muted)]',
    content: 'z-[var(--selaras-resolved-z-dropdown)] max-h-72 min-w-[var(--reka-combobox-trigger-width)] overflow-hidden rounded-[var(--selaras-resolved-radius-md)] bg-[var(--selaras-resolved-surface-default)] shadow-[var(--selaras-resolved-shadow-md)] ring-1 ring-[var(--selaras-resolved-border-default)] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
    // The `adaptive` path's own content wrapper - none of `content`'s
    // own popover chrome (ring/shadow/rounded/animate-in, sized off the
    // trigger's own width via --reka-combobox-trigger-width, which is
    // only ever set while position="popper" is active) applies here,
    // since Modal's own card already provides that surface; this only
    // needs to fill Modal's content slot width.
    mobileContent: 'w-full',
    // Autocomplete keeps its editable ComboboxInput outside its popup. Its
    // mobile presentation is therefore a wider nonmodal panel, not Modal's
    // content wrapper. Inline geometry avoids inheriting popper width from the
    // trigger while leaving consumer `ui.mobilePanel` overrides available.
    mobilePanel: '',
    viewport: 'max-h-72 overflow-y-auto p-1',
    group: 'px-2 pt-2 pb-1 text-xs font-medium text-[var(--selaras-resolved-text-muted)]',
    item: 'relative flex items-center gap-2 rounded-[var(--selaras-resolved-radius-sm)] py-1.5 ps-2 pe-8 text-sm text-[var(--selaras-resolved-text-default)] outline-none cursor-pointer select-none data-[highlighted]:bg-[var(--selaras-resolved-surface-elevated)] data-[disabled]:opacity-50 data-[disabled]:pointer-events-none',
    itemIndicator: 'absolute end-2 flex items-center text-[var(--_selaras-color-fill)]',
    empty: 'px-2 py-6 text-center text-sm text-[var(--selaras-resolved-text-muted)]',
    arrow: 'fill-[var(--selaras-resolved-surface-default)] stroke-[var(--selaras-resolved-border-default)] stroke-1',
  },
  variants: {
    size: {
      sm: { trigger: 'min-h-8 text-sm' },
      md: { trigger: 'min-h-10' },
      lg: { trigger: 'min-h-11 text-base' },
    },
    // Registered custom roles have no finite Tailwind Variants branch. Keep
    // the semantic focus styling in the base slot so every registered role
    // resolves through --_selaras-color-focus; neutral alone overrides it.
    // Empty built-in branches preserve the public recipe condition used by
    // consumer compound variants.
    color: {
      primary: '',
      neutral: { trigger: 'focus:ring-[var(--selaras-resolved-surface-inverted)] focus-within:ring-[var(--selaras-resolved-surface-inverted)] data-[state=open]:ring-[var(--selaras-resolved-surface-inverted)]' },
      secondary: '',
      success: '',
      danger: '',
      info: '',
      warning: '',
    },
    // Declared last (after color) so tailwind-merge lets its own ring
    // overrides win over color's - see input.ts for why declaration order
    // (not runtime call order) is what decides this.
    invalid: {
      true: { trigger: 'ring-[var(--_selaras-color-fill)] hover:ring-[var(--_selaras-color-fill)] focus:ring-[var(--_selaras-color-fill)] focus-within:ring-[var(--_selaras-color-fill)] data-[state=open]:ring-[var(--_selaras-color-fill)]' },
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'primary',
  },
})

export type SelectThemeSlots = keyof (typeof selectTheme)['slots']
