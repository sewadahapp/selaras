<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import type { DateRange } from 'reka-ui'
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
  DateRangePickerAnchor,
  DateRangePickerCalendar,
  DateRangePickerCell,
  DateRangePickerCellTrigger,
  DateRangePickerContent,
  DateRangePickerField,
  DateRangePickerGrid,
  DateRangePickerGridBody,
  DateRangePickerGridHead,
  DateRangePickerGridRow,
  DateRangePickerHeadCell,
  DateRangePickerHeader,
  DateRangePickerHeading,
  DateRangePickerInput,
  DateRangePickerNext,
  DateRangePickerPrev,
  DateRangePickerRoot,
  DateRangePickerTrigger,
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
  /** A single DateValue, or Reka's own `{ start?, end? }` DateRange shape when `range` is set - Vue props can't express a type that depends on a sibling prop's value, so this stays a plain union documented here rather than enforced by the type checker. */
  modelValue?: DateValue | DateRange
  /** Switches to picking a start+end pair instead of one date - a real fork in which Reka primitive family renders (RangeCalendar/DateRangePicker vs Calendar/DatePicker), not just a different modelValue shape. */
  range?: boolean
  minValue?: DateValue
  maxValue?: DateValue
  isDateUnavailable?: (date: DateValue) => boolean
  isDateDisabled?: (date: DateValue) => boolean
  /** Range mode only - highlights a date without marking it unavailable or disabled. */
  isDateHighlightable?: (date: DateValue) => boolean
  locale?: string
  /** Default 1 normally, 2 when `range` is set (overridable either way) - see effectiveNumberOfMonths. */
  numberOfMonths?: number
  pagedNavigation?: boolean
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  weekdayFormat?: 'narrow' | 'short' | 'long'
  fixedWeeks?: boolean
  /** Closes the popover once a selection is complete - unlike Reka's own Root components, this defaults true. In range mode "complete" means both start and end are set (Reka's own internal watcher already gates on that), so picking just a start date correctly leaves the popover open. */
  closeOnSelect?: boolean
  /** 'field' (default) is the typeable day/month/year segmented input; 'button' is a single button showing the formatted date, matching a plainer "click to open" trigger. */
  triggerMode?: 'field' | 'button'
  /** Only meaningful in triggerMode "button" - the segmented field's own per-segment display is already locale-shaped by Reka's own DateFieldInput. Default: `{ dateStyle: 'medium' }`. */
  format?: Intl.DateTimeFormatOptions
  /** Range mode only - lets the two ends of a range land in different, non-adjacent selections. */
  allowNonContiguousRanges?: boolean
  /** Range mode only - locks one end of the range in place while re-picking the other. */
  fixedDate?: 'start' | 'end'
  /** Range mode only - caps how many days can separate start and end. */
  maximumDays?: number
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
  'update:modelValue': [value: DateValue | DateRange | undefined]
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
// Reka itself always defaults to 1 - a range picker reads far better with
// two months side by side (matches common range-picker convention) so this
// component's own default becomes 2 once range is on, still overridable
// back down to 1 by passing numberOfMonths explicitly either way.
const effectiveNumberOfMonths = computed(() => props.numberOfMonths ?? (props.range ? 2 : 1))

// Narrowed per branch so each Root gets exactly the type it declares -
// vue-tsc doesn't narrow a bare union prop across a v-if/v-else split the
// way TS narrows a local variable, so this does it explicitly instead of
// scattering `as` casts through the template.
const singleModelValue = computed(() => (props.range ? undefined : (props.modelValue as DateValue | undefined)))
// Left as genuine `undefined` (not defaulted to an empty {start,end} object)
// when the consumer hasn't passed one - Reka's own useVModel only treats a
// Root as uncontrolled when its modelValue prop is literally undefined; an
// always-present object here would silently force controlled mode even for
// a consumer using `range` with no v-model at all, and internal selection
// would never visibly progress since nothing ever feeds the change back in.
const rangeModelValue = computed(() => (props.range ? (props.modelValue as DateRange | undefined) : undefined))
const hasValue = computed(() => props.range ? !!(props.modelValue as DateRange | undefined)?.start : !!props.modelValue)

