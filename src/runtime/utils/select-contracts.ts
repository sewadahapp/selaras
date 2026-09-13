import type { VariantProps } from 'tailwind-variants'
import type { selectTheme, SelectThemeSlots } from '../theme/select'
import type { ColorRole } from './color-registry'
import type { UiProp } from './ui'

export type SelectValue = string | number

export interface SelectGroup<Item extends object> {
  label: string
  items: readonly Item[]
}

/** Infer options from the entry array before unwrapping one group level. */
export type SelectEntryItem<Entry> = Entry extends SelectGroup<infer Item> ? Item : Entry
export type SelectEntryGroup<Entry> = Extract<Entry, SelectGroup<object>>
export type SelectIdentityKeys<Item> = {
  [Key in keyof Item]-?: Item[Key] extends SelectValue ? Key : never
}[keyof Item] & string
export type SelectIdentity<Entry, Key extends string> = SelectEntryItem<Entry>[Key & keyof SelectEntryItem<Entry>] & SelectValue
export type SelectModel<Value, Multiple extends boolean> = Multiple extends true ? Value[] : Value | undefined

type ValidEntry<Entry, Key extends string> = Entry extends SelectGroup<infer Item>
  ? SelectGroup<Item & Record<Key, SelectValue>>
  : Entry & Record<Key, SelectValue>

export interface SelectResolvedOption<Entry, Key extends string = 'value'> {
  value: SelectIdentity<Entry, Key>
  label: string
  disabled: boolean
  /** Undefined while a selected identity is absent from the current options. */
  raw: SelectEntryItem<Entry> | undefined
}

export interface SelectProps<Entry extends object = { value: SelectValue, label?: string, disabled?: boolean }, Key extends string = 'value', Multiple extends boolean = false> {
  id?: string
  name?: string
  /** ID of an associated form outside the component's ancestors. */
  form?: string
  items: readonly Entry[] & NoInfer<readonly ValidEntry<Entry, Key>[]>
  valueKey?: Key & SelectIdentityKeys<SelectEntryItem<Entry>>
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
  arrow?: boolean
  /** Opts into centered modal presentation below 768px. */
  mobileModal?: boolean
  ui?: UiProp<SelectThemeSlots>
}

export interface SelectEmits<Entry extends object = { value: SelectValue }, Key extends string = 'value', Multiple extends boolean = false> {
  'update:open': [value: boolean]
  'update:modelValue': [value: SelectModel<SelectIdentity<Entry, Key>, Multiple>]
  'update:searchTerm': [value: string]
}

export interface SelectSlots<Entry extends object, Key extends string = 'value'> {
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
