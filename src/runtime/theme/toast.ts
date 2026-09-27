import { tv, type VariantProps } from 'tailwind-variants'

export const toastTheme = tv({
  slots: {
    viewport: 'fixed z-[var(--selaras-resolved-z-toast)] flex w-full max-w-sm flex-col gap-2 p-4 outline-none',
    root: 'relative flex items-start gap-3 rounded-[var(--selaras-resolved-radius-md)] bg-[var(--selaras-resolved-surface-default)] p-4 pe-10 shadow-[var(--selaras-resolved-shadow-lg)] ring-1 ring-[var(--selaras-resolved-border-default)] border-s-2 border-s-[var(--_selaras-color-fill,var(--selaras-resolved-border-default))] transition-[margin,transform,opacity] duration-300 ease-out motion-reduce:transition-none motion-reduce:animate-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
    title: 'text-sm font-medium text-[var(--selaras-resolved-text-default)]',
    description: 'mt-1 text-sm text-[var(--selaras-resolved-text-muted)]',
    // Base (no color set) is a plain neutral glyph - only shown at all when
    // `icon` is set without a `color`, since a colorless toast otherwise
    // has nothing to render here.
    icon: 'size-5 shrink-0 text-[var(--_selaras-color-fill,var(--selaras-resolved-text-muted))]',
    // Rendered as an <SButton> (ghost/neutral) - real chrome, focus ring and
    // touch target now come from Button's own theme; rounded-full overrides
    // its default rounded-md just for this dismiss-glyph family (close/clear).
    // Positioning (this card doesn't lay it out via flex, unlike Modal's
    // header) stays here, alongside the root's matching pr- reserved space.
    close: 'absolute end-1.5 top-1.5 shrink-0 rounded-full',
  },
  variants: {
    position: {
      'top-left': { viewport: 'top-0 start-0', root: 'data-[state=open]:slide-in-from-top-2 data-[state=closed]:slide-out-to-top-2' },
      'top-center': { viewport: 'top-0 left-1/2 -translate-x-1/2', root: 'data-[state=open]:slide-in-from-top-2 data-[state=closed]:slide-out-to-top-2' },
      'top-right': { viewport: 'top-0 end-0', root: 'data-[state=open]:slide-in-from-top-2 data-[state=closed]:slide-out-to-top-2' },
      'bottom-left': { viewport: 'bottom-0 start-0', root: 'data-[state=open]:slide-in-from-bottom-2 data-[state=closed]:slide-out-to-bottom-2' },
      'bottom-center': { viewport: 'bottom-0 left-1/2 -translate-x-1/2', root: 'data-[state=open]:slide-in-from-bottom-2 data-[state=closed]:slide-out-to-bottom-2' },
      'bottom-right': { viewport: 'bottom-0 end-0', root: 'data-[state=open]:slide-in-from-bottom-2 data-[state=closed]:slide-out-to-bottom-2' },
    },
    expand: {
      true: {},
      false: {},
    },
    // A colored icon + a matching left-edge accent border - not a full
    // colored card background, matching this library's existing restraint
    // elsewhere (Dropdown's own `destructive` only recolors text/icon + a
    // soft hover tint, never repaints the whole menu).
    color: {
      success: '',
      danger: '',
      warning: '',
      info: '',
    },
  },
  defaultVariants: {
    position: 'bottom-right',
    expand: true,
  },
  compoundVariants: [
    // Keep the newest toast above the stacked cards; measured overlap spacing
    // is applied per item so long descriptions do not expose most of a card.
    { position: 'top-left', expand: false, class: { root: 'first:z-10' } },
    { position: 'top-center', expand: false, class: { root: 'first:z-10' } },
    { position: 'top-right', expand: false, class: { root: 'first:z-10' } },
    { position: 'bottom-left', expand: false, class: { root: 'last:z-10' } },
    { position: 'bottom-center', expand: false, class: { root: 'last:z-10' } },
    { position: 'bottom-right', expand: false, class: { root: 'last:z-10' } },
  ],
})

export type ToastThemeSlots = keyof (typeof toastTheme)['slots']
export type ToastPosition = NonNullable<VariantProps<typeof toastTheme>['position']>
