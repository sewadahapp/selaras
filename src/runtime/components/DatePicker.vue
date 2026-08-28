<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import type { VariantProps } from 'tailwind-variants'
import type { DatePickerSlots } from '../theme/date-picker'
import type { UiProp } from '../utils/ui'
import { DateFormatter, getLocalTimeZone } from '@internationalized/date'
import {
  DatePickerAnchor,
  DatePickerCalendar,
  DatePickerCell,
  DatePickerCellTrigger,
  DatePickerContent,
  DatePickerField,
  DatePickerGrid,
  DatePickerGridBody,
  DatePickerGridHead,
  DatePickerGridRow,
  DatePickerHeadCell,
  DatePickerHeader,
  DatePickerHeading,
  DatePickerInput,
  DatePickerNext,
  DatePickerPrev,
  DatePickerRoot,
  DatePickerTrigger,
} from 'reka-ui'
import { computed } from 'vue'
import { useFormField } from '../composables/use-form-field'
import { useIcons } from '../composables/use-icons'
import { useMessages } from '../composables/use-messages'
import { datePickerTheme } from '../theme/date-picker'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import Button from './Button.vue'

type DatePickerVariants = VariantProps<typeof datePickerTheme>

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  id?: string
  name?: string
  modelValue?: DateValue
  minValue?: DateValue
  maxValue?: DateValue
  isDateUnavailable?: (date: DateValue) => boolean
  isDateDisabled?: (date: DateValue) => boolean
  locale?: string
  numberOfMonths?: number
  pagedNavigation?: boolean
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  weekdayFormat?: 'narrow' | 'short' | 'long'
  fixedWeeks?: boolean
  /** Closes the popover once a date is picked - unlike Reka's own DatePickerRoot, this defaults true since a single-date picker (no range/multiple selection) has nothing left to do once a date is chosen. */
  closeOnSelect?: boolean
  /** 'field' (default) is the typeable day/month/year segmented input; 'button' is a single button showing the formatted date, matching a plainer "click to open" trigger. */
  triggerMode?: 'field' | 'button'
  /** Only meaningful in triggerMode "button" - the segmented field's own per-segment display is already locale-shaped by Reka's own DateFieldInput. Default: `{ dateStyle: 'medium' }`. */
  format?: Intl.DateTimeFormatOptions
  disabled?: boolean
  invalid?: boolean
  clearable?: boolean
  size?: DatePickerVariants['size']
  ui?: UiProp<DatePickerSlots>
}>(), {
  closeOnSelect: true,
  triggerMode: 'field',
})

const emit = defineEmits<{
  'update:modelValue': [value: DateValue | undefined]
}>()

const field = useFormField()

const datePickerId = computed(() => props.id ?? field?.id)
const datePickerInvalid = computed(() => props.invalid || (field?.invalid.value ?? false))
const describedBy = computed(() => field?.describedBy.value)
const effectiveSize = computed(() => props.size ?? field?.size ?? 'md')
// One step down from the field itself - matches Input's own clear-button
// sizing (see Input.vue's clearSize) so an icon button doesn't read as
// oversized crammed next to the date segments.
const iconButtonSize = computed(() => ({ sm: 'sm', md: 'sm', lg: 'md' } as const)[effectiveSize.value])

const dateFormatter = computed(() => new DateFormatter(props.locale ?? 'en-US', props.format ?? { dateStyle: 'medium' }))
const formattedValue = computed(() => props.modelValue ? dateFormatter.value.format(props.modelValue.toDate(getLocalTimeZone())) : '')

const icons = useIcons()
const messages = useMessages()
const theme = useComponentTheme('datePicker', datePickerTheme)
const ui = computed(() => theme.value({ size: effectiveSize.value, invalid: datePickerInvalid.value }))

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
const fieldProps = computed(() => resolveSlot(ui.value.field, props.ui?.field))
const segmentProps = computed(() => resolveSlot(ui.value.segment, props.ui?.segment))
const contentProps = computed(() => resolveSlot(ui.value.content, props.ui?.content))
const headerProps = computed(() => resolveSlot(ui.value.header, props.ui?.header))
const headingProps = computed(() => resolveSlot(ui.value.heading, props.ui?.heading))
const gridProps = computed(() => resolveSlot(ui.value.grid, props.ui?.grid))
const gridHeadProps = computed(() => resolveSlot(ui.value.gridHead, props.ui?.gridHead))
const headCellProps = computed(() => resolveSlot(ui.value.headCell, props.ui?.headCell))
const cellProps = computed(() => resolveSlot(ui.value.cell, props.ui?.cell))

// The button-mode trigger's own look - Input-style ring/bg/hover, but using
// Button's native :focus-visible (already in buttonTheme's own base) rather
// than the field slot's :focus-within, since this is a single focusable
// element, not a box of several. variant="ghost" color="neutral" supplies
// just text/hover-bg on top, so this override composes rather than fights it.
const buttonTriggerUi = computed(() => ({
  base: [
    'w-full justify-start rounded-[var(--ui-radius-md)] bg-[var(--ui-bg)] text-[var(--ui-text)] ring-1 ring-inset ring-[var(--ui-border)] hover:ring-[var(--ui-border-hover)] hover:bg-[var(--ui-bg-elevated)]',
    datePickerInvalid.value ? 'ring-[var(--ui-danger)] hover:ring-[var(--ui-danger)]' : undefined,
    // Room for the clear button, which sits absolutely positioned on top of
    // this same end edge - without it, a long formatted date can run under it.
    props.clearable && props.modelValue ? 'pe-8' : undefined,
  ].filter(Boolean).join(' '),
}))

