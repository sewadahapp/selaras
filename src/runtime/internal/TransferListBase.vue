<script setup lang="ts">
import type { TransferListThemeSlots } from '../theme/transfer-list'
import type { SelectModelValue } from '../utils/select-contracts'
import type { TransferListProps, TransferSide } from '../utils/transfer-list-contracts'
import type { SelectItems } from './combobox-select'
import { computed, getCurrentInstance, nextTick, ref, useSlots } from 'vue'
import Button from '../components/Button.vue'
import { useFormField } from '../composables/use-form-field'
import { useIcons } from '../composables/use-icons'
import { useMessages } from '../composables/use-messages'
import { transferListTheme } from '../theme/transfer-list'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import { isOptionGroup, useComboboxSelect } from './combobox-select'
import { assertUniqueSelection, useListSelection } from './list-selection'
import ListboxBase from './ListboxBase.vue'
import ListSelectionForm from './ListSelectionForm.vue'

export interface TransferListBaseProps extends Omit<TransferListProps, 'items' | 'valueKey' | 'labelKey' | 'descriptionKey'> {
  items: SelectItems
  valueKey?: string
  labelKey?: string
  descriptionKey?: string
}
defineOptions({ inheritAttrs: false })
const props = defineProps<TransferListBaseProps>()
const emit = defineEmits<{
  'update:modelValue': [value: SelectModelValue[]]
  'update:checked': [value: SelectModelValue[]]
  'update:sourceSearchTerm': [value: string]
  'update:targetSearchTerm': [value: string]
  'transfer': [payload: { direction: 'to-target' | 'to-source', items: SelectModelValue[], values: SelectModelValue[] }]
}>()
const slots = useSlots()
const field = useFormField()
const messages = useMessages()
const icons = useIcons()
const { values, update, reset } = useListSelection({
  get modelValue() { return props.modelValue },
  get defaultValue() { return props.defaultValue },
  get disabled() { return props.disabled },
  multiple: true,
}, value => emit('update:modelValue', value as SelectModelValue[]))
const { flatOptions, toOption } = useComboboxSelect(props, (_, value) => update(value))
const instance = getCurrentInstance()!
const localChecked = ref<SelectModelValue[]>([])
const checked = computed(() => {
  const value = Object.hasOwn(instance.vnode.props ?? {}, 'checked') ? props.checked ?? [] : localChecked.value
  if (!Array.isArray(value))
    throw new TypeError('[selaras] TransferList checked must be an array.')
  assertUniqueSelection(value)
  return value
})
function setChecked(value: SelectModelValue[]) {
  if (props.disabled)
    return
  if (!Object.hasOwn(instance.vnode.props ?? {}, 'checked'))
    localChecked.value = value
  emit('update:checked', value)
}
const sides: TransferSide[] = ['source', 'target']
const panelRefs: Partial<Record<TransferSide, InstanceType<typeof ListboxBase>>> = {}
const localSearch = ref({ source: '', target: '' })
function query(side: TransferSide) {
  return (side === 'source' ? props.sourceSearchTerm : props.targetSearchTerm) ?? localSearch.value[side]
}
function setQuery(side: TransferSide, value: string) {
  localSearch.value[side] = value
  if (side === 'source')
    emit('update:sourceSearchTerm', value)
  else
    emit('update:targetSearchTerm', value)
}
function onSide(value: SelectModelValue, side: TransferSide) {
  return values.value.includes(value) === (side === 'target')
}
function panelItems(side: TransferSide): SelectItems {
  // Preserve the authored groups and metadata without mutating either array.
  return props.items.flatMap((entry) => {
    if (isOptionGroup(entry)) {
      const items = entry.items.filter(item => onSide(toOption(item).value, side))
      return items.length ? [{ ...entry, items }] : []
    }
    return onSide(toOption(entry).value, side) ? [entry] : []
  })
}
const panels = computed(() => Object.fromEntries(sides.map(side => [side, {
  items: panelItems(side),
  options: flatOptions.value.filter(option => onSide(option.value, side)),
}])) as Record<TransferSide, { items: SelectItems, options: typeof flatOptions.value }>)
function panelChecked(side: TransferSide) {
  return checked.value.filter(value => onSide(value, side))
}
function updatePanelChecked(side: TransferSide, next: SelectModelValue | SelectModelValue[] | undefined) {
  setChecked([...checked.value.filter(value => !onSide(value, side)), ...(Array.isArray(next) ? next : [])])
}
function movable(side: TransferSide) {
  return panels.value[side].options.filter(option => !option.disabled && checked.value.includes(option.value))
}
const announcement = ref('')
const sourceLabel = computed(() => props.sourceLabel ?? messages.value.transferSource)
const targetLabel = computed(() => props.targetLabel ?? messages.value.transferTarget)
function transfer(side: TransferSide) {
  if (props.disabled)
    return
  const options = movable(side)
  if (!options.length)
    return
  const moved = options.map(option => option.value)
  update(side === 'source' ? [...values.value, ...moved] : values.value.filter(value => !moved.includes(value)))
  setChecked(checked.value.filter(value => !moved.includes(value)))
  emit('transfer', { direction: side === 'source' ? 'to-target' : 'to-source', items: options.map(option => option.raw), values: moved })
  announcement.value = ''
  void nextTick(() => {
    const destination = side === 'source' ? 'target' : 'source'
    if (moved.every(value => onSide(value, destination))) {
      announcement.value = messages.value.transferItems(moved.length, destination === 'target' ? targetLabel.value : sourceLabel.value)
      panelRefs[destination]?.focus()
    }
  })
}
const theme = useComponentTheme('transferList', transferListTheme)
const ui = computed(() => theme.value({ layout: props.layout }))
const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
const parts = computed(() => Object.fromEntries((Object.keys(transferListTheme.slots) as TransferListThemeSlots[]).map(key => [key, resolveSlot(ui.value[key], props.ui?.[key])])) as Record<TransferListThemeSlots, Record<string, unknown>>)
function resetForm() {
  reset()
  localChecked.value = []
  emit('update:checked', [])
  setQuery('source', '')
  setQuery('target', '')
  announcement.value = ''
}
</script>

