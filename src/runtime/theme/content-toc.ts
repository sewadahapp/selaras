import { tv } from 'tailwind-variants'

export const contentTocTheme = tv({
  slots: {
    root: 'flex flex-col gap-2 text-sm',
    title: 'font-medium text-[var(--ui-text)]',
    // relative + start padding reserves room for the rail (an absolutely
    // positioned box, sized/placed entirely by ContentToc.vue's JS
    // measurement - this only wraps the <ul>, not the title, matching the
    // reference's own layout).
    railWrap: 'relative ps-7',
    list: 'flex flex-col gap-1',
    item: 'flex flex-col',
    // A lighter touch than the main sidebar's - this is a secondary,
    // supplementary "on this page" list, not primary navigation - but
    // still meaningfully bigger than the original py-0.5. No left
    // border/padding for the indicator anymore - the rail owns that job.
    link: 'block py-1.5 text-[var(--ui-text-muted)] transition-colors hover:text-[var(--ui-text)]',
    content: 'ms-3 flex flex-col gap-1',
    // The rail is a single continuous "wire" connecting every heading
    // (not just the active one), drawn as an SVG path and applied as a
    // CSS mask - see ContentToc.vue's buildDepthPath/buildMaskUrl. The
    // path itself is always built in a fixed left-to-right coordinate
    // space, so under RTL the container mirrors horizontally via a
    // transform rather than the path math being rebuilt per direction.
    // Two masked divs share that same path shape:
    railContainer: 'absolute start-0 top-0 rtl:-scale-x-100',
    // - a faint always-visible track (the full path, every heading).
    railTrack: 'absolute inset-0 bg-[var(--ui-text-muted)]/25',
    // - a primary-colored overlay, masked identically, whose own child
    //   blocks (railSegment, one per contiguous run of active headings)
    //   only paint where they fall within the path - so the "lit"
    //   portion follows the same curves as the track under it.
    railSegments: 'absolute inset-0',
    railSegment: 'absolute w-full bg-[var(--ui-primary)] transition-[top,height] duration-200 ease-out',
  },
  variants: {
    active: {
      true: { link: 'text-[var(--ui-primary)]' },
    },
  },
})

export type ContentTocSlots = keyof (typeof contentTocTheme)['slots']
