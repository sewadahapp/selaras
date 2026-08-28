<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import type { DateRange, SegmentPart } from 'reka-ui'
import type { VariantProps } from 'tailwind-variants'
import type { DatePickerSlots } from '../theme/date-picker'
import type { UiProp } from '../utils/ui'
import { DateFormatter, endOfMonth, endOfYear, getLocalTimeZone, startOfMonth, startOfYear, Time, toCalendarDateTime, today } from '@internationalized/date'
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
  PopoverAnchor,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
  TimeFieldInput,
  TimeFieldRoot,
} from 'reka-ui'
import { computed, ref, useId, watch } from 'vue'
import { useFormField } from '../composables/use-form-field'
import { useIcons } from '../composables/use-icons'
import { useMessages } from '../composables/use-messages'
import TimeStepper from '../internal/TimeStepper.vue'
import { datePickerTheme } from '../theme/date-picker'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import Button from './Button.vue'

type DatePickerVariants = VariantProps<typeof datePickerTheme>

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  id?: string
  name?: string
  /** A single DateValue, Reka's own `{ start?, end? }` DateRange shape when `range` is set, or a bare date-less Time when `timeOnly` is set - Vue props can't express a type that depends on a sibling prop's value, so this stays a plain union documented here rather than enforced by the type checker. */
  modelValue?: DateValue | DateRange | Time
  /** Switches to picking a start+end pair instead of one date - a real fork in which Reka primitive family renders (RangeCalendar/DateRangePicker vs Calendar/DatePicker), not just a different modelValue shape. */
  range?: boolean
  /** Drops the date entirely - just a time-of-day picker. modelValue becomes a bare `Time` (no date component at all, not a DateValue). A third top-level mode alongside `range`; every date-grid-specific prop below (minValue/maxValue/isDateUnavailable/isDateDisabled/numberOfMonths/pagedNavigation/weekStartsOn/weekdayFormat/fixedWeeks/view) is simply inert here. `granularity` still applies ('hour'/'minute' only - defaults to 'minute' for a dedicated time picker). */
  timeOnly?: boolean
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
  /** Which grid the popover shows - 'date' (default), or drill up to 'month'/'year' by clicking the heading. Single-date mode only; range mode's heading stays static. */
  view?: 'date' | 'month' | 'year'
  /** The value's own precision - 'day' (default) keeps picking a full date. 'month'/'year' make picking a month/year the terminal action (day fixed to 1, and month too for 'year') instead of a waypoint to the day grid - the day grid never renders in that case. 'hour'/'minute' add a time-of-day section below the day grid instead (value becomes a time-capable CalendarDateTime, still just a plain DateValue). Single-date mode only. */
  granularity?: 'year' | 'month' | 'day' | 'hour' | 'minute'
  /** hour/minute granularity only - the minute stepper's ±click/arrow-key increment (default 1); typing still commits any exact minute. Pass 5/15/etc for a coarser "pick an appointment time" step. */
  minuteStep?: number
  /** hour/minute granularity only - forces the hour stepper (and the typed field's own hour/dayPeriod segments) to 12-hour or 24-hour. Defaults to whatever `locale` itself resolves to (e.g. 12-hour for en-US, 24-hour for de-DE) - passed straight through to the underlying primitive, which already drives the typed field's own hour cycle. */
  hourCycle?: 12 | 24
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
  granularity: 'day',
  minuteStep: 1,
})

const emit = defineEmits<{
  'update:modelValue': [value: DateValue | DateRange | Time | undefined]
  'update:view': [view: 'date' | 'month' | 'year']
}>()

const field = useFormField()

const datePickerId = computed(() => props.id ?? field?.id)
// Hour/minute granularity only - neither SInputNumber nor SInput forward a
// bare aria-label to their inner <input> (it lands on their outer wrapping
// box instead), so these pair with real sr-only <label for> elements
// instead, the same id-based mechanism FormField's own label already uses.
const hourInputId = useId()
const minuteInputId = useId()
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

