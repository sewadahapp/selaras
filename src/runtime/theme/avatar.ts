import { tv } from 'tailwind-variants'

export const avatarTheme = tv({
  slots: {
    // `relative` anchors the absolutely-positioned status dot to the corner.
    base: 'relative inline-flex shrink-0 select-none items-center justify-center align-middle',
    // `content` wraps image + fallback with overflow-hidden so text/images
    // can't escape the avatar bounds, while the status dot (a sibling, not
    // a child) stays unclipped outside this wrapper.
    content: 'flex size-full overflow-hidden',
    image: 'h-full w-full object-cover',
    fallback: 'flex h-full w-full items-center justify-center',
    icon: 'shrink-0',
    // The ring separates the dot from the avatar itself, using the page
    // background so it reads as a clean offset indicator at any size.
    status: 'absolute bottom-0 right-0 rounded-full ring-2 ring-[var(--ui-bg)]',
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
      primary: { status: 'bg-[var(--ui-primary)]' },
      neutral: { status: 'bg-[var(--ui-text-muted)]' },
      secondary: { status: 'bg-[var(--ui-secondary)]' },
      success: { status: 'bg-[var(--ui-success)]' },
      danger: { status: 'bg-[var(--ui-danger)]' },
      info: { status: 'bg-[var(--ui-info)]' },
      warning: { status: 'bg-[var(--ui-warning)]' },
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
    { color: 'primary', class: { base: 'bg-[var(--ui-primary-soft)]', fallback: 'text-[var(--ui-primary)]' } },
    { color: 'neutral', class: { base: 'bg-[var(--ui-bg-elevated)]', fallback: 'text-[var(--ui-text-muted)]' } },
    { color: 'secondary', class: { base: 'bg-[var(--ui-secondary-soft)]', fallback: 'text-[var(--ui-secondary)]' } },
    { color: 'success', class: { base: 'bg-[var(--ui-success-soft)]', fallback: 'text-[var(--ui-success)]' } },
    { color: 'danger', class: { base: 'bg-[var(--ui-danger-soft)]', fallback: 'text-[var(--ui-danger)]' } },
    { color: 'info', class: { base: 'bg-[var(--ui-info-soft)]', fallback: 'text-[var(--ui-info)]' } },
    { color: 'warning', class: { base: 'bg-[var(--ui-warning-soft)]', fallback: 'text-[var(--ui-warning)]' } },
  ],
  defaultVariants: {
    color: 'neutral',
    statusColor: 'neutral',
    size: 'md',
    shape: 'circle',
  },
})

export type AvatarSlots = keyof (typeof avatarTheme)['slots']
