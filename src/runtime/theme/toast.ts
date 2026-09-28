import type { VariantProps } from 'tailwind-variants'
import { tv } from 'tailwind-variants'

export const toastTheme = tv({
  slots: {
    // The cards are absolutely positioned inside it and moved with transforms
    // (see internal/toast-stack.ts); Toast.vue sizes it to fit the stack.
    viewport: 'fixed z-[var(--selaras-resolved-z-toast)] w-full max-w-sm p-4 outline-none',
    // Registered roles tint the surface softly; an uncolored toast falls
    // back to the regular surface. Text stays neutral for readability.
    //
    // Cards behind the front one cover their own content with an overlay
    // of the card surface (after:), so they read as a clean pile and fade
    // their content back in when they move to the front or fan out.
    root: 'absolute inset-x-4 flex items-start gap-3 rounded-[var(--selaras-resolved-radius-md)] bg-[var(--_selaras-color-subtle,var(--selaras-resolved-surface-default))] p-4 pe-10 shadow-[var(--selaras-resolved-shadow-lg)] ring-1 ring-[var(--selaras-resolved-border-default)] transition-[transform,opacity,height] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-[inherit] after:opacity-0 after:transition-opacity after:duration-400 data-[stack=behind]:overflow-hidden data-[stack=behind]:after:opacity-100 data-[stack=hidden]:pointer-events-none data-[stack=hidden]:overflow-hidden data-[stack=hidden]:opacity-0 data-[stack=hidden]:after:opacity-100 data-[state=open]:animate-[selaras-toast-in_400ms_cubic-bezier(0.22,1,0.36,1)] data-[state=closed]:animate-[selaras-toast-out_200ms_ease-in_forwards] data-[stack=behind]:[--_selaras-toast-exit:-25%] data-[stack=hidden]:[--_selaras-toast-exit:-25%] motion-reduce:transition-none motion-reduce:animate-none motion-reduce:after:transition-none',
    title: 'text-sm font-medium text-[var(--selaras-resolved-text-default)]',
    description: 'mt-1 text-sm text-[var(--selaras-resolved-text-muted)]',
    // Base (no color set) is a plain neutral glyph - only shown at all when
    // `icon` is set without a `color`, since a colorless toast otherwise
    // has nothing to render here.
    icon: 'size-5 shrink-0 text-[var(--_selaras-color-text,var(--selaras-resolved-text-muted))]',
    // Rendered as an <SButton> (ghost/neutral) - real chrome, focus ring and
    // touch target now come from Button's own theme; rounded-full overrides
    // its default rounded-md just for this dismiss-glyph family (close/clear).
    // Positioning (this card doesn't lay it out via flex, unlike Modal's
    // header) stays here, alongside the root's matching pr- reserved space.
    close: 'absolute end-1.5 top-1.5 shrink-0 rounded-full',
  },
  variants: {
    position: {
      'top-left': { viewport: 'top-0 start-0', root: 'top-4 origin-top [--_selaras-toast-lift:1]' },
      'top-center': { viewport: 'top-0 left-1/2 -translate-x-1/2', root: 'top-4 origin-top [--_selaras-toast-lift:1]' },
      'top-right': { viewport: 'top-0 end-0', root: 'top-4 origin-top [--_selaras-toast-lift:1]' },
      'bottom-left': { viewport: 'bottom-0 start-0', root: 'bottom-4 origin-bottom [--_selaras-toast-lift:-1]' },
      'bottom-center': { viewport: 'bottom-0 left-1/2 -translate-x-1/2', root: 'bottom-4 origin-bottom [--_selaras-toast-lift:-1]' },
      'bottom-right': { viewport: 'bottom-0 end-0', root: 'bottom-4 origin-bottom [--_selaras-toast-lift:-1]' },
    },
    expand: {
      true: {},
      false: {},
    },
    // Kept as pass-through variants so consumer recipe conditions can match
    // every registered role, including custom roles beyond this built-in set.
    color: {
      success: '',
      danger: '',
      warning: '',
      info: '',
    },
  },
  defaultVariants: {
    position: 'bottom-right',
    expand: false,
  },
})

export type ToastThemeSlots = keyof (typeof toastTheme)['slots']
export type ToastPosition = NonNullable<VariantProps<typeof toastTheme>['position']>
