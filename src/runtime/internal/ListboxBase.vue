<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { ListboxThemeSlots } from '../theme/listbox'
import type { ListboxProps } from '../utils/listbox-contracts'
import type { SelectModelValue } from '../utils/select-contracts'
import type { ResolvedItemOption, SelectItems } from './combobox-select'
import { ListboxContent, ListboxFilter, ListboxGroup, ListboxGroupLabel, ListboxRoot, ListboxVirtualizer, useFilter } from 'reka-ui'
import { computed, ref, toRaw, useId } from 'vue'
import Checkbox from '../components/Checkbox.vue'
import Icon from '../components/Icon.vue'
import { useFormField } from '../composables/use-form-field'
import { useIcons } from '../composables/use-icons'
import { useMessages } from '../composables/use-messages'
import { listboxTheme } from '../theme/listbox'
import { resolveRegisteredColorRole } from '../utils/registered-colors'
import { resolveSlot, useComponentTheme, useFallthroughAttrs, useRootProps } from '../utils/ui'
import { isOptionGroup, useComboboxSelect } from './combobox-select'
import { useListSelection } from './list-selection'
import ListboxOption from './ListboxOption.vue'
import ListSelectionForm from './ListSelectionForm.vue'

export interface ListboxBaseProps extends Omit<ListboxProps, 'items' | 'valueKey' | 'labelKey' | 'descriptionKey' | 'multiple' | 'modelValue' | 'defaultValue'> {
  items: SelectItems
  valueKey?: string
  labelKey?: string
  descriptionKey?: string
  multiple?: boolean
  modelValue?: SelectModelValue | SelectModelValue[]
  defaultValue?: SelectModelValue | SelectModelValue[]
  /** Composite panels must not inherit or submit their parent's form value. */
  formField?: boolean
}
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<ListboxBaseProps>(), { formField: true })
const emit = defineEmits<{
  'update:modelValue': [value: SelectModelValue | SelectModelValue[] | undefined]
  'update:searchTerm': [value: string]
}>()
const slots = defineSlots<{
  'item'?: (props: { item: SelectModelValue, index: number, selected: boolean, disabled: boolean }) => any
  'group'?: (props: { group: { label: string, items: readonly SelectModelValue[] } }) => any
  'header'?: () => any
  'footer'?: () => any
  'empty'?: () => any
  'empty-filter'?: () => any
}>()
const parentField = useFormField()
const field = props.formField === false ? undefined : parentField
const icons = useIcons()
const messages = useMessages()
const { selection, values, update, reset } = useListSelection(props, value => emit('update:modelValue', value))
const { flatOptions } = useComboboxSelect({
  get items() { return props.items },
  get valueKey() { return props.valueKey },
  get labelKey() { return props.labelKey },
  get modelValue() { return selection.value },
}, (_, value) => update(value))
const localSearch = ref(props.searchTerm ?? '')
const search = computed({
  get: () => props.searchTerm ?? localSearch.value,
  set: (value: string) => {
    localSearch.value = value
    emit('update:searchTerm', value)
  },
})
const { contains } = useFilter({ sensitivity: 'base' })
function matches(option: ResolvedItemOption) {
  return !props.searchable || contains(option.label, search.value)
}
const visible = computed(() => flatOptions.value.filter(matches))
const visibleValues = computed(() => visible.value.map(option => option.value))
const optionsByValue = computed(() => new Map(flatOptions.value.map(option => [option.value, option])))
const indices = computed(() => new Map(flatOptions.value.map((option, index) => [option, index])))
const groups = computed(() => {
  let offset = 0
  return props.items.map((entry) => {
    const group = isOptionGroup(entry) ? entry : undefined
    const count = group ? group.items.length : 1
    const options = flatOptions.value.slice(offset, offset + count).map((option, index) => ({ option, index: offset + index })).filter(({ option }) => matches(option))
    offset += count
    return { group, options }
  }).filter(group => group.options.length)
})
const eligible = computed(() => visible.value.filter(option => !option.disabled).map(option => option.value))
const allChecked = computed(() => eligible.value.length > 0 && eligible.value.every(value => values.value.includes(value)))
const someChecked = computed(() => eligible.value.some(value => values.value.includes(value)))
function selectVisible(checked: boolean | 'indeterminate') {
  update(checked === true ? [...values.value, ...eligible.value.filter(value => !values.value.includes(value))] : values.value.filter(value => !eligible.value.includes(value)))
}
function onListKeydown(event: KeyboardEvent) {
  if (props.multiple && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'a') {
    event.preventDefault()
    event.stopPropagation()
    selectVisible(true)
  }
}
function updateSelection(value: SelectModelValue | SelectModelValue[] | undefined) {
  // Range selection must leave disabled options unchanged.
  update(Array.isArray(value) ? value.filter(item => !optionsByValue.value.get(item)?.disabled || values.value.includes(item)) : value)
}
const generatedId = useId()
const id = computed(() => props.id ?? field?.id ?? `selaras-listbox-${generatedId}`)
const content = ref<{ $el: HTMLElement }>()
defineExpose({ focus: () => content.value?.$el.focus() })
const size = computed(() => props.size ?? field?.size ?? 'md')
const invalid = computed(() => props.invalid || field?.invalid.value || false)
const color = computed(() => resolveRegisteredColorRole(invalid.value ? 'danger' : props.color ?? 'primary', 'primary'))
const theme = useComponentTheme('listbox', listboxTheme)
const ui = computed(() => theme.value({ size: size.value, color: color.value as VariantProps<typeof listboxTheme>['color'], invalid: invalid.value }))
const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root, { exclude: key => key.startsWith('aria-') })
const a11yAttrs = useFallthroughAttrs(key => key.startsWith('aria-'))
const parts = computed(() => Object.fromEntries((Object.keys(listboxTheme.slots) as ListboxThemeSlots[]).map(key => [key, resolveSlot(ui.value[key], props.ui?.[key])])) as Record<ListboxThemeSlots, Record<string, unknown>>)
const virtual = computed(() => typeof props.virtualize === 'object' ? { estimateSize: 40, overscan: 8, ...props.virtualize } : { estimateSize: 40, overscan: 8 })
const rowProps = computed(() => ({ parts: parts.value, disabled: props.disabled, checkbox: !!props.multiple && props.checkbox, descriptionKey: props.descriptionKey ?? 'description', color: color.value, size: size.value }))
function sameValue(a: unknown, b: unknown) {
  return toRaw(a) === toRaw(b)
}
function resetForm() {
  reset()
  search.value = ''
}
</script>