// Month/year view drill-down - single-date mode only (see the plan's scope
// note: range mode's heading/prev/next stay Reka's own static ones). Only
// month/year granularity ever skip the day grid entirely (it's genuinely
// unreachable there); hour/minute granularity still needs a day picked
// alongside the time, so 'date' stays the default/deepest view for those.
const defaultView = computed(() => {
  if (props.granularity === 'month' || props.granularity === 'year')
    return props.granularity
  return 'date'
})
const internalView = ref<'date' | 'month' | 'year'>(props.view ?? defaultView.value)
watch(() => props.view, (value) => {
  if (value !== undefined)
    internalView.value = value
})
function setView(value: 'date' | 'month' | 'year') {
  internalView.value = value
  emit('update:view', value)
}
function drillUp() {
  if (internalView.value === 'date')
    setView('month')
  else if (internalView.value === 'month')
    setView('year')
}

const isTimeGranularity = computed(() => props.granularity === 'hour' || props.granularity === 'minute')
// Reka's own segment rendering only shows hour/minute segments when the
// value/placeholder's own runtime type is time-capable ('hour' in date) -
// confirmed by reading DateFieldRoot's source, a granularity prop alone
// does nothing on a plain CalendarDate. This upgrades a value up to
// CalendarDateTime wherever the picker needs one to be time-capable.
function ensureTimeCapable(value: DateValue) {
  return 'hour' in value ? value : toCalendarDateTime(value)
}

// The date library has no month-only/year-only/hour-only value type, so a
// granularity-limited value stays a full DateValue with the parts below its
// own precision fixed to a stable value - applied on every path a value can
// change (typed segments below, a terminal grid click, or a time stepper),
// so e.g. two "month values" that took different entry paths never end up
// with different, meaningless day components and silently fail a
// consumer's own equality/compare check.
function normalizeForGranularity(value: DateValue | undefined) {
  if (!value)
    return value
  if (props.granularity === 'year')
    return value.set({ month: 1, day: 1 })
  if (props.granularity === 'month')
    return value.set({ day: 1 })
  if (isTimeGranularity.value) {
    const timeCapable = ensureTimeCapable(value)
    return timeCapable.set(props.granularity === 'hour' ? { minute: 0, second: 0, millisecond: 0 } : { second: 0, millisecond: 0 })
  }
  return value
}

// Bound via v-model:placeholder on DatePickerRoot - Reka's own documented
// mechanism for programmatically controlling which month the day grid shows
// (confirmed by reading DateFieldRoot's source). Selecting a month/year cell
// jumps this, which Reka's own DatePickerCalendar then renders against.
// Seeded as time-capable up front for hour/minute granularity, so Reka's
// segment rendering picks up hour/minute segments from the very first
// render rather than only after a value is set.
const placeholder = ref<DateValue>((() => {
  const seed = singleModelValue.value ?? today(getLocalTimeZone())
  return isTimeGranularity.value ? ensureTimeCapable(seed) : seed
})())
// Bound via v-model:open, purely so the view resets to 'date' whenever the
// popover closes - reopening into a stale month/year grid would be confusing.
const isOpen = ref(false)
watch(isOpen, (open) => {
  if (!open)
    setView(defaultView.value)
})

const monthFormatter = computed(() => new DateFormatter(props.locale ?? 'en-US', { month: 'short' }))
const monthGridItems = computed(() => Array.from({ length: 12 }, (_, i) => {
  const value = placeholder.value.set({ month: i + 1, day: 1 })
  return { value, label: monthFormatter.value.format(value.toDate(getLocalTimeZone())) }
}))

// A stable, page-aligned 12-year window (not "centered" on the current year)
// so paging by decade always lands on the same boundaries regardless of
// which year within a window you started from.
const yearWindowStart = computed(() => Math.floor(placeholder.value.year / 12) * 12)
const yearGridItems = computed(() => Array.from({ length: 12 }, (_, i) => ({
  value: yearWindowStart.value + i,
  label: String(yearWindowStart.value + i),
})))
const decadeHeadingText = computed(() => `${yearWindowStart.value} – ${yearWindowStart.value + 11}`)

