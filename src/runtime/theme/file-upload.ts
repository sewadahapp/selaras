import { tv } from 'tailwind-variants'

export const fileUploadTheme = tv({
  slots: {
    root: 'flex w-full flex-col gap-3',
    // The real drop target and click-to-browse trigger - a <button>,
    // not a <div>, so keyboard focus/activation (Enter/Space) comes free
    // instead of needing hand-rolled keydown handling. dragging (a
    // component-set data attribute, not a native one) recolors it
    // toward `color` - see the color variant below.
    dropzone: 'flex w-full flex-col items-center justify-center gap-2 rounded-[var(--selaras-resolved-radius-md)] border-2 border-dashed border-[var(--selaras-resolved-border-default)] p-6 text-center transition-colors hover:border-[var(--selaras-resolved-border-hover)] hover:bg-[var(--selaras-resolved-surface-elevated)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--_selaras-color-focus)] data-[dragging]:border-[var(--_selaras-color-fill)] data-[dragging]:bg-[var(--_selaras-color-subtle)] disabled:opacity-50 disabled:pointer-events-none',
    icon: 'text-[var(--_selaras-color-fill)]',
    label: 'font-medium text-[var(--selaras-resolved-text-default)]',
    description: 'text-[var(--selaras-resolved-text-muted)]',
    // Purely an implementation detail - visually hidden and (via
    // tabindex="-1" in FileUpload.vue) not independently tab-reachable
    // either.
    // The sibling dropzone <button> is the visible focusable, Enter/
    // Space-activatable control (free native semantics); this input just
    // gets programmatically .click()'d to open the OS file dialog. Native
    // label/validation focus on the input is forwarded to the dropzone.
    input: 'sr-only',
    fileList: 'flex w-full flex-col gap-2',
    file: 'flex items-center gap-3 rounded-[var(--selaras-resolved-radius-md)] border border-[var(--selaras-resolved-border-default)] p-2',
    fileThumbnail: 'size-8 shrink-0 rounded-[var(--selaras-resolved-radius-sm)] object-cover',
    fileIcon: 'size-8 shrink-0 text-[var(--selaras-resolved-text-muted)]',
    fileInfo: 'flex min-w-0 flex-1 flex-col',
    fileName: 'truncate text-[var(--selaras-resolved-text-default)]',
    fileSize: 'text-[var(--selaras-resolved-text-muted)]',
    fileRemove: 'shrink-0',
  },
  variants: {
    size: {
      sm: { dropzone: 'p-4 text-xs', icon: 'size-6', fileThumbnail: 'size-7', fileIcon: 'size-7', fileName: 'text-xs', fileSize: 'text-xs' },
      md: { dropzone: 'p-6 text-sm', icon: 'size-8', fileThumbnail: 'size-8', fileIcon: 'size-8', fileName: 'text-sm', fileSize: 'text-xs' },
      lg: { dropzone: 'p-8 text-base', icon: 'size-10', fileThumbnail: 'size-10', fileIcon: 'size-10', fileName: 'text-base', fileSize: 'text-sm' },
    },
    // Unlike Input/PinInput's own `color` (focus-ring only, resting
    // stays neutral), FileUpload also tints the icon at rest - a
    // dropzone has no "typing" affordance to make a focus-only color
    // legible in practice, and a Color example that only ever shows 7
    // identical-looking boxes until you interact with each one isn't
    // actually demonstrating anything - confirmed as a real problem via
    // direct user feedback, not just a style preference.
    color: {
      primary: '',
      neutral: { icon: 'text-[var(--selaras-resolved-surface-inverted)]', dropzone: 'focus-visible:ring-[var(--selaras-resolved-surface-inverted)] data-[dragging]:border-[var(--selaras-resolved-surface-inverted)] data-[dragging]:bg-[var(--selaras-resolved-surface-elevated)]' },
      secondary: '',
      success: '',
      danger: '',
      info: '',
      warning: '',
    },
    // Declared last (after color) so tailwind-merge lets its own border
    // override win over color's - matches Input's own documented
    // reasoning for this order.
    invalid: {
      true: { dropzone: 'border-[var(--_selaras-color-fill)] focus-visible:ring-[var(--_selaras-color-fill)]' },
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'primary',
  },
})

export type FileUploadThemeSlots = keyof (typeof fileUploadTheme)['slots']