<template>
  <ListboxRoot :model-value="selection ?? (multiple ? [] : null)" :multiple="multiple" :disabled="disabled" :selection-behavior="selectionBehavior ?? 'toggle'" :by="sameValue" highlight-on-hover :data-selaras-color="color" v-bind="rootProps" @update:model-value="updateSelection($event as SelectModelValue | SelectModelValue[] | undefined)">
    <div v-if="slots.header || (multiple && selectAll) || loading" v-bind="parts.header">
      <slot name="header" />
      <Checkbox v-if="multiple && selectAll" :id="`${generatedId}-select-all`" name="" :model-value="allChecked ? true : someChecked ? 'indeterminate' : false" :disabled="disabled || !eligible.length" :color="color" :size="size" :label="messages.selectAll" @update:model-value="selectVisible" />
      <Icon v-if="loading" :name="icons.loading" :aria-label="messages.loading" class="animate-spin" v-bind="parts.icon" />
    </div>
    <div v-if="searchable" v-bind="parts.searchWrapper">
      <Icon :name="icons.search" v-bind="parts.icon" />
      <ListboxFilter v-model="search" :disabled="disabled" :placeholder="messages.search" :aria-label="messages.search" role="combobox" aria-autocomplete="list" :aria-expanded="true" :aria-controls="id" v-bind="parts.searchInput" />
    </div>
    <ListboxContent :id="id" ref="content" :aria-label="label ?? (field?.labelId ? undefined : messages.select)" :aria-labelledby="field?.labelId" :aria-describedby="field?.describedBy.value" :aria-invalid="invalid || undefined" :aria-busy="loading || undefined" v-bind="{ ...parts.content, ...a11yAttrs }" @keydown.capture="onListKeydown">
      <div v-if="!visible.length" v-bind="parts.empty">
        <slot v-if="!flatOptions.length" name="empty">
          {{ messages.noOptions }}
        </slot>
        <slot v-else name="empty-filter">
          {{ messages.noResultsFound }}
        </slot>
      </div>
      <ListboxVirtualizer v-else-if="virtualize" v-slot="{ option: value, virtualItem }" :options="visibleValues" :text-content="value => optionsByValue.get(value)!.label" v-bind="virtual">
        <ListboxOption :option="optionsByValue.get(value)!" :index="indices.get(optionsByValue.get(value)!) ?? virtualItem.index" :selected="values.includes(value)" v-bind="rowProps">
          <template v-if="slots.item" #default="data">
            <slot name="item" v-bind="data" />
          </template>
        </ListboxOption>
      </ListboxVirtualizer>
      <template v-else>
        <ListboxGroup v-for="(group, groupIndex) in groups" :key="groupIndex" v-bind="parts.group">
          <ListboxGroupLabel v-if="group.group" v-bind="parts.groupLabel">
            <slot name="group" :group="group.group">
              {{ group.group.label }}
            </slot>
          </ListboxGroupLabel>
          <ListboxOption v-for="{ option, index } in group.options" :key="option.key" :option="option" :index="index" :selected="values.includes(option.value)" v-bind="rowProps">
            <template v-if="slots.item" #default="data">
              <slot name="item" v-bind="data" />
            </template>
          </ListboxOption>
        </ListboxGroup>
      </template>
    </ListboxContent>
    <div v-if="slots.footer" v-bind="parts.footer">
      <slot name="footer" />
    </div>
    <ListSelectionForm v-if="formField !== false" :values="values" :name="name ?? field?.name" :form="form" :required="required" :disabled="disabled" @reset="resetForm" />
  </ListboxRoot>
</template>
