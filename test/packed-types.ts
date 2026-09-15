import type { DtcgResolvedColor, SeedColorOptions } from '@sewadah/selaras/theme'
import type {
  AutocompleteEmits,
  AutocompleteProps,
  AutocompleteSlots,
  ButtonProps,
  ColorRole,
  SelectEmits,
  SelectGroup,
  SelectIdentity,
  SelectModel,
  SelectProps,
  SelectResolvedOption,
  SelectSlots,
  SelectValue,
  TableColumnDef,
  TableEmits,
  TableProps,
  TableRowSelectionState,
  ThemeConfiguration,
  ThemeProps,
  ToastOptions,
} from '@sewadah/selaras/types'
import type * as PublicTypes from '@sewadah/selaras/types'
import { createTableColumnHelper } from '@sewadah/selaras/table'
import { defineColor, defineColorFromSeed, dtcgColorToCss } from '@sewadah/selaras/theme'

interface PackedUser {
  id: string
  name: string
  age: number
}

const packedButton: ButtonProps = { color: 'primary' }
interface PackedOption { id: number, title: string }
type PackedEntry = PackedOption | SelectGroup<PackedOption>
const authoredItems: SelectProps<PackedEntry, 'id'>['items'] = [
  { id: 1, title: 'One' },
  { label: 'Group', items: [{ id: 2, title: 'Two' }] },
]
const authoredSelect: SelectProps<PackedEntry, 'id'> = { items: authoredItems, valueKey: 'id', modelValue: 2 }
const authoredIdentity: SelectIdentity<PackedEntry, 'id'> = 1
const authoredModel: SelectModel<typeof authoredIdentity, true> = [1]
const authoredResolved: SelectResolvedOption<PackedEntry, 'id'> = { value: 1, label: 'One', disabled: false, raw: undefined }
const primitiveIdentity: SelectValue = 'one'
// @ts-expect-error erased internal option records are not a public authoring API
type RemovedSelectOption = PublicTypes.SelectOption
// @ts-expect-error use ordinary readonly entry arrays or SelectProps['items']
type RemovedSelectItems = PublicTypes.SelectItems
// @ts-expect-error SelectGroup is the single public group shape
type RemovedSelectOptionGroup = PublicTypes.SelectOptionGroup
// @ts-expect-error derive slot data through the public SelectSlots contract
type RemovedSelectEntryItem = PublicTypes.SelectEntryItem
// @ts-expect-error entry unwrapping is internal type machinery
type RemovedSelectEntryGroup = PublicTypes.SelectEntryGroup
// @ts-expect-error key validation is part of SelectProps
type RemovedSelectIdentityKeys = PublicTypes.SelectIdentityKeys
const removedTypes: [RemovedSelectOption, RemovedSelectItems, RemovedSelectOptionGroup, RemovedSelectEntryItem, RemovedSelectEntryGroup, RemovedSelectIdentityKeys] | undefined = undefined
const numericSelect: SelectProps<{ label: string, value: number }> = {
  items: [{ label: 'One', value: 1 }],
  modelValue: 1,
}
const stringAutocomplete: AutocompleteProps<{ label: string, value: string }> = {
  items: [{ label: 'One', value: 'one' }],
  modelValue: 'one',
}
const invalidNumericSelect: SelectProps<{ label: string, value: number }> = {
  items: [{ label: 'One', value: 1 }],
  // @ts-expect-error typed props keep numeric and string value contracts distinct
  modelValue: 'one',
}
const customSelect: SelectProps<{ id: number, title: string }, 'id', true> = {
  items: [{ id: 1, title: 'One' }],
  valueKey: 'id',
  labelKey: 'title',
  multiple: true,
  modelValue: [1],
}
const numericSelectUpdate: SelectEmits<{ value: number }>['update:modelValue'] = [1]
const multipleSelectUpdate: SelectEmits<{ id: number }, 'id', true>['update:modelValue'] = [[]]
// @ts-expect-error single mode updates never contain arrays
const invalidSelectUpdate: SelectEmits<{ value: number }>['update:modelValue'] = [[1]]
const selectSlots: SelectSlots<{ id: number, title: string }, 'id'> = {
  item: ({ item }) => item.title.toUpperCase(),
  value: ({ selected }) => selected?.raw?.title.toUpperCase(),
}
const numericAutocomplete: AutocompleteProps<{ label: string, value: number }, 'value', true> = {
  items: [{ label: 'One', value: 1 }],
  modelValue: [1, 'new entry'],
  defaultValue: ['initial text'],
}
const createdAutocompleteText: AutocompleteEmits<{ value: number }>['update:modelValue'] = ['new entry']
const selectedAutocompleteNumber: AutocompleteEmits<{ value: number }>['update:modelValue'] = [1]
const mixedAutocompleteValues: AutocompleteEmits<{ value: number }, 'value', true>['update:modelValue'] = [[1, 'new entry']]
// @ts-expect-error free text does not permit non-primitive values
const invalidAutocompleteValue: AutocompleteEmits<{ value: number }>['update:modelValue'] = [true]
const invalidAutocompleteSuggestion: AutocompleteProps<{ value: number }> = {
  // @ts-expect-error suggestion identities remain numeric even though new text is allowed
  items: [{ value: 'one' }],
}
const forcedAutocomplete: AutocompleteProps<{ id: number, title: string }, 'id', false, true> = {
  items: [{ id: 1, title: 'One' }],
  valueKey: 'id',
  labelKey: 'title',
  forceSelection: true,
  defaultValue: 1,
}
const forcedAutocompleteUpdate: AutocompleteEmits<{ id: number }, 'id', false, true>['update:modelValue'] = [1]
// @ts-expect-error literal forced selection cannot create arbitrary text
const invalidForcedAutocompleteUpdate: AutocompleteEmits<{ id: number }, 'id', false, true>['update:modelValue'] = ['new entry']
const autocompleteSlots: AutocompleteSlots<{ id: number, title: string }> = { item: ({ item }) => item.title.toUpperCase() }
const packedTheme: ThemeProps = { defaults: { button: { size: 'lg' } } }
const packedOverlayTheme: ThemeProps = { ui: { modal: { slots: { content: 'max-w-xl' } }, popover: { slots: { content: 'p-6' } } } }
const packedDtcgColor = { colorSpace: 'srgb', components: [0.1, 0.2, 0.3] } satisfies DtcgResolvedColor
const packedDtcgCss = dtcgColorToCss(packedDtcgColor)
const packedSeedOptions: SeedColorOptions = { surfaces: { light: '#f4f0e8', dark: '#20242a' } }
const packedSeedColor = defineColorFromSeed('#FD5E53', packedSeedOptions)
// @ts-expect-error only the documented resolved color spaces are supported
const invalidPackedDtcgColor: DtcgResolvedColor = { colorSpace: 'display-p3', components: [1, 0, 1] }
void packedDtcgCss
void packedSeedColor
void invalidPackedDtcgColor
void packedOverlayTheme
const packedThemeConfiguration: ThemeConfiguration = {
  defaults: { button: { color: 'primary', size: 'lg' } },
  ui: {
    accordion: { compoundVariants: [{ color: 'danger', size: 'lg', variant: 'pill', chevronPosition: 'start', class: { trigger: 'font-semibold' } }] },
    alert: { compoundVariants: [{ color: 'info', variant: 'outline', class: { root: 'shadow-sm' } }] },
    breadcrumb: { compoundVariants: [{ color: 'secondary', class: { link: 'underline-offset-4' } }] },
    button: { slots: { base: 'rounded-full' } },
    card: { compoundVariants: [{ variant: 'solid', class: { root: 'shadow-xl' } }] },
    cardGroup: { compoundVariants: [{ cols: 3, class: { root: 'gap-6' } }] },
    contextMenu: { compoundVariants: [{ destructive: true, class: { item: 'font-bold' } }] },
    checkbox: { compoundVariants: [{ color: 'danger', variant: 'card', class: { root: 'shadow-sm' } }] },
    colorPicker: { compoundVariants: [{ color: 'success', size: 'lg', class: { trigger: 'rounded-full' } }] },
    container: { compoundVariants: [{ size: 'sm', class: { base: 'px-2' } }] },
    collapsible: { compoundVariants: [{ color: 'warning', size: 'sm', direction: 'up', class: { trigger: 'font-semibold' } }] },
    drawer: { compoundVariants: [{ side: 'left', transition: false, class: { content: 'w-96' } }] },
    dropdown: { compoundVariants: [{ destructive: true, class: { item: 'font-bold' } }] },
    fileUpload: { compoundVariants: [{ color: 'warning', invalid: true, class: { dropzone: 'border-dashed' } }] },
    formField: { compoundVariants: [{ orientation: 'horizontal', class: { label: 'w-40' } }] },
    header: { slots: { root: 'h-14' } },
    icon: { compoundVariants: [{ color: 'warning', class: { base: 'opacity-75' } }] },
    inputNumber: { compoundVariants: [{ color: 'info', orientation: 'vertical', class: { input: 'tabular-nums' } }] },
    modal: { compoundVariants: [{ fullscreen: true, transition: false, class: { content: 'rounded-none' } }] },
    navigationMenu: { compoundVariants: [{ color: 'primary', active: true, variant: 'pill', class: { link: 'font-semibold' } }] },
    pagination: { compoundVariants: [{ size: 'lg', class: { root: 'gap-3' } }] },
    pageHeader: { slots: { root: 'pb-4' } },
    pinInput: { compoundVariants: [{ color: 'secondary', invalid: true, class: { input: 'font-mono' } }] },
    popover: { slots: { content: 'max-w-sm' } },
    radioGroup: { compoundVariants: [{ color: 'success', variant: 'card', class: { itemWrapper: 'shadow-sm' } }] },
    rating: { compoundVariants: [{ color: 'warning', orientation: 'vertical', class: { root: 'gap-2' } }] },
    select: { compoundVariants: [{ color: 'primary', invalid: true, class: { trigger: 'font-semibold' } }] },
    separator: { compoundVariants: [{ color: 'danger', orientation: 'vertical', variant: 'dashed', class: { line: 'opacity-75' } }] },
    skeleton: { compoundVariants: [{ animation: 'shimmer', class: { base: 'opacity-75' } }] },
    slider: { compoundVariants: [{ color: 'secondary', thumbVariant: 'bar', class: { thumb: 'shadow-sm' } }] },
    slideover: { compoundVariants: [{ side: 'right', inset: true, class: { content: 'w-96' } }] },
    switch: { compoundVariants: [{ color: 'success', invalid: true, class: { track: 'shadow-sm' } }] },
    stepper: { compoundVariants: [{ color: 'info', orientation: 'vertical', size: 'lg', class: { indicator: 'shadow-sm' } }] },
    tabs: { compoundVariants: [{ color: 'primary', variant: 'pill', class: { trigger: 'font-semibold' } }] },
    textarea: { compoundVariants: [{ color: 'info', autoresize: true, class: { base: 'leading-6' } }] },
    toast: { compoundVariants: [{ color: 'success', class: { root: 'shadow-xl' } }] },
    toggle: { compoundVariants: [{ color: 'secondary', square: true, class: { base: 'rounded-full' } }] },
    toggleGroup: { compoundVariants: [{ color: 'primary', orientation: 'vertical', class: { root: 'w-fit' } }] },
    tooltip: { slots: { content: 'font-medium' } },
  },
  tokens: { light: { surface: { elevated: 'var(--company-raised)' }, text: { muted: '#555555' }, border: { hover: '#777777' }, scrim: 'rgb(0 0 0 / .5)' } },
}
// @ts-expect-error functional groups have a finite semantic vocabulary
const invalidFunctionalTokens: ThemeConfiguration = { tokens: { dark: { surface: { hover: '#111111' } } } }
void invalidFunctionalTokens
// @ts-expect-error behavioral props are intentionally excluded from theme defaults
const invalidPackedThemeConfiguration: ThemeConfiguration = { defaults: { button: { disabled: true } } }
const invalidOverlayDefaults: ThemeConfiguration = {
  defaults: {
    // @ts-expect-error overlay components do not consume scoped prop defaults
    modal: { fullscreen: true },
  },
}
const invalidOverlayUi: ThemeConfiguration = {
  ui: {
    modal: {
      slots: {
        // @ts-expect-error modal's UI contract exposes real slots only
        nonexistent: 'rounded-full',
      },
    },
  },
}
void invalidOverlayDefaults
void invalidOverlayUi
// @ts-expect-error scoped defaults replace the pre-1.0 props namespace
const legacyTheme: ThemeProps = { props: { button: { size: 'lg' } } }
const packedRole: ColorRole = 'danger'
const packedColumns: TableColumnDef<PackedUser>[] = [
  { accessorKey: 'name', header: 'Name' },
]
const packedTable: TableProps<PackedUser> = {
  data: [{ id: 'user-a', name: 'Alice', age: 30 }],
  columns: packedColumns,
  getRowId: row => row.id,
  rowClass: row => row.age >= 18 ? 'adult' : undefined,
}
const packedToast: ToastOptions = { title: 'Saved', color: 'success' }
const packedColumnHelper = createTableColumnHelper<PackedUser>()
const packedAccessor = packedColumnHelper.accessor('age', {
  header: 'Age',
  cell: context => context.getValue().toFixed(0),
})
// @ts-expect-error unknown row keys must fail at the authoring boundary
const invalidAccessor = packedColumnHelper.accessor('missing', {})
const packedSelection: TableRowSelectionState = { 'user-a': true }
const packedColor = defineColor({
  light: {
    fill: '#5134a8',
    onFill: '#ffffff',
    subtle: '#eeeaff',
    onSubtle: '#201050',
    text: '#5134a8',
    border: '#765fc0',
  },
  dark: {
    fill: '#a895f0',
    onFill: '#170b38',
    subtle: '#2b2050',
    onSubtle: '#eeeaff',
    text: '#c9bcff',
    border: '#8c78d4',
  },
})
const packedColorLiteral: '#5134a8' = packedColor.light.fill
type TableSortingEvent = TableEmits<PackedUser>['update:sorting']
type TableRowClickEvent = TableEmits<PackedUser>['rowClick']
const packedTableEventShape: TableSortingEvent extends [any[]] ? true : false = true
const packedRowEventShape: TableRowClickEvent extends [PackedUser, MouseEvent] ? true : false = true

void packedButton
void authoredSelect
void authoredIdentity
void authoredModel
void authoredResolved
void primitiveIdentity
void removedTypes
void numericSelect
void customSelect
void numericSelectUpdate
void multipleSelectUpdate
void invalidSelectUpdate
void selectSlots
void stringAutocomplete
void invalidNumericSelect
void numericAutocomplete
void forcedAutocomplete
void forcedAutocompleteUpdate
void invalidForcedAutocompleteUpdate
void autocompleteSlots
void createdAutocompleteText
void selectedAutocompleteNumber
void mixedAutocompleteValues
void invalidAutocompleteValue
void invalidAutocompleteSuggestion
void packedTheme
void packedThemeConfiguration
void invalidPackedThemeConfiguration
void legacyTheme
void packedRole
void packedTable
void packedToast
void packedAccessor
void invalidAccessor
void packedSelection
void packedColorLiteral
void packedTableEventShape
void packedRowEventShape
