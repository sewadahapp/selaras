import type { VariantProps } from 'tailwind-variants'
import type { avatarTheme, AvatarThemeSlots } from './theme/avatar'
import type { badgeTheme, BadgeThemeSlots } from './theme/badge'
import type { buttonTheme, ButtonThemeSlots } from './theme/button'
import type { chipTheme, ChipThemeSlots } from './theme/chip'
import type { contextMenuTheme, ContextMenuThemeSlots } from './theme/context-menu'
import type { drawerTheme, DrawerThemeSlots } from './theme/drawer'
import type { dropdownTheme, DropdownThemeSlots } from './theme/dropdown'
import type { inputTheme, InputThemeSlots } from './theme/input'
import type { modalTheme, ModalThemeSlots } from './theme/modal'
import type { popoverTheme, PopoverThemeSlots } from './theme/popover'
import type { slideoverTheme, SlideoverThemeSlots } from './theme/slideover'
import type { tooltipTheme, TooltipThemeSlots } from './theme/tooltip'
import type { ColorRole, RuntimeTokenOverrides } from './utils/color-registry'

type AvatarVariants = VariantProps<typeof avatarTheme>
type BadgeVariants = VariantProps<typeof badgeTheme>
type ButtonVariants = VariantProps<typeof buttonTheme>
type ChipVariants = VariantProps<typeof chipTheme>
type InputVariants = VariantProps<typeof inputTheme>
type ContextMenuVariants = VariantProps<typeof contextMenuTheme>
type DrawerVariants = VariantProps<typeof drawerTheme>
type DropdownVariants = VariantProps<typeof dropdownTheme>
type ModalVariants = VariantProps<typeof modalTheme>
type PopoverVariants = VariantProps<typeof popoverTheme>
type SlideoverVariants = VariantProps<typeof slideoverTheme>
type TooltipVariants = VariantProps<typeof tooltipTheme>

// Replace the library recipe's finite color union rather than intersecting it:
// an intersection would discard every application-registered role.
type WithRegisteredColor<T> = Omit<T, 'color'> & { color?: ColorRole }

/**
 * The finite component configuration contract. A `ui` entry exists when the
 * component consumes a scoped Tailwind Variants recipe. Only entries that
 * explicitly declare `defaults` consume scoped presentation defaults;
 * behavioral props never belong there. Add entries alongside runtime and
 * contract tests.
 */
export interface ThemeComponentRegistry {
  avatar: {
    slots: AvatarThemeSlots
    conditions: WithRegisteredColor<Pick<AvatarVariants, 'color' | 'statusColor' | 'size' | 'shape'>>
    defaults: WithRegisteredColor<Pick<AvatarVariants, 'color' | 'size'>>
  }
  badge: {
    slots: BadgeThemeSlots
    conditions: WithRegisteredColor<Pick<BadgeVariants, 'color' | 'variant' | 'size' | 'dotOnly' | 'iconOnly'>>
    defaults: WithRegisteredColor<Pick<BadgeVariants, 'color' | 'size'>>
  }
  button: {
    slots: ButtonThemeSlots
    conditions: WithRegisteredColor<Pick<ButtonVariants, 'color' | 'variant' | 'size' | 'block' | 'raised' | 'square'>>
    defaults: WithRegisteredColor<Pick<ButtonVariants, 'color' | 'size'>>
  }
  chip: {
    slots: ChipThemeSlots
    conditions: WithRegisteredColor<Pick<ChipVariants, 'color' | 'size'>>
    defaults: WithRegisteredColor<Pick<ChipVariants, 'color' | 'size'>>
  }
  input: {
    slots: InputThemeSlots
    conditions: WithRegisteredColor<Pick<InputVariants, 'color' | 'size' | 'hasLeadingIcon' | 'hasTrailingIcon' | 'invalid'>>
    defaults: WithRegisteredColor<Pick<InputVariants, 'color' | 'size'>>
  }
  /** Overlay recipes accept typed UI extension but no scoped prop defaults. */
  contextMenu: {
    slots: ContextMenuThemeSlots
    conditions: Pick<ContextMenuVariants, 'destructive'>
  }
  drawer: {
    slots: DrawerThemeSlots
    conditions: Pick<DrawerVariants, 'side' | 'transition'>
  }
  dropdown: {
    slots: DropdownThemeSlots
    conditions: Pick<DropdownVariants, 'destructive'>
  }
  modal: {
    slots: ModalThemeSlots
    conditions: Pick<ModalVariants, 'fullscreen' | 'transition'>
  }
  popover: {
    slots: PopoverThemeSlots
    conditions: Pick<PopoverVariants, never>
  }
  slideover: {
    slots: SlideoverThemeSlots
    conditions: Pick<SlideoverVariants, 'side' | 'inset' | 'transition'>
  }
  tooltip: {
    slots: TooltipThemeSlots
    conditions: Pick<TooltipVariants, never>
  }
}

type ThemeConditions<K extends keyof ThemeComponentRegistry> = {
  [P in keyof ThemeComponentRegistry[K]['conditions']]?: ThemeComponentRegistry[K]['conditions'][P] | readonly NonNullable<ThemeComponentRegistry[K]['conditions'][P]>[]
}

type ThemeSlots<K extends keyof ThemeComponentRegistry> = Partial<Record<ThemeComponentRegistry[K]['slots'], string>>

/** Typed Tailwind Variants extensions accepted by `selaras.ui` and `STheme`. */
export type ThemeUiOverrides = {
  [K in keyof ThemeComponentRegistry]?: {
    slots?: ThemeSlots<K>
    compoundVariants?: readonly (ThemeConditions<K> & { class: ThemeSlots<K> })[]
  }
}

/** Presentation defaults have a deliberately separate, finite home from UI recipes. */
export type ThemeDefaults = {
  [K in keyof ThemeComponentRegistry as 'defaults' extends keyof ThemeComponentRegistry[K] ? K : never]?: ThemeComponentRegistry[K] extends { defaults: infer Defaults } ? Partial<Defaults> : never
}

/** Public configuration shared by `app.config` and scoped `STheme` providers. */
export interface ThemeConfiguration {
  ui?: ThemeUiOverrides
  defaults?: ThemeDefaults
  tokens?: RuntimeTokenOverrides
}