function isMonthDisabled(date: DateValue) {
  if (!props.minValue && !props.maxValue)
    return false
  if (props.maxValue && startOfMonth(date).compare(props.maxValue) > 0)
    return true
  if (props.minValue && endOfMonth(date).compare(props.minValue) < 0)
    return true
  return false
}
function isYearDisabled(year: number) {
  if (!props.minValue && !props.maxValue)
    return false
  const value = placeholder.value.set({ year })
  if (props.maxValue && startOfYear(value).compare(props.maxValue) > 0)
    return true
  if (props.minValue && endOfYear(value).compare(props.minValue) < 0)
    return true
  return false
}

function selectMonth(date: DateValue) {
  placeholder.value = date
  if (props.granularity === 'month') {
    emit('update:modelValue', normalizeForGranularity(date))
    if (props.closeOnSelect)
      isOpen.value = false
    return
  }
  setView('date')
}
function selectYear(year: number) {
  const value = placeholder.value.set({ year })
  placeholder.value = value
  if (props.granularity === 'year') {
    emit('update:modelValue', normalizeForGranularity(value))
    if (props.closeOnSelect)
      isOpen.value = false
    return
  }
  setView('month')
}
function goToPreviousYear() {
  placeholder.value = placeholder.value.subtract({ years: 1 })
}
function goToNextYear() {
  placeholder.value = placeholder.value.add({ years: 1 })
}
function goToPreviousDecade() {
  placeholder.value = placeholder.value.subtract({ years: 12 })
}
function goToNextDecade() {
  placeholder.value = placeholder.value.add({ years: 12 })
}

// placeholder is always time-capable once isTimeGranularity is true (see
// its own seeding above) - the 'hour' in ... guard is only here to satisfy
// placeholder's own broader DateValue type, not a reachable undefined case.
const placeholderHour = computed(() => ('hour' in placeholder.value ? placeholder.value.hour : 0))
const placeholderMinute = computed(() => ('minute' in placeholder.value ? placeholder.value.minute : 0))

// TimeStepper (internal/TimeStepper.vue) owns the 12-hour display/AM-PM
// conversion entirely - it only ever hands back a plain 24-hour number, so
// these just need to write that straight into placeholder. Adjusting the
// time always commits a value (creating one from placeholder's current day
// if none is set yet) - symmetric with how clicking a day already commits
// using whatever time placeholder holds, so either axis can be the first
// thing a consumer touches.
function setHour(hour24: number) {
  const value = ensureTimeCapable(placeholder.value).set({ hour: hour24 })
  placeholder.value = value
  emit('update:modelValue', normalizeForGranularity(value))
}
function setMinute(minute: number) {
  const value = ensureTimeCapable(placeholder.value).set({ minute })
  placeholder.value = value
  emit('update:modelValue', normalizeForGranularity(value))
}

// Time-only mode - a third top-level branch (see the template), not a
// variant of the day-grid branches above. modelValue is a bare, date-less
// Time - none of the placeholder-as-DateValue/ensureTimeCapable machinery
// above applies here, Time has no coarser date fields to upgrade from.
// Only 'hour' narrows to hour-only here; every other value (including the
// 'day' the granularity prop otherwise defaults to) shows hour+minute,
// which reads better as a dedicated time picker's own default than a bare
// hour would.
const timeOnlyGranularity = computed(() => (props.granularity === 'hour' ? 'hour' : 'minute'))
const timeOnlyValue = computed(() => (props.timeOnly ? (props.modelValue as Time | undefined) : undefined))
const timePlaceholder = ref<Time>(timeOnlyValue.value ?? (() => {
  const now = new Date()
  return new Time(now.getHours(), now.getMinutes())
})())
// No Root primitive manages this popover at all (see the template) - its
// open state is entirely local, closed only via the Done button below or
// Popover's own outside-click/Escape handling, same reasoning as the
// date-time-granularity branch: adjusting hour vs minute are still two
// independent things with no single click that means "done."
const timeIsOpen = ref(false)

