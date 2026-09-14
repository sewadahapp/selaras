import type { VariantProps } from 'tailwind-variants'
import type { avatarTheme, AvatarThemeSlots } from './theme/avatar'
import type { badgeTheme, BadgeThemeSlots } from './theme/badge'
import type { buttonTheme, ButtonThemeSlots } from './theme/button'
import type { chipTheme, ChipThemeSlots } from './theme/chip'
import type { inputTheme, InputThemeSlots } from './theme/input'
import type { ColorRole, RuntimeTokenOverrides } from './utils/color-registry'

type AvatarVariants = VariantProps<typeof avatarTheme>
type BadgeVariants = VariantProps<typeof badgeTheme>
type ButtonVariants = VariantProps<typeof buttonTheme>
type ChipVariants = VariantProps<typeof chipTheme>
type InputVariants = VariantProps<typeof inputTheme>

// Replace the library recipe's finite color union rather than intersecting it:
// an intersection would discard every application-registered role.
type WithRegisteredColor<T> = Omit<T, 'color'> & { color?: ColorRole }

/**
 * The finite component configuration contract. An entry exists only when its
 * component consumes scoped defaults today; behavioral props never belong
 * here. Add a component alongside its runtime consumer and contract tests.
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
  [K in keyof ThemeComponentRegistry]?: Partial<ThemeComponentRegistry[K]['defaults']>
}

/** Public configuration shared by `app.config` and scoped `STheme` providers. */
export interface ThemeConfiguration {
  ui?: ThemeUiOverrides
  defaults?: ThemeDefaults
  tokens?: RuntimeTokenOverrides
}
