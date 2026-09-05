import { tv } from 'tailwind-variants'

export const navigationMenuTheme = tv({
  slots: {
    // w-full - without it, Root shrink-wraps to just its own trigger
    // buttons' natural width inside whatever flex/grid container it sits
    // in (confirmed: inside the docs site's own demo wrapper, a bare
    // `flex` nav ended up narrower than its own dropdown content). Since
    // `viewport` below is sized `w-full` *relative to Root*, a narrow
    // Root clipped any dropdown content wider than the nav's own row -
    // visible as text cut off mid-word in a custom-content example wider
    // than the default trigger row. A real navbar spans its container's
    // width anyway (the standard pattern), so this is correct regardless
    // of the clipping bug it also happens to fix.
    root: 'flex w-full',
    list: 'flex list-none',
    item: 'min-w-0',
    // `link` is the *only* row style vertical orientation ever uses, at
    // every depth - a top-level leaf, a top-level trigger, a 3rd-level
    // leaf nested three accordions deep, all get this same class, recursed
    // through NavigationMenuAccordionItem.vue rather than switching to a
    // separate "child" style partway down. `childLink` below still exists,
    // but only for horizontal's own dropdown panel - a real second row
    // style there, not a nesting-depth concern. This mirrors a comparable reference's own
    // real navigation-menu source (confirmed by reading it directly): it
    // has no `childLink` at all for vertical mode, only ever `link` with a
    // `level` variant. An earlier version of this file tried to keep two
    // parallel row styles in sync across every nesting level instead (a
    // `childLink` used from 2nd level down, `ps-0`/gap fixes chasing each
    // new place the two silently drifted apart) - genuinely not worth it;
    // one style everywhere is both simpler and correct by construction.
    link: 'group relative flex items-center gap-2 rounded-[var(--ui-radius-md)] px-2.5 py-1.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ui-primary)]',
    linkIcon: 'size-4 shrink-0',
    // Collapsed-rail fallback for a top-level item with no icon (see the
    // `collapsed` variant below) - same box size as `linkIcon` so it
    // drops into the exact same visual slot instead of the row looking
    // empty. Purely decorative (`aria-hidden` at the call site) - the
    // item's real accessible name is still `linkLabel`, kept in the DOM
    // via `sr-only` rather than removed.
    linkIconFallback: 'flex size-4 shrink-0 items-center justify-center text-[10px] font-semibold uppercase',
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
    // `type: 'label'`/`'separator'` items (see NavigationMenuItem's own
    // doc comment) - non-interactive, so neither gets `link`'s own
    // hover/focus/active treatment. groupLabel's own px-2.5 matches
    // link's, so a "Links"-style heading sits flush with the real items
    // below it.
    groupLabel: 'px-2.5 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-[var(--ui-text-muted)] first:pt-0',
    separator: 'my-1 h-px bg-[var(--ui-border)]',
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
      // cell for an odd number of children. `auto-fit`, not `auto-fill` -
      // fill reserves empty phantom tracks for however many columns
      // WOULD fit the container width, leaving that much dead space when
      // there are fewer actual children than that - exactly what showed
      // up as a wide empty gap next to a 4-item grid in a very wide
      // panel. `auto-fit` collapses those phantom tracks to 0 instead,
      // so existing children always stretch to fill the full width.
      horizontal: {
        root: 'relative items-center',
        list: 'items-center gap-1',
        content: 'absolute inset-x-0 top-0 w-full max-h-[70vh] overflow-y-auto',
        childList: 'grid-cols-[repeat(auto-fit,minmax(11rem,1fr))]',
      },
      // The whole indent story for a nested tree, confirmed against Nuxt
      // UI's own real source: every level of nesting reuses the exact
      // same `link` row unstyled by depth - what actually creates the
      // step-in per level is the *wrapping* childList/childItem, not the
      // row itself. `childList`'s own start-margin (ms-5) is the only
      // indent source here - the tree-connector trunk+elbow (see
      // theme.css's own `.selaras-nav-elbow` comment for the full
      // technique) live entirely on `childItem` instead, not on
      // `childList`, so a group whose last child is itself expanded
      // doesn't drag the trunk line down through that child's own
      // nested content. `childItem`'s own ps-4 matches the rail's own
      // 16px width exactly, so each row sits flush right after it.
      // `content` carries no horizontal padding of its own for vertical -
      // nothing here doubles up with childList's ms-5.
      vertical: {
        root: 'flex-col',
        list: 'flex-col gap-1',
        content: 'px-0 py-1',
        childList: 'ms-5',
        childItem: 'selaras-nav-elbow selaras-nav-elbow--navigation-menu ps-4',
      },
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
    // Icon-only rail mode (vertical only - see NavigationMenu.vue's own
    // `collapsed` prop). `sr-only` on the label, not a `v-if` removing it
    // from the template - keeps every link's accessible name intact for
    // assistive tech while hiding it visually, the same reasoning
    // Button's own icon-only buttons already lean on via `aria-label`.
    // `size-10 p-0 mx-auto` (matching Button's own `square` md size)
    // makes the row a fixed, centered square instead of a short rectangle
    // stretched to the rail's full width with only the icon centered
    // inside it - a plain `link` otherwise fills its container's width
    // the same way an `<a>`/`<div>` always does (see NavigationMenu.vue's
    // own note on that), which reads as "wide button with a tiny icon in
    // it" rather than a real icon button once the label's gone. `p-0`
    // overrides the base row's own `px-2.5 py-1.5` outright (twMerge
    // resolves a bare `p-0` against a `px-*`/`py-*` pair correctly, same
    // as every other partial-padding-override case in this file);
    // `justify-center` (kept from before) centers the icon inside that
    // now-fixed box.
    collapsed: {
      true: { link: 'size-10 justify-center p-0 mx-auto', linkLabel: 'sr-only' },
    },
    // A flyout's own *root* child list - the one rendered directly inside
    // the collapsed rail's Popover content, with no visible parent row
    // above it inside that popover (the real "parent" is the icon trigger
    // sitting outside the popover entirely) - draws no guide line, since
    // there's nothing inside the popover for it to visually connect to.
    // A *nested* group further down the same flyout (e.g. a 3rd-level
    // group's own children, sitting right below its own real, visible
    // heading row) keeps the normal indent/line treatment untouched - see
    // NavigationMenuFlyoutList.vue's own `root` prop, which is what wires
    // this variant in only for that outermost call. The trunk+elbow both
    // live on `childItem` as `.selaras-nav-elbow` - a hand-written CSS
    // class, not a Tailwind utility, so tailwind-merge can't dedupe it
    // away the way it does `ps-4` here; `before:!content-none` and
    // `after:!content-none` force both masked pseudo-elements to stop
    // rendering via a real cascade override instead (the class name
    // itself stays in the DOM either way, just with no visible effect).
    flyoutRoot: {
      true: { childList: 'ms-0', childItem: 'ps-0 before:!content-none after:!content-none' },
    },
  },
  compoundVariants: [
    { variant: 'pill', active: false, class: { link: 'hover:bg-[var(--ui-bg-elevated)]', childLink: 'hover:bg-[var(--ui-bg-elevated)]' } },
    { variant: 'pill', active: true, color: 'primary', class: { link: 'bg-[var(--ui-primary-soft)] text-[var(--ui-primary)]' } },
    { variant: 'pill', active: true, color: 'neutral', class: { link: 'bg-[var(--ui-neutral-soft)] text-[var(--ui-text)]' } },
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

    // Child links (inside horizontal's own dropdown panel) always get the
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

export type NavigationMenuThemeSlots = keyof (typeof navigationMenuTheme)['slots']
