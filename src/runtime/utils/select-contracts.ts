import type { VariantProps } from 'tailwind-variants'
import type { selectTheme, SelectThemeSlots } from '../theme/select'
import type { RoundedArrowConfig } from './arrow'
import type { ColorRole } from './color-registry'
import type { OverlayPortal, OverlayPositioning } from './overlay'
import type { UiProp } from './ui'

export type SelectValue = string | number
export type SelectModelValue = SelectValue | object
export type SelectEntry = SelectValue | object

export interface SelectGroup<Item extends SelectEntry> {
  label: string
  items: readonly Item[]
}

/** Infer options from the entry array before unwrapping one group level. */
export type SelectEntryItem<Entry> = Entry extends SelectGroup<infer Item> ? Item : Entry
export type SelectEntryGroup<Entry> = Extract<Entry, SelectGroup<SelectEntry>>
export type SelectIdentityKeys<Item> = [Item] extends [object] ? {
  [Key in keyof Item]-?: Item[Key] extends SelectModelValue ? Key : never
}[keyof Item] & string : never
type DefaultObjectIdentity<Item extends object> = 'value' extends keyof Item
  ? Item extends { value: infer Value } ? Value : NonNullable<Item['value' & keyof Item]> | Item
  : Item
type ItemIdentity<Item, Key extends string> = Item extends SelectValue
  ? Item
  : Key extends 'value'
    ? Item extends object ? DefaultObjectIdentity<Item> : never
    : Key extends keyof Item ? Item[Key] : never
export type SelectIdentity<Entry, Key extends string = 'value'> = ItemIdentity<SelectEntryItem<Entry>, Key>
export type SelectModel<Value, Multiple extends boolean> = Multiple extends true ? Value[] : Value | undefined

type ValidEntry<Entry, Key extends string> = Entry extends SelectGroup<infer Item>
  ? SelectGroup<Item extends SelectValue ? Item : Key extends 'value' ? Item : Item & Record<Key, SelectModelValue>>
  : Entry extends SelectValue ? Entry : Key extends 'value' ? Entry : Entry & Record<Key, SelectModelValue>

export interface SelectResolvedOption<Entry, Key extends string = 'value'> {
  value: SelectIdentity<Entry, Key>
  label: string
  disabled: boolean
  /** Undefined while a selected identity is absent from the current options. */
  raw: SelectEntryItem<Entry> | undefined
}

export interface SelectProps<Entry extends SelectEntry = { value: SelectValue, label?: string, disabled?: boolean }, Key extends string = 'value', Multiple extends boolean = false> {
  id?: string
  name?: string
  /** ID of an associated form outside the component's ancestors. */
  form?: string
  items: readonly Entry[] & NoInfer<readonly ValidEntry<Entry, Key>[]>
  /** Uses an option's `value` field by default, or the whole object if absent. */
  valueKey?: Key & SelectIdentityKeys<SelectEntryItem<Entry>>
  /** Object field used for display; defaults to `label`. */
  labelKey?: keyof SelectEntryItem<Entry> & string
  open?: boolean
  /** Initial uncontrolled open state. */
  defaultOpen?: boolean
  modelValue?: NoInfer<SelectModel<SelectIdentity<Entry, Key>, Multiple>>
  /** Mount-captured selection/reset target, adapted to the current multiple mode. */
  defaultValue?: NoInfer<SelectModel<SelectIdentity<Entry, Key>, Multiple>>
  /** Controlled parents must update selection shape and mode together. */
  multiple?: Multiple
  searchable?: boolean
  virtualize?: boolean | { estimateSize?: number, overscan?: number }
  displayMode?: 'comma' | 'chip'
  maxChips?: number
  loading?: boolean
  placeholder?: string
  disabled?: boolean
  required?: boolean
  size?: VariantProps<typeof selectTheme>['size']
  invalid?: boolean
  /** The focus-ring color; the resting ring stays neutral. */
  color?: ColorRole
  clearable?: boolean
  searchTerm?: string
  resetSearchTermOnBlur?: boolean
  resetSearchTermOnSelect?: boolean
  arrow?: boolean | RoundedArrowConfig
  /** Positioning of the anchored list (the adaptive Select modal uses its own layout). */
  positioning?: OverlayPositioning
  /** Teleport target for the anchored list, or `false` to render it inline. */
  portal?: OverlayPortal
  /**
   * Opts into the control's accessible small-screen presentation. Select uses
   * a centered modal; Autocomplete keeps its editable combobox in a wider
   * nonmodal panel. The active presentation is chosen on open and held until
   * close.
   */
  adaptive?: boolean
  ui?: UiProp<SelectThemeSlots>
}

export interface SelectEmits<Entry extends SelectEntry = { value: SelectValue }, Key extends string = 'value', Multiple extends boolean = false> {
  'update:open': [value: boolean]
  'update:modelValue': [value: SelectModel<SelectIdentity<Entry, Key>, Multiple>]
  'update:searchTerm': [value: string]
}

export interface SelectSlots<Entry extends SelectEntry, Key extends string = 'value'> {
  'item'?: (props: { item: SelectEntryItem<Entry> }) => any
  'group'?: (props: { group: SelectEntryGroup<Entry> }) => any
  'value'?: (props: { selected: SelectResolvedOption<Entry, Key> | undefined }) => any
  'header'?: () => any
  'footer'?: () => any
  'empty'?: () => any
  'empty-filter'?: () => any
  'filter-icon'?: () => any
  'clear-icon'?: () => any
  'loading-icon'?: () => any
  'dropdown-icon'?: () => any
}
