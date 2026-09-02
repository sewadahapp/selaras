import { tv } from 'tailwind-variants'

export const ratingTheme = tv({
  slots: {
    root: 'inline-flex items-center',
    // The shared positioning context for one star's backdrop plus every
    // one of its overlapping step indicators - a fixed size (via `size`
    // below) so absolutely-positioned children have something concrete
    // to size/crop against.
    // has-[:focus-visible] rather than the usual focus-visible directly -
    // keyboard focus lands on whichever sub-step's own (possibly
    // narrower-than-the-whole-star) indicator button is current, but the
    // ring should still outline the *whole* star, not just that step's
    // own cropped hit region.
    item: 'relative shrink-0 rounded-sm transition-shadow has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--ui-primary)]',
    // The empty/outline star, always visible, sitting behind every step
    // indicator - what a not-yet-filled star reads as.
    icon: 'absolute inset-0 text-[var(--ui-border)]',
    // One per fractional sub-step (Rating.vue renders one
    // RatingItemIndicator per entry in RatingItem's own `steps`, a single
    // entry `[N]` when `step` is the default 1, several overlapping ones
    // for a fractional step) - overflow-hidden + a width pinned to Reka's
    // own --reka-rating-item-step-width is what turns the *fixed-size*
    // fillIcon inside it into a correctly-cropped partial fill instead of
    // a squished one. z-index/opacity are also Reka's own exposed custom
    // properties - see RatingItemIndicator's compiled source
    // (node_modules/reka-ui/dist/Rating/RatingItemIndicator.js) for what
    // each one tracks (narrower/earlier sub-steps stack in front so their
    // smaller click region wins over the full-width one behind it;
    // opacity hides a redundant overlapping layer mid-hover-transition).
    // Marked group/step so the nested fillIcon can react to *this*
    // element's own data-state=active (has this step's value been
    // reached by the current hover-or-model value) without needing to
    // duplicate that computation itself.
    // p-0 + flex + leading-none reset the real <button> Reka renders this
    // as - its default UA padding/line-height otherwise pushes fillIcon a
    // few fixed pixels off the backdrop icon's own position. A fixed
    // offset is invisible at lg (a small fraction of a 24px icon) but
    // reads as a visibly "cut" star at sm (the same few px against a
    // 16px icon) - confirmed via getBoundingClientRect(): fillIcon sat
    // 2px lower than the backdrop/indicator/item box it should exactly
    // match, entirely explained by the button's own default padding.
    indicator: 'group/step absolute inset-y-0 left-0 flex items-start justify-start overflow-hidden p-0 leading-none [opacity:var(--reka-rating-item-step-opacity)] [width:var(--reka-rating-item-step-width)] [z-index:var(--reka-rating-item-step-z-index)] disabled:cursor-not-allowed',
    // Same star shape again, same fixed size as the backdrop - see the
    // indicator slot's own comment for why this can't be sized relative
    // to its own (intentionally shrunk) indicator parent. Transparent at
    // rest - a transparent star atop the muted backdrop simply shows the
    // backdrop through it, reading as "not filled" with no shape swap
    // needed - recolored once its own indicator's data-state flips to
    // active.
    fillIcon: 'text-transparent transition-colors group-data-[state=active]/step:text-[var(--ui-primary)]',
  },
  variants: {
    orientation: {
      horizontal: { root: 'flex-row gap-1' },
      vertical: { root: 'flex-col gap-1' },
    },
    size: {
      sm: { item: 'size-4', icon: 'size-4', fillIcon: 'size-4' },
      md: { item: 'size-5', icon: 'size-5', fillIcon: 'size-5' },
      lg: { item: 'size-6', icon: 'size-6', fillIcon: 'size-6' },
    },
    color: {
      primary: { fillIcon: 'group-data-[state=active]/step:text-[var(--ui-primary)]' },
      neutral: { fillIcon: 'group-data-[state=active]/step:text-[var(--ui-bg-inverted)]' },
      secondary: { fillIcon: 'group-data-[state=active]/step:text-[var(--ui-secondary)]' },
      success: { fillIcon: 'group-data-[state=active]/step:text-[var(--ui-success)]' },
      danger: { fillIcon: 'group-data-[state=active]/step:text-[var(--ui-danger)]' },
      info: { fillIcon: 'group-data-[state=active]/step:text-[var(--ui-info)]' },
      warning: { fillIcon: 'group-data-[state=active]/step:text-[var(--ui-warning)]' },
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    size: 'md',
    color: 'primary',
  },
})

export type RatingThemeSlots = keyof (typeof ratingTheme)['slots']