<template>
  <div :id="id ?? field?.id" :aria-invalid="invalid || field?.invalid.value || undefined" :aria-describedby="field?.describedBy.value" v-bind="rootProps">
    <template v-for="side in sides" :key="side">
      <div v-bind="parts.panel">
        <div v-bind="parts.header">
          <slot :name="`${side}-header`" :count="panels[side].options.length" :checked-count="panelChecked(side).length">
            <span>{{ side === 'source' ? sourceLabel : targetLabel }}</span>
            <span v-bind="parts.count">{{ messages.listSelectionCount(panelChecked(side).length, panels[side].options.length) }}</span>
          </slot>
        </div>
        <ListboxBase
          :ref="element => { panelRefs[side] = element as InstanceType<typeof ListboxBase> | undefined }"
          :items="panels[side].items"
          :model-value="panelChecked(side)"
          :value-key="valueKey"
          :label-key="labelKey"
          :description-key="descriptionKey"
          :label="side === 'source' ? sourceLabel : targetLabel"
          :search-term="query(side)"
          :select-all="showSelectAll ?? true"
          :searchable="searchable"
          :virtualize="virtualize"
          :disabled="disabled"
          :loading="loading"
          :invalid="invalid || field?.invalid.value"
          :size="size ?? field?.size"
          :color="color"
          :form-field="false"
          multiple checkbox
          v-bind="parts.listbox"
          @update:model-value="updatePanelChecked(side, $event)"
          @update:search-term="setQuery(side, $event)"
        >
          <template v-if="slots.item" #item="data">
            <slot name="item" v-bind="data" :side="side" />
          </template>
          <template v-if="slots.empty" #empty>
            <slot name="empty" :side="side" />
          </template>
          <template v-if="slots['empty-filter']" #empty-filter>
            <slot name="empty-filter" :side="side" />
          </template>
          <template v-if="slots[`${side}-footer`]" #footer>
            <slot :name="`${side}-footer`" />
          </template>
        </ListboxBase>
      </div>
      <div v-if="side === 'source'" v-bind="parts.actions">
        <Button :icon="icons.chevronRight" :aria-label="messages.moveToTarget" :title="messages.moveToTarget" :disabled="disabled || !movable('source').length" :size="size ?? field?.size" :color="color" variant="outline" square v-bind="parts.action" @click="transfer('source')" />
        <Button :icon="icons.chevronLeft" :aria-label="messages.moveToSource" :title="messages.moveToSource" :disabled="disabled || !movable('target').length" :size="size ?? field?.size" :color="color" variant="outline" square v-bind="parts.action" @click="transfer('target')" />
      </div>
    </template>
    <span role="status" aria-live="polite" aria-atomic="true" v-bind="parts.announcement">{{ announcement }}</span>
    <ListSelectionForm :values="values" :name="name ?? field?.name" :form="form" :required="required" :disabled="disabled" @reset="resetForm" />
  </div>
</template>