function clear() {
  emit('update:modelValue', props.range ? { start: undefined, end: undefined } : undefined)
}

const dateFormatter = computed(() => new DateFormatter(props.locale ?? 'en-US', props.format ?? { dateStyle: 'medium' }))
const formattedValue = computed(() => {
  if (props.range) {
    const range = props.modelValue as DateRange | undefined
    if (!range?.start)
      return ''
    const startDate = range.start.toDate(getLocalTimeZone())
    return range.end
      ? dateFormatter.value.formatRange(startDate, range.end.toDate(getLocalTimeZone()))
      : dateFormatter.value.format(startDate)
  }
  const value = props.modelValue as DateValue | undefined
  return value ? dateFormatter.value.format(value.toDate(getLocalTimeZone())) : ''
})

const icons = useIcons()
const messages = useMessages()
const theme = useComponentTheme('datePicker', datePickerTheme)
const ui = computed(() => theme.value({ size: effectiveSize.value, invalid: datePickerInvalid.value, range: props.range }))

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
const fieldProps = computed(() => resolveSlot(ui.value.field, props.ui?.field))
const segmentProps = computed(() => resolveSlot(ui.value.segment, props.ui?.segment))
const separatorProps = computed(() => resolveSlot(ui.value.separator, props.ui?.separator))
const contentProps = computed(() => resolveSlot(ui.value.content, props.ui?.content))
const headerProps = computed(() => resolveSlot(ui.value.header, props.ui?.header))
const headingProps = computed(() => resolveSlot(ui.value.heading, props.ui?.heading))
const gridsProps = computed(() => resolveSlot(ui.value.grids, props.ui?.grids))
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
    props.clearable && hasValue.value ? 'pe-8' : undefined,
  ].filter(Boolean).join(' '),
  // base is justify-start (text left-aligned, not centered) so the button
  // reads naturally for a short date string - without its own auto margin,
  // the trailing icon would just sit right after that short text instead of
  // pinned to the button's own far edge, the same "select control" look the
  // field-mode trigger group also needs (see the ms-auto wrapper above).
  trailingIcon: 'ms-auto',
}))

// These are plain :ui overrides on a nested Button, not independent theme
// slots - Button already owns variant/size/hover/focus, matching how
// Pagination's own Prev/Next/page buttons are styled (see pagination.ts vs
// Pagination.vue's mirroredIconUi). rtl:-scale-x-100 mirrors the chevron
// under RTL - same simple transform Pagination's Prev/Next use, no compound
// rotate state needed here either.
const navButtonUi = { leadingIcon: 'rtl:-scale-x-100' }
const cellTriggerUi = {
  base: 'relative data-[today]:font-semibold data-[today]:after:absolute data-[today]:after:bottom-1 data-[today]:after:left-1/2 data-[today]:after:size-1 data-[today]:after:-translate-x-1/2 data-[today]:after:rounded-full data-[today]:after:bg-[var(--ui-primary)] data-[outside-view]:opacity-40 data-[unavailable]:opacity-40 data-[unavailable]:line-through',
}
// Range-mode day cells butt up against each other (see date-picker.ts's own
// `range` cell-padding variant), so this is w-full + squared off by default,
// only rounding the actual start/end anchors - that's what makes a run of
// highlighted days between them read as one connected bar instead of
// separate dots.
const rangeCellTriggerUi = {
  base: 'relative w-full rounded-none data-[selection-start]:rounded-s-full data-[selection-end]:rounded-e-full data-[today]:font-semibold data-[today]:after:absolute data-[today]:after:bottom-1 data-[today]:after:left-1/2 data-[today]:after:size-1 data-[today]:after:-translate-x-1/2 data-[today]:after:rounded-full data-[today]:after:bg-[var(--ui-primary)] data-[outside-view]:opacity-40 data-[unavailable]:opacity-40 data-[unavailable]:line-through',
}
</script>