// These four are plain :ui overrides on a nested Button, not independent
// theme slots - Button already owns variant/size/hover/focus, matching how
// Pagination's own Prev/Next/page buttons are styled (see pagination.ts vs
// Pagination.vue's mirroredIconUi). rtl:-scale-x-100 mirrors the chevron
// under RTL - same simple transform Pagination's Prev/Next use, no compound
// rotate state needed here either.
const navButtonUi = { leadingIcon: 'rtl:-scale-x-100' }
const cellTriggerUi = {
  base: 'relative data-[today]:font-semibold data-[today]:after:absolute data-[today]:after:bottom-1 data-[today]:after:left-1/2 data-[today]:after:size-1 data-[today]:after:-translate-x-1/2 data-[today]:after:rounded-full data-[today]:after:bg-[var(--ui-primary)] data-[outside-view]:opacity-40 data-[unavailable]:opacity-40 data-[unavailable]:line-through',
}
</script>

<template>
  <DatePickerRoot
    :id="datePickerId"
    :name="name ?? field?.name"
    :model-value="modelValue"
    :min-value="minValue"
    :max-value="maxValue"
    :is-date-unavailable="isDateUnavailable"
    :is-date-disabled="isDateDisabled"
    :locale="locale"
    :number-of-months="numberOfMonths"
    :paged-navigation="pagedNavigation"
    :week-starts-on="weekStartsOn"
    :weekday-format="weekdayFormat"
    :fixed-weeks="fixedWeeks"
    :close-on-select="closeOnSelect"
    :disabled="disabled"
    v-bind="rootProps"
    @update:model-value="(value) => emit('update:modelValue', value)"
  >
    <DatePickerAnchor as-child>
      <div v-if="triggerMode === 'field'" :aria-invalid="datePickerInvalid || undefined" :aria-describedby="describedBy" v-bind="fieldProps">
        <DatePickerField v-slot="{ segments }">
          <template v-for="segment in segments" :key="segment.part">
            <DatePickerInput as="span" :part="segment.part" v-bind="segmentProps">
              {{ segment.value }}
            </DatePickerInput>
          </template>
        </DatePickerField>
        <Button
          v-if="clearable && modelValue"
          variant="ghost"
          color="neutral"
          :size="iconButtonSize"
          :icon="icons.close"
          :aria-label="messages.clear"
          @click="emit('update:modelValue', undefined)"
        />
        <DatePickerTrigger as-child>
          <Button variant="ghost" color="neutral" :size="iconButtonSize" :icon="icons.calendar" :aria-label="messages.datePicker" />
        </DatePickerTrigger>
      </div>

      <div v-else class="relative inline-block w-full">
        <DatePickerTrigger as-child>
          <Button
            variant="ghost"
            color="neutral"
            :size="effectiveSize"
            :icon="icons.calendar"
            :aria-invalid="datePickerInvalid || undefined"
            :aria-describedby="describedBy"
            :ui="buttonTriggerUi"
          >
            {{ modelValue ? formattedValue : messages.pickDate }}
          </Button>
        </DatePickerTrigger>
        <Button
          v-if="clearable && modelValue"
          variant="ghost"
          color="neutral"
          :size="iconButtonSize"
          :icon="icons.close"
          :aria-label="messages.clear"
          class="absolute end-1 top-1/2 -translate-y-1/2"
          @click.stop="emit('update:modelValue', undefined)"
        />
      </div>
    </DatePickerAnchor>

    <DatePickerContent :side-offset="6" align="start" v-bind="contentProps">
      <DatePickerCalendar v-slot="{ grid, weekDays }">
        <DatePickerHeader v-bind="headerProps">
          <DatePickerPrev as-child>
            <Button variant="ghost" color="neutral" size="sm" :icon="icons.chevronLeft" :aria-label="messages.previousMonth" :ui="navButtonUi" />
          </DatePickerPrev>
          <DatePickerHeading v-bind="headingProps" />
          <DatePickerNext as-child>
            <Button variant="ghost" color="neutral" size="sm" :icon="icons.chevronRight" :aria-label="messages.nextMonth" :ui="navButtonUi" />
          </DatePickerNext>
        </DatePickerHeader>

        <DatePickerGrid v-for="month in grid" :key="month.value.toString()" v-bind="gridProps">
          <DatePickerGridHead v-bind="gridHeadProps">
            <DatePickerGridRow>
              <DatePickerHeadCell v-for="day in weekDays" :key="day" v-bind="headCellProps">
                {{ day }}
              </DatePickerHeadCell>
            </DatePickerGridRow>
          </DatePickerGridHead>
          <DatePickerGridBody>
            <DatePickerGridRow v-for="(week, weekIndex) in month.rows" :key="weekIndex">
              <DatePickerCell v-for="date in week" :key="date.toString()" :date="date" v-bind="cellProps">
                <DatePickerCellTrigger
                  v-slot="{ dayValue, selected, disabled: dayDisabled }"
                  :day="date"
                  :month="month.value"
                  as-child
                >
                  <Button
                    :variant="selected ? 'solid' : 'ghost'"
                    :color="selected ? 'primary' : 'neutral'"
                    size="sm"
                    :disabled="dayDisabled"
                    :ui="cellTriggerUi"
                  >
                    {{ dayValue }}
                  </Button>
                </DatePickerCellTrigger>
              </DatePickerCell>
            </DatePickerGridRow>
          </DatePickerGridBody>
        </DatePickerGrid>
      </DatePickerCalendar>
    </DatePickerContent>
  </DatePickerRoot>
</template>