function normalizeTimeOnly(value: Time) {
  return timeOnlyGranularity.value === 'hour' ? value.set({ minute: 0, second: 0, millisecond: 0 }) : value.set({ second: 0, millisecond: 0 })
}
function setTimeOnlyHour(hour24: number) {
  const value = timePlaceholder.value.set({ hour: hour24 })
  timePlaceholder.value = value
  emit('update:modelValue', normalizeTimeOnly(value))
}
function setTimeOnlyMinute(minute: number) {
  const value = timePlaceholder.value.set({ minute })
  timePlaceholder.value = value
  emit('update:modelValue', normalizeTimeOnly(value))
}

const timeOnlyFormatter = computed(() => new DateFormatter(props.locale ?? 'en-US', props.format ?? (timeOnlyGranularity.value === 'hour' ? { hour: 'numeric' } : { timeStyle: 'short' })))
// Time has no .toDate() - no date component to anchor a timezone
// conversion to - so it's combined with an arbitrary reference date to get
// something DateFormatter/.toDate() can format, reading back out only the
// time portion via the format options above. The documented way to format
// a bare Time.
const formattedTimeValue = computed(() => {
  if (!timeOnlyValue.value)
    return ''
  const asDateTime = toCalendarDateTime(today(getLocalTimeZone()), timeOnlyValue.value)
  return timeOnlyFormatter.value.format(asDateTime.toDate(getLocalTimeZone()))
})

// Reka's own field-segment granularity only spans 'day'|'hour'|'minute'|
// 'second' (confirmed by reading its type) - there's no primitive-level
// "month+year only" segment set to ask for, so the rendered list is
// filtered here instead. A literal separator is only kept when it sits
// between two *kept* segments - dropping one that would otherwise dangle at
// an edge or double up next to a dropped segment, without assuming any
// fixed day/month/year ordering (that varies by locale).
function visibleSegments(segments: { part: SegmentPart, value: string }[]) {
  // Only month/year granularity ever hides segments (day is genuinely
  // meaningless there) - hour/minute granularity adds segments on top of a
  // still-fully-meaningful day/month/year, nothing to filter.
  if (props.granularity === 'day' || isTimeGranularity.value)
    return segments
  const keptParts: SegmentPart[] = props.granularity === 'year' ? ['year'] : ['month', 'year']
  const result: typeof segments = []
  for (const segment of segments) {
    if (segment.part === 'literal') {
      if (result.length && result[result.length - 1].part !== 'literal')
        result.push(segment)
    }
    else if (keptParts.includes(segment.part)) {
      result.push(segment)
    }
  }
  while (result.length && result[result.length - 1].part === 'literal')
    result.pop()
  return result
}

const defaultFormat = computed<Intl.DateTimeFormatOptions>(() => {
  if (props.granularity === 'year')
    return { year: 'numeric' }
  if (props.granularity === 'month')
    return { month: 'long', year: 'numeric' }
  if (props.granularity === 'hour')
    return { dateStyle: 'medium', hour: 'numeric' }
  if (props.granularity === 'minute')
    return { dateStyle: 'medium', timeStyle: 'short' }
  return { dateStyle: 'medium' }
})
const dateFormatter = computed(() => new DateFormatter(props.locale ?? 'en-US', props.format ?? defaultFormat.value))
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
const viewGridProps = computed(() => resolveSlot(ui.value.viewGrid, props.ui?.viewGrid))
const timeSectionProps = computed(() => resolveSlot(ui.value.timeSection, props.ui?.timeSection))

