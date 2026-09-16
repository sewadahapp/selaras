import { tv } from 'tailwind-variants'

export const toastTheme = tv({
  slots: {
    viewport: 'fixed bottom-0 end-0 z-[var(--selaras-resolved-z-toast)] flex w-full max-w-sm flex-col gap-2 p-4 outline-none',
    root: 'relative flex items-start gap-3 rounded-[var(--selaras-resolved-radius-md)] bg-[var(--selaras-resolved-surface-default)] p-4 pe-10 shadow-[var(--selaras-resolved-shadow-lg)] ring-1 ring-[var(--selaras-resolved-border-default)] border-s-2 border-s-[var(--_selaras-color-fill,var(--selaras-resolved-border-default))] data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-2 data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-end-full',
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
})

export type ToastThemeSlots = keyof (typeof toastTheme)['slots']
