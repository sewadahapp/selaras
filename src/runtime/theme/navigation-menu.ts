import { tv } from 'tailwind-variants'

export const navigationMenuTheme = tv({
  slots: {
    root: 'flex',
    list: 'flex list-none',
    item: 'min-w-0',
    link: 'group relative flex items-center gap-1.5 rounded-[var(--ui-radius-md)] px-2.5 py-1.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ui-primary)]',
    linkIcon: 'size-4 shrink-0',
    linkLabel: 'truncate',
    linkTrailingIcon: 'size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180',
    // `content` and `childList` below are shared between horizontal's
    // NavigationMenuContent (stacked absolutely inside the shared
    // viewport, wide/multi-column) and vertical's own accordion panel
    // (a normal in-flow, single-column nested list - see
    // NavigationMenuAccordionItem.vue). Regression: an earlier version put
    // the horizontal-only absolute positioning and multi-column grid
    // directly in these base strings, which broke vertical mode entirely
    // (ripped its accordion content out of normal flow, and turned its
    // indented nested list into a multi-column grid). Both now live in
    // the `orientation` variant below instead, so vertical gets none of it.
    content: 'p-2',
    viewport: 'absolute inset-x-0 top-full z-[var(--ui-z-dropdown)] h-[var(--reka-navigation-menu-viewport-height)] w-full overflow-hidden rounded-[var(--ui-radius-md)] bg-[var(--ui-bg)] shadow-[var(--ui-shadow-md)] ring-1 ring-[var(--ui-border)] transition-[height] duration-200',
    childList: 'grid gap-1',
    childItem: '',
    childLink: 'group relative flex items-center gap-2 rounded-[var(--ui-radius-md)] px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ui-primary)]',
    childLinkLabel: 'truncate',
  },
  variants: {
    orientation: {
      // `content`: full width of the nav bar, not sized to its own
      // content - confirmed directly against both references (one reference's
      // own real theme sizes this `w-full`; another reference's MegaMenu - the
      // actual comparable component for this wide-panel behavior, not
      // Menubar's own narrow cascading submenus - does the same). Each
      // open item's own panel stacks absolutely inside the shared
      // viewport (only one visible via Presence), rather than sizing the
      // viewport to whichever is active.
      // `childList`: adaptive column count (not a fixed grid-cols-2 like
      // a comparable reference's own default) - a fixed count leaves an awkward empty
      // cell for an odd number of children; auto-fill instead flows
      // however many columns actually fit a ~11rem minimum.
      horizontal: {
        root: 'relative items-center',
        list: 'items-center gap-1',
        content: 'absolute inset-x-0 top-0 w-full max-h-[70vh] overflow-y-auto',
        childList: 'grid-cols-[repeat(auto-fill,minmax(11rem,1fr))]',
      },
      vertical: { root: 'flex-col', list: 'flex-col gap-1' },
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
    variant: {
      pill: '',
      link: '',
    },
    active: {
      true: {},
      false: { link: 'text-[var(--ui-text-muted)] hover:text-[var(--ui-text)]', childLink: 'text-[var(--ui-text-muted)] hover:text-[var(--ui-text)]' },
    },
    disabled: {
      true: { link: 'pointer-events-none opacity-50', childLink: 'pointer-events-none opacity-50' },
    },
    highlight: {
      true: {},
    },
  },
  compoundVariants: [
    { variant: 'pill', active: false, class: { link: 'hover:bg-[var(--ui-bg-elevated)]', childLink: 'hover:bg-[var(--ui-bg-elevated)]' } },
    { variant: 'pill', active: true, color: 'primary', class: { link: 'bg-[var(--ui-primary-soft)] text-[var(--ui-primary)]' } },
    { variant: 'pill', active: true, color: 'neutral', class: { link: 'bg-[var(--ui-bg-elevated)] text-[var(--ui-text)]' } },
    { variant: 'pill', active: true, color: 'secondary', class: { link: 'bg-[var(--ui-secondary-soft)] text-[var(--ui-secondary)]' } },
    { variant: 'pill', active: true, color: 'success', class: { link: 'bg-[var(--ui-success-soft)] text-[var(--ui-success)]' } },
    { variant: 'pill', active: true, color: 'danger', class: { link: 'bg-[var(--ui-danger-soft)] text-[var(--ui-danger)]' } },
    { variant: 'pill', active: true, color: 'info', class: { link: 'bg-[var(--ui-info-soft)] text-[var(--ui-info)]' } },
    { variant: 'pill', active: true, color: 'warning', class: { link: 'bg-[var(--ui-warning-soft)] text-[var(--ui-warning)]' } },

    { variant: 'link', active: true, color: 'primary', class: { link: 'text-[var(--ui-primary)]' } },
    { variant: 'link', active: true, color: 'neutral', class: { link: 'text-[var(--ui-text)]' } },
    { variant: 'link', active: true, color: 'secondary', class: { link: 'text-[var(--ui-secondary)]' } },
    { variant: 'link', active: true, color: 'success', class: { link: 'text-[var(--ui-success)]' } },
    { variant: 'link', active: true, color: 'danger', class: { link: 'text-[var(--ui-danger)]' } },
    { variant: 'link', active: true, color: 'info', class: { link: 'text-[var(--ui-info)]' } },
    { variant: 'link', active: true, color: 'warning', class: { link: 'text-[var(--ui-warning)]' } },

    // Child links (inside a dropdown/accordion panel) always get the
    // "active" text-color treatment regardless of `variant` - a pill-style
    // background on every list row in a dropdown would be visual noise.
    { active: true, color: 'primary', class: { childLink: 'text-[var(--ui-primary)]' } },
    { active: true, color: 'neutral', class: { childLink: 'text-[var(--ui-text)]' } },
    { active: true, color: 'secondary', class: { childLink: 'text-[var(--ui-secondary)]' } },
    { active: true, color: 'success', class: { childLink: 'text-[var(--ui-success)]' } },
    { active: true, color: 'danger', class: { childLink: 'text-[var(--ui-danger)]' } },
    { active: true, color: 'info', class: { childLink: 'text-[var(--ui-info)]' } },
    { active: true, color: 'warning', class: { childLink: 'text-[var(--ui-warning)]' } },

    // The highlight bar reuses whatever text color `active` already set via
    // the compound variants above (`after:bg-current`) instead of a second,
    // parallel per-color axis - it's only ever visible together with the
    // matching `active:true` color class already on the same element.
    { orientation: 'horizontal', highlight: true, active: true, class: { link: 'after:absolute after:-bottom-2 after:inset-x-2.5 after:block after:h-px after:rounded-full after:bg-current' } },
    { orientation: 'horizontal', highlight: true, active: false, class: { link: 'after:hidden' } },
    { orientation: 'vertical', highlight: true, active: true, class: { link: 'after:absolute after:-start-1.5 after:inset-y-0.5 after:block after:w-px after:rounded-full after:bg-current' } },
    { orientation: 'vertical', highlight: true, active: false, class: { link: 'after:hidden' } },
  ],
  defaultVariants: {
    orientation: 'horizontal',
    color: 'primary',
    variant: 'pill',
  },
})

export type NavigationMenuSlots = keyof (typeof navigationMenuTheme)['slots']