<template>
  <DateRangePickerRoot
    v-if="range"
    :id="datePickerId"
    :name="name ?? field?.name"
    :model-value="rangeModelValue"
    :min-value="minValue"
    :max-value="maxValue"
    :is-date-unavailable="isDateUnavailable"
    :is-date-disabled="isDateDisabled"
    :is-date-highlightable="isDateHighlightable"
    :locale="locale"
    :number-of-months="effectiveNumberOfMonths"
    :paged-navigation="pagedNavigation"
    :week-starts-on="weekStartsOn"
    :weekday-format="weekdayFormat"
    :fixed-weeks="fixedWeeks"
    :close-on-select="closeOnSelect"
    :allow-non-contiguous-ranges="allowNonContiguousRanges"
    :fixed-date="fixedDate"
    :maximum-days="maximumDays"
    :disabled="disabled"
    v-bind="rootProps"
    @update:model-value="(value) => emit('update:modelValue', value)"
  >
    <DateRangePickerAnchor as-child>
      <div v-if="triggerMode === 'field'" :aria-invalid="datePickerInvalid || undefined" :aria-describedby="describedBy" v-bind="fieldProps">
        <DateRangePickerField v-slot="{ segments }">
          <template v-for="segment in segments.start" :key="`start-${segment.part}`">
            <DateRangePickerInput as="span" type="start" :part="segment.part" v-bind="segmentProps">
              {{ segment.value }}
            </DateRangePickerInput>
          </template>
          <span v-bind="separatorProps">&ndash;</span>
          <template v-for="segment in segments.end" :key="`end-${segment.part}`">
            <DateRangePickerInput as="span" type="end" :part="segment.part" v-bind="segmentProps">
              {{ segment.value }}
            </DateRangePickerInput>
          </template>
        </DateRangePickerField>
        <div class="ms-auto flex shrink-0 items-center gap-1">
          <Button
            v-if="clearable && hasValue"
            variant="ghost"
            color="neutral"
            :size="iconButtonSize"
            :icon="icons.close"
            :aria-label="messages.clear"
            @click="clear"
          />
          <DateRangePickerTrigger as-child>
            <Button variant="ghost" color="neutral" :size="iconButtonSize" :icon="icons.calendar" :aria-label="messages.dateRangePicker" />
          </DateRangePickerTrigger>
        </div>
      </div>

      <div v-else class="relative inline-block w-full">
        <DateRangePickerTrigger as-child>
          <Button
            variant="ghost"
            color="neutral"
            :size="effectiveSize"
            :trailing-icon="clearable && hasValue ? undefined : icons.calendar"
            :aria-invalid="datePickerInvalid || undefined"
            :aria-describedby="describedBy"
            :ui="buttonTriggerUi"
          >
            {{ hasValue ? formattedValue : messages.pickDate }}
          </Button>
        </DateRangePickerTrigger>
        <Button
          v-if="clearable && hasValue"
          variant="ghost"
          color="neutral"
          :size="iconButtonSize"
          :icon="icons.close"
          :aria-label="messages.clear"
          class="absolute end-1 top-1/2 -translate-y-1/2"
          @click.stop="clear"
        />
      </div>
    </DateRangePickerAnchor>

    <DateRangePickerContent :side-offset="6" align="start" v-bind="contentProps">
      <DateRangePickerCalendar v-slot="{ grid, weekDays }">
        <DateRangePickerHeader v-bind="headerProps">
          <DateRangePickerPrev as-child>
            <Button variant="ghost" color="neutral" size="sm" :icon="icons.chevronLeft" :aria-label="messages.previousMonth" :ui="navButtonUi" />
          </DateRangePickerPrev>
          <DateRangePickerHeading v-bind="headingProps" />
          <DateRangePickerNext as-child>
            <Button variant="ghost" color="neutral" size="sm" :icon="icons.chevronRight" :aria-label="messages.nextMonth" :ui="navButtonUi" />
          </DateRangePickerNext>
        </DateRangePickerHeader>

        <div v-bind="gridsProps">
          <DateRangePickerGrid v-for="month in grid" :key="month.value.toString()" v-bind="gridProps">
            <DateRangePickerGridHead v-bind="gridHeadProps">
              <DateRangePickerGridRow>
                <DateRangePickerHeadCell v-for="day in weekDays" :key="day" v-bind="headCellProps">
                  {{ day }}
                </DateRangePickerHeadCell>
              </DateRangePickerGridRow>
            </DateRangePickerGridHead>
            <DateRangePickerGridBody>
              <DateRangePickerGridRow v-for="(week, weekIndex) in month.rows" :key="weekIndex">
                <DateRangePickerCell v-for="date in week" :key="date.toString()" :date="date" v-bind="cellProps">
                  <DateRangePickerCellTrigger
                    v-slot="{ dayValue, selectionStart, selectionEnd, highlighted, disabled: dayDisabled }"
                    :day="date"
                    :month="month.value"
                    as-child
                  >
                    <Button
                      :variant="selectionStart || selectionEnd ? 'solid' : highlighted ? 'soft' : 'ghost'"
                      :color="selectionStart || selectionEnd || highlighted ? 'primary' : 'neutral'"
                      size="sm"
                      :disabled="dayDisabled"
                      :ui="rangeCellTriggerUi"
                    >
                      {{ dayValue }}
                    </Button>
                  </DateRangePickerCellTrigger>
                </DateRangePickerCell>
              </DateRangePickerGridRow>
            </DateRangePickerGridBody>
          </DateRangePickerGrid>
        </div>
      </DateRangePickerCalendar>
    </DateRangePickerContent>
  </DateRangePickerRoot>

  <DatePickerRoot
    v-else
    :id="datePickerId"
    :name="name ?? field?.name"
    :model-value="singleModelValue"
    :min-value="minValue"
    :max-value="maxValue"
    :is-date-unavailable="isDateUnavailable"
    :is-date-disabled="isDateDisabled"
    :locale="locale"
    :number-of-months="effectiveNumberOfMonths"
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
        <div class="ms-auto flex shrink-0 items-center gap-1">
          <Button
            v-if="clearable && hasValue"
            variant="ghost"
            color="neutral"
            :size="iconButtonSize"
            :icon="icons.close"
            :aria-label="messages.clear"
            @click="clear"
          />
          <DatePickerTrigger as-child>
            <Button variant="ghost" color="neutral" :size="iconButtonSize" :icon="icons.calendar" :aria-label="messages.datePicker" />
          </DatePickerTrigger>
        </div>
      </div>

      <div v-else class="relative inline-block w-full">
        <DatePickerTrigger as-child>
          <Button
            variant="ghost"
            color="neutral"
            :size="effectiveSize"
            :trailing-icon="clearable && hasValue ? undefined : icons.calendar"
            :aria-invalid="datePickerInvalid || undefined"
            :aria-describedby="describedBy"
            :ui="buttonTriggerUi"
          >
            {{ hasValue ? formattedValue : messages.pickDate }}
          </Button>
        </DatePickerTrigger>
        <Button
          v-if="clearable && hasValue"
          variant="ghost"
          color="neutral"
          :size="iconButtonSize"
          :icon="icons.close"
          :aria-label="messages.clear"
          class="absolute end-1 top-1/2 -translate-y-1/2"
          @click.stop="clear"
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

        <div v-bind="gridsProps">
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
        </div>
      </DatePickerCalendar>
    </DatePickerContent>
  </DatePickerRoot>
</template>