// The button-mode trigger's own look - Input-style ring/bg/hover, but using
// Button's native :focus-visible (already in buttonTheme's own base) rather
// than the field slot's :focus-within, since this is a single focusable
// element, not a box of several. variant="text" color="neutral" contributes
// no bg of its own, so this override's bg/ring/hover classes are the only
// ones in play rather than fighting a second, competing background.
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
// The drill-down heading itself is a plain <button>, not a Button
// composition (see cellTriggerUi's own comment for why these stay inline
// overrides rather than theme slots) - range mode's own DateRangePickerHeading
// stays a non-interactive <span>, so this affordance can't live in the
// shared `heading` theme slot without misleadingly hover-highlighting text
// that isn't clickable there. Disabled at year view (the top of the drill-up
// chain, where a click is a no-op) rather than left clickable-looking with
// nothing to do.
const headingButtonUi = 'rounded-[var(--ui-radius-sm)] px-1.5 py-0.5 transition-colors hover:bg-[var(--ui-bg-elevated)] disabled:hover:bg-transparent disabled:cursor-default'
const cellTriggerUi = {
  base: 'relative data-[today]:font-semibold data-[today]:after:absolute data-[today]:after:bottom-1 data-[today]:after:left-1/2 data-[today]:after:size-1 data-[today]:after:-translate-x-1/2 data-[today]:after:rounded-full data-[today]:after:bg-[var(--ui-primary)] data-[outside-view]:opacity-40 data-[unavailable]:opacity-40 data-[unavailable]:line-through',
}
// Range-mode day cells butt up against each other (see date-picker.ts's own
// `range` cell-padding variant), so this is w-full + squared off by default,
// only rounding the actual start/end anchors - that's what makes a run of
// highlighted/selected days between them read as one connected bar instead
// of separate dots. The template checks both `highlighted` (Reka's live
// hover-preview before the range is complete) and `selected` (true for
// every day strictly between start/end once BOTH are set) - confirmed by
// reading RangeCalendarRoot's own source that `highlightedRange` is
// deliberately nulled out the moment a range is committed (start & end
// both set), so it alone only covers the in-progress state; without also
// checking `selected`, a finished range's connecting bar disappears the
// instant you finish picking it.
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
            variant="text"
            color="neutral"
            :size="iconButtonSize"
            :icon="icons.close"
            :aria-label="messages.clear"
            @click="clear"
          />
          <DateRangePickerTrigger as-child>
            <Button variant="text" color="neutral" :size="iconButtonSize" :icon="icons.calendar" :aria-label="messages.dateRangePicker" />
          </DateRangePickerTrigger>
        </div>
      </div>

      <div v-else class="relative inline-block w-full">
        <DateRangePickerTrigger as-child>
          <Button
            variant="text"
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
          variant="text"
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
                    v-slot="{ dayValue, selectionStart, selectionEnd, highlighted, selected, disabled: dayDisabled }"
                    :day="date"
                    :month="month.value"
                    as-child
                  >
                    <Button
                      :variant="selectionStart || selectionEnd ? 'solid' : (highlighted || selected) ? 'soft' : 'ghost'"
                      :color="selectionStart || selectionEnd || highlighted || selected ? 'primary' : 'neutral'"
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

  <PopoverRoot v-else-if="timeOnly" v-model:open="timeIsOpen">
    <PopoverAnchor as-child>
      <div v-if="triggerMode === 'field'" :aria-invalid="datePickerInvalid || undefined" :aria-describedby="describedBy" v-bind="fieldProps">
        <TimeFieldRoot
          :id="datePickerId"
          v-slot="{ segments }"
          v-model:placeholder="timePlaceholder"
          :model-value="timeOnlyValue"
          :name="name ?? field?.name"
          :locale="locale"
          :hour-cycle="hourCycle"
          :granularity="timeOnlyGranularity"
          :disabled="disabled"
          @update:model-value="(value) => emit('update:modelValue', value ? normalizeTimeOnly(value as Time) : undefined)"
        >
          <template v-for="segment in segments" :key="segment.part">
            <TimeFieldInput as="span" :part="segment.part" v-bind="segmentProps">
              {{ segment.value }}
            </TimeFieldInput>
          </template>
        </TimeFieldRoot>
        <div class="ms-auto flex shrink-0 items-center gap-1">
          <Button
            v-if="clearable && hasValue"
            variant="text"
            color="neutral"
            :size="iconButtonSize"
            :icon="icons.close"
            :aria-label="messages.clear"
            @click="clear"
          />
          <PopoverTrigger as-child>
            <Button variant="text" color="neutral" :size="iconButtonSize" :icon="icons.clock" :aria-label="messages.timePicker" />
          </PopoverTrigger>
        </div>
      </div>

      <div v-else class="relative inline-block w-full">
        <PopoverTrigger as-child>
          <Button
            variant="text"
            color="neutral"
            :size="effectiveSize"
            :trailing-icon="clearable && hasValue ? undefined : icons.clock"
            :aria-invalid="datePickerInvalid || undefined"
            :aria-describedby="describedBy"
            :ui="buttonTriggerUi"
          >
            {{ hasValue ? formattedTimeValue : messages.pickTime }}
          </Button>
        </PopoverTrigger>
        <Button
          v-if="clearable && hasValue"
          variant="text"
          color="neutral"
          :size="iconButtonSize"
          :icon="icons.close"
          :aria-label="messages.clear"
          class="absolute end-1 top-1/2 -translate-y-1/2"
          @click.stop="clear"
        />
      </div>
    </PopoverAnchor>

    <PopoverPortal>
      <PopoverContent :side-offset="6" align="start" v-bind="contentProps">
        <div v-bind="timeSectionProps">
          <label :for="hourInputId" class="sr-only">{{ messages.hour }}</label>
          <label v-if="timeOnlyGranularity === 'minute'" :for="minuteInputId" class="sr-only">{{ messages.minute }}</label>
          <TimeStepper
            :hour="timePlaceholder.hour"
            :minute="timePlaceholder.minute"
            :granularity="timeOnlyGranularity"
            :hour-cycle="hourCycle"
            :minute-step="minuteStep"
            :locale="locale"
            :hour-id="hourInputId"
            :minute-id="minuteInputId"
            @update:hour="setTimeOnlyHour"
            @update:minute="setTimeOnlyMinute"
          />
        </div>
        <Button
          v-if="closeOnSelect"
          variant="solid"
          color="primary"
          size="sm"
          block
          class="mt-2"
          @click="timeIsOpen = false"
        >
          {{ messages.done }}
        </Button>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>

  <DatePickerRoot
    v-else
    :id="datePickerId"
    v-model:placeholder="placeholder"
    v-model:open="isOpen"
    :name="name ?? field?.name"
    :model-value="singleModelValue"
    :min-value="minValue"
    :max-value="maxValue"
    :is-date-unavailable="isDateUnavailable"
    :is-date-disabled="isDateDisabled"
    :locale="locale"
    :hour-cycle="hourCycle"
    :number-of-months="effectiveNumberOfMonths"
    :paged-navigation="pagedNavigation"
    :week-starts-on="weekStartsOn"
    :weekday-format="weekdayFormat"
    :fixed-weeks="fixedWeeks"
    :close-on-select="isTimeGranularity ? false : closeOnSelect"
    :disabled="disabled"
    v-bind="rootProps"
    @update:model-value="(value) => emit('update:modelValue', normalizeForGranularity(value as DateValue | undefined))"
  >
    <DatePickerAnchor as-child>
      <div v-if="triggerMode === 'field'" :aria-invalid="datePickerInvalid || undefined" :aria-describedby="describedBy" v-bind="fieldProps">
        <DatePickerField v-slot="{ segments }">
          <template v-for="(segment, index) in visibleSegments(segments)" :key="`${segment.part}-${index}`">
            <DatePickerInput as="span" :part="segment.part" v-bind="segmentProps">
              {{ segment.value }}
            </DatePickerInput>
          </template>
        </DatePickerField>
        <div class="ms-auto flex shrink-0 items-center gap-1">
          <Button
            v-if="clearable && hasValue"
            variant="text"
            color="neutral"
            :size="iconButtonSize"
            :icon="icons.close"
            :aria-label="messages.clear"
            @click="clear"
          />
          <DatePickerTrigger as-child>
            <Button variant="text" color="neutral" :size="iconButtonSize" :icon="icons.calendar" :aria-label="messages.datePicker" />
          </DatePickerTrigger>
        </div>
      </div>

      <div v-else class="relative inline-block w-full">
        <DatePickerTrigger as-child>
          <Button
            variant="text"
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
          variant="text"
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
          <DatePickerPrev v-if="internalView === 'date'" as-child>
            <Button variant="ghost" color="neutral" size="sm" :icon="icons.chevronLeft" :aria-label="messages.previousMonth" :ui="navButtonUi" />
          </DatePickerPrev>
          <Button
            v-else
            variant="ghost"
            color="neutral"
            size="sm"
            :icon="icons.chevronLeft"
            :aria-label="internalView === 'month' ? messages.previousYear : messages.previousDecade"
            :ui="navButtonUi"
            @click="internalView === 'month' ? goToPreviousYear() : goToPreviousDecade()"
          />

          <DatePickerHeading v-if="internalView === 'date'" v-slot="{ headingValue }">
            <button type="button" :class="headingButtonUi" v-bind="headingProps" :aria-label="messages.chooseMonth" @click="drillUp">
              {{ headingValue }}
            </button>
          </DatePickerHeading>
          <button
            v-else
            type="button"
            dir="ltr"
            :class="headingButtonUi"
            v-bind="headingProps"
            :disabled="internalView === 'year'"
            :aria-label="internalView === 'month' ? messages.chooseYear : undefined"
            @click="drillUp"
          >
            {{ internalView === 'month' ? placeholder.year : decadeHeadingText }}
          </button>

          <DatePickerNext v-if="internalView === 'date'" as-child>
            <Button variant="ghost" color="neutral" size="sm" :icon="icons.chevronRight" :aria-label="messages.nextMonth" :ui="navButtonUi" />
          </DatePickerNext>
          <Button
            v-else
            variant="ghost"
            color="neutral"
            size="sm"
            :icon="icons.chevronRight"
            :aria-label="internalView === 'month' ? messages.nextYear : messages.nextDecade"
            :ui="navButtonUi"
            @click="internalView === 'month' ? goToNextYear() : goToNextDecade()"
          />
        </DatePickerHeader>

        <div v-if="internalView === 'date'" v-bind="gridsProps">
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
                      square
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

        <div v-else-if="internalView === 'month'" v-bind="viewGridProps">
          <Button
            v-for="monthItem in monthGridItems"
            :key="monthItem.value.month"
            :variant="monthItem.value.month === placeholder.month ? 'solid' : 'ghost'"
            :color="monthItem.value.month === placeholder.month ? 'primary' : 'neutral'"
            size="sm"
            :disabled="isMonthDisabled(monthItem.value)"
            @click="selectMonth(monthItem.value)"
          >
            {{ monthItem.label }}
          </Button>
        </div>

        <div v-else v-bind="viewGridProps">
          <Button
            v-for="yearItem in yearGridItems"
            :key="yearItem.value"
            :variant="yearItem.value === placeholder.year ? 'solid' : 'ghost'"
            :color="yearItem.value === placeholder.year ? 'primary' : 'neutral'"
            size="sm"
            :disabled="isYearDisabled(yearItem.value)"
            @click="selectYear(yearItem.value)"
          >
            {{ yearItem.label }}
          </Button>
        </div>

        <template v-if="internalView === 'date' && isTimeGranularity">
          <div v-bind="timeSectionProps">
            <label :for="hourInputId" class="sr-only">{{ messages.hour }}</label>
            <label v-if="granularity === 'minute'" :for="minuteInputId" class="sr-only">{{ messages.minute }}</label>
            <TimeStepper
              :hour="placeholderHour"
              :minute="placeholderMinute"
              :granularity="granularity === 'minute' ? 'minute' : 'hour'"
              :hour-cycle="hourCycle"
              :minute-step="minuteStep"
              :locale="locale"
              :hour-id="hourInputId"
              :minute-id="minuteInputId"
              @update:hour="setHour"
              @update:minute="setMinute"
            />
          </div>
          <Button
            v-if="closeOnSelect"
            variant="solid"
            color="primary"
            size="sm"
            block
            class="mt-2"
            @click="isOpen = false"
          >
            {{ messages.done }}
          </Button>
        </template>
      </DatePickerCalendar>
    </DatePickerContent>
  </DatePickerRoot>
</template>
