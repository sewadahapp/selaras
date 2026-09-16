import { tv } from 'tailwind-variants'

export const avatarTheme = tv({
  slots: {
    // `relative` anchors the absolutely-positioned status dot to the corner.
    base: 'relative inline-flex shrink-0 select-none items-center justify-center bg-[var(--_selaras-color-subtle)] align-middle',
    // `content` wraps image + fallback with overflow-hidden so text/images
    // can't escape the avatar bounds, while the status dot (a sibling, not
    // a child) stays unclipped outside this wrapper. items-center/
    // justify-center - AvatarFallback (Reka's own primitive) doesn't
    // stretch to fill this flex container on its own, so without these the
    // fallback icon/text sits flush at the start corner instead of centered.
    content: 'flex size-full items-center justify-center overflow-hidden',
    image: 'h-full w-full object-cover',
    fallback: 'flex h-full w-full items-center justify-center text-[var(--_selaras-color-text)]',
    icon: 'shrink-0',
    // The ring separates the dot from the avatar itself, using the page
    // background so it reads as a clean offset indicator at any size.
    status: 'absolute bottom-0 end-0 rounded-full ring-2 ring-[var(--ui-bg)]',
  },
  variants: {
    color: {
      primary: '',
      neutral: '',
      secondary: '',
      success: '',
      danger: '',
      info: '',
      warning: '',
    },
    // The status dot's color is independent of `color` - presence semantics
    // (online, offline, ...) rarely match the avatar's own identity color, so
    // it gets its own variant rather than tracking the avatar's.
    statusColor: {
      primary: { status: 'bg-[var(--selaras-resolved-color-primary-fill)]' },
      neutral: { status: 'bg-[var(--ui-text-muted)]' },
      secondary: { status: 'bg-[var(--selaras-resolved-color-secondary-fill)]' },
      success: { status: 'bg-[var(--selaras-resolved-color-success-fill)]' },
      danger: { status: 'bg-[var(--selaras-resolved-color-danger-fill)]' },
      info: { status: 'bg-[var(--selaras-resolved-color-info-fill)]' },
      warning: { status: 'bg-[var(--selaras-resolved-color-warning-fill)]' },
    },
    size: {
      sm: { base: 'size-6', fallback: 'text-[10px]', icon: 'size-3', status: 'size-1.5' },
      md: { base: 'size-8', fallback: 'text-xs', icon: 'size-4', status: 'size-2' },
      lg: { base: 'size-10', fallback: 'text-sm', icon: 'size-5', status: 'size-2.5' },
    },
    shape: {
      circle: { base: 'rounded-full' },
      rounded: { base: 'rounded-[var(--ui-radius-md)]' },
    },
  },
  compoundVariants: [
    { color: 'neutral', class: { fallback: 'text-[var(--ui-text-muted)]' } },
  ],
  defaultVariants: {
    color: 'neutral',
    statusColor: 'neutral',
    size: 'md',
    shape: 'circle',
  },
})

export type AvatarThemeSlots = keyof (typeof avatarTheme)['slots']
