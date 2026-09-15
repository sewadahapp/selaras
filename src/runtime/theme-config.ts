import type { VariantProps } from 'tailwind-variants'
import type { avatarTheme, AvatarThemeSlots } from './theme/avatar'
import type { badgeTheme, BadgeThemeSlots } from './theme/badge'
import type { buttonTheme, ButtonThemeSlots } from './theme/button'
import type { checkboxTheme, CheckboxThemeSlots } from './theme/checkbox'
import type { chipTheme, ChipThemeSlots } from './theme/chip'
import type { colorPickerTheme, ColorPickerThemeSlots } from './theme/color-picker'
import type { contextMenuTheme, ContextMenuThemeSlots } from './theme/context-menu'
import type { drawerTheme, DrawerThemeSlots } from './theme/drawer'
import type { dropdownTheme, DropdownThemeSlots } from './theme/dropdown'
import type { fileUploadTheme, FileUploadThemeSlots } from './theme/file-upload'
import type { formFieldTheme, FormFieldThemeSlots } from './theme/form-field'
import type { inputTheme, InputThemeSlots } from './theme/input'
import type { inputNumberTheme, InputNumberThemeSlots } from './theme/input-number'
import type { modalTheme, ModalThemeSlots } from './theme/modal'
import type { pinInputTheme, PinInputThemeSlots } from './theme/pin-input'
import type { popoverTheme, PopoverThemeSlots } from './theme/popover'
import type { radioGroupTheme, RadioGroupThemeSlots } from './theme/radio-group'
import type { ratingTheme, RatingThemeSlots } from './theme/rating'
import type { slideoverTheme, SlideoverThemeSlots } from './theme/slideover'
import type { sliderTheme, SliderThemeSlots } from './theme/slider'
import type { switchTheme, SwitchThemeSlots } from './theme/switch'
import type { textareaTheme, TextareaThemeSlots } from './theme/textarea'
import type { toggleTheme, ToggleThemeSlots } from './theme/toggle'
import type { toggleGroupTheme, ToggleGroupThemeSlots } from './theme/toggle-group'
import type { tooltipTheme, TooltipThemeSlots } from './theme/tooltip'
import type { ColorRole, RuntimeTokenOverrides } from './utils/color-registry'

type AvatarVariants = VariantProps<typeof avatarTheme>
type BadgeVariants = VariantProps<typeof badgeTheme>
type ButtonVariants = VariantProps<typeof buttonTheme>
type CheckboxVariants = VariantProps<typeof checkboxTheme>
type ChipVariants = VariantProps<typeof chipTheme>
type ColorPickerVariants = VariantProps<typeof colorPickerTheme>
type InputVariants = VariantProps<typeof inputTheme>
type InputNumberVariants = VariantProps<typeof inputNumberTheme>
type FileUploadVariants = VariantProps<typeof fileUploadTheme>
type FormFieldVariants = VariantProps<typeof formFieldTheme>
type PinInputVariants = VariantProps<typeof pinInputTheme>
type RadioGroupVariants = VariantProps<typeof radioGroupTheme>
type RatingVariants = VariantProps<typeof ratingTheme>
type SliderVariants = VariantProps<typeof sliderTheme>
type SwitchVariants = VariantProps<typeof switchTheme>
type TextareaVariants = VariantProps<typeof textareaTheme>
type ToggleVariants = VariantProps<typeof toggleTheme>
type ToggleGroupVariants = VariantProps<typeof toggleGroupTheme>
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
  checkbox: {
    slots: CheckboxThemeSlots
    conditions: WithRegisteredColor<Pick<CheckboxVariants, 'color' | 'size' | 'variant' | 'invalid'>>
  }
  colorPicker: {
    slots: ColorPickerThemeSlots
    conditions: WithRegisteredColor<Pick<ColorPickerVariants, 'color' | 'size'>>
  }
  fileUpload: {
    slots: FileUploadThemeSlots
    conditions: WithRegisteredColor<Pick<FileUploadVariants, 'color' | 'size' | 'invalid'>>
  }
  formField: {
    slots: FormFieldThemeSlots
    conditions: Pick<FormFieldVariants, 'size' | 'orientation'>
  }
  inputNumber: {
    slots: InputNumberThemeSlots
    conditions: WithRegisteredColor<Pick<InputNumberVariants, 'color' | 'size' | 'orientation' | 'invalid'>>
  }
  pinInput: {
    slots: PinInputThemeSlots
    conditions: WithRegisteredColor<Pick<PinInputVariants, 'color' | 'size' | 'invalid'>>
  }
  radioGroup: {
    slots: RadioGroupThemeSlots
    conditions: WithRegisteredColor<Pick<RadioGroupVariants, 'color' | 'size' | 'orientation' | 'variant' | 'invalid'>>
  }
  rating: {
    slots: RatingThemeSlots
    conditions: WithRegisteredColor<Pick<RatingVariants, 'color' | 'size' | 'orientation'>>
  }
  slider: {
    slots: SliderThemeSlots
    conditions: WithRegisteredColor<Pick<SliderVariants, 'color' | 'size' | 'orientation' | 'thumbVariant'>>
  }
  switch: {
    slots: SwitchThemeSlots
    conditions: WithRegisteredColor<Pick<SwitchVariants, 'color' | 'size' | 'invalid'>>
  }
  textarea: {
    slots: TextareaThemeSlots
    conditions: WithRegisteredColor<Pick<TextareaVariants, 'color' | 'size' | 'hasLeadingIcon' | 'hasTrailingIcon' | 'autoresize' | 'invalid'>>
  }
  toggle: {
    slots: ToggleThemeSlots
    conditions: WithRegisteredColor<Pick<ToggleVariants, 'color' | 'size' | 'square'>>
  }
  toggleGroup: {
    slots: ToggleGroupThemeSlots
    conditions: WithRegisteredColor<Pick<ToggleGroupVariants, 'color' | 'size' | 'orientation'>>
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
