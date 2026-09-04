<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import type { DateRange, SegmentPart } from 'reka-ui'
import type { VariantProps } from 'tailwind-variants'
import type { buttonTheme } from '../theme/button'
import type { DatePickerThemeSlots } from '../theme/date-picker'
import type { UiProp } from '../utils/ui'
import { DateFormatter, endOfMonth, endOfYear, getLocalTimeZone, startOfMonth, startOfYear, Time, toCalendarDateTime, today } from '@internationalized/date'
import {
  DatePickerAnchor,
  DatePickerArrow,
  DatePickerContent,
  DatePickerField,
  DatePickerInput,
  DatePickerRoot,
  DatePickerTrigger,
  DateRangePickerAnchor,
  DateRangePickerArrow,
  DateRangePickerContent,
  DateRangePickerField,
  DateRangePickerInput,
  DateRangePickerRoot,
  DateRangePickerTrigger,
  DialogTitle,
  PopoverAnchor,
  PopoverArrow,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
  TimeFieldInput,
  TimeFieldRoot,
} from 'reka-ui'
import { computed, ref, shallowRef, useId, watch } from 'vue'
import { useFormField } from '../composables/use-form-field'
import { useIcons } from '../composables/use-icons'
import { useIsMobile } from '../composables/use-media-query'
import { useMessages } from '../composables/use-messages'
import DatePickerCalendarBody from '../internal/DatePickerCalendarBody.vue'
import DatePickerRangeCalendarBody from '../internal/DatePickerRangeCalendarBody.vue'
import DatePickerTimeBody from '../internal/DatePickerTimeBody.vue'
import { datePickerTheme } from '../theme/date-picker'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import Button from './Button.vue'
import Icon from './Icon.vue'
import Modal from './Modal.vue'

type DatePickerVariants = VariantProps<typeof datePickerTheme>
type ButtonVariants = VariantProps<typeof buttonTheme>

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<DatePickerProps>(), {
  closeOnSelect: true,
  triggerMode: 'field',
  granularity: 'day',
  color: 'neutral',
  activeColor: 'primary',
  minuteStep: 1,
  arrow: false,
})

const emit = defineEmits<DatePickerEmits>()

export interface DatePickerProps {
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
  /** Shows the value and blocks edits without disabling the control - unlike `disabled`, it stays focusable/readable, just not changeable. Not applicable to `timeOnly` (Reka's own TimeField has no readonly concept). */
  readonly?: boolean
  /** Stops a click on the only selected day from deselecting it - not applicable to `timeOnly` (there's no calendar day to click). */
  preventDeselect?: boolean
  /** `view="month"` only - disables a specific month in addition to whatever minValue/maxValue already disable (doesn't replace that check). */
  isMonthDisabled?: (date: DateValue) => boolean
  /** `view="year"` only - disables a specific year in addition to whatever minValue/maxValue already disable (doesn't replace that check). */
  isYearDisabled?: (year: number) => boolean
  invalid?: boolean
  clearable?: boolean
  /** Chrome color - the clear/trigger buttons and prev/next month nav. Only the color changes; each button keeps its own deliberately-different variant (icon-only buttons use `text`, nav arrows use `ghost`). */
  color?: ButtonVariants['color']
  /** The color of whatever's currently "active" - the selected day/month/year cell and the Done button. */
  activeColor?: ButtonVariants['color']
  size?: DatePickerVariants['size']
  /** Shows a small pointer triangle connecting the panel to its trigger. */
  arrow?: boolean
  /** Below 768px viewport width, presents the calendar as a centered Modal instead of a small anchored panel - easier to tap with a finger. Opt-in (defaults `false`) rather than automatic, so an existing usage's look never changes without asking for it. */
  mobileModal?: boolean
  ui?: UiProp<DatePickerThemeSlots>
}

export interface DatePickerEmits {
  'update:modelValue': [value: DateValue | DateRange | Time | undefined]
  'update:view': [view: 'date' | 'month' | 'year']
}

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
// shallowRef, not ref - DateValue is always replaced wholesale (every write
// below is `placeholder.value = <new instance>`, never a mutation of an
// existing one), and a plain ref's UnwrapRef mapped type strips the private
// fields these date classes carry, so passing `placeholder.value` back into
// a function/prop typed as DateValue fails type-checking even though the
// runtime value is completely correct. shallowRef's type keeps the original
// class untouched, matching how the value is actually used.
const placeholder = shallowRef<DateValue>((() => {
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

// Range mode's own popover was fully uncontrolled until now (no
// mobileModal to also drive) - introduced only for that, but harmless
// either way since it behaves identically to the old uncontrolled mode
// when nothing else observes it.
const isRangeOpen = ref(false)

const isMobile = useIsMobile()
const showMobileModal = computed(() => props.mobileModal && isMobile.value)
// Overrides Modal's own default rounded-lg down to rounded-md, matching
// every other floating panel here (the desktop popover's own `content`
// slot, shared by all three branches, is already rounded-md) - rounded-lg
// reads noticeably heavier/rounder than the desktop equivalent for what's
// otherwise the same surface. Same fix, same reasoning, as
// ComboboxSelectBase.vue's own identical override.
const mobileModalUi = { content: 'rounded-[var(--ui-radius-md)]' }

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

function isMonthDisabledByRange(date: DateValue) {
  if (!props.minValue && !props.maxValue)
    return false
  if (props.maxValue && startOfMonth(date).compare(props.maxValue) > 0)
    return true
  if (props.minValue && endOfMonth(date).compare(props.minValue) < 0)
    return true
  return false
}
function isYearDisabledByRange(year: number) {
  if (!props.minValue && !props.maxValue)
    return false
  const value = placeholder.value.set({ year })
  if (props.maxValue && startOfYear(value).compare(props.maxValue) > 0)
    return true
  if (props.minValue && endOfYear(value).compare(props.minValue) < 0)
    return true
  return false
}
// A custom isMonthDisabled/isYearDisabled disables *more* dates than the
// range check would, not instead of it - same additive relationship
// isDateDisabled/isDateUnavailable already have with each other elsewhere
// in this component.
function isMonthDisabled(date: DateValue) {
  return isMonthDisabledByRange(date) || (props.isMonthDisabled?.(date) ?? false)
}
function isYearDisabled(year: number) {
  return isYearDisabledByRange(year) || (props.isYearDisabled?.(year) ?? false)
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
// shallowRef, not ref - same reasoning as `placeholder` above (Time is
// replaced wholesale, and a plain ref's type would strip its private fields).
const timePlaceholder = shallowRef<Time>(timeOnlyValue.value ?? (() => {
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
      // The length check already guarantees this index is in bounds - TS
      // can't correlate the two on its own.
      if (result.length && result[result.length - 1]!.part !== 'literal')
        result.push(segment)
    }
    else if (keptParts.includes(segment.part)) {
      result.push(segment)
    }
  }
  while (result.length && result[result.length - 1]!.part === 'literal')
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
const arrowProps = computed(() => resolveSlot(ui.value.arrow, props.ui?.arrow))
const headerProps = computed(() => resolveSlot(ui.value.header, props.ui?.header))
const headingProps = computed(() => resolveSlot(ui.value.heading, props.ui?.heading))
const gridsProps = computed(() => resolveSlot(ui.value.grids, props.ui?.grids))
const gridProps = computed(() => resolveSlot(ui.value.grid, props.ui?.grid))
const gridHeadProps = computed(() => resolveSlot(ui.value.gridHead, props.ui?.gridHead))
const headCellProps = computed(() => resolveSlot(ui.value.headCell, props.ui?.headCell))
const cellProps = computed(() => resolveSlot(ui.value.cell, props.ui?.cell))
const viewGridProps = computed(() => resolveSlot(ui.value.viewGrid, props.ui?.viewGrid))
const timeSectionProps = computed(() => resolveSlot(ui.value.timeSection, props.ui?.timeSection))
const mobileContentProps = computed(() => resolveSlot(ui.value.mobileContent, props.ui?.mobileContent))

// Single source of truth for each extracted body component's own (large)
// prop surface, so the desktop and mobileModal template branches below
// each just `v-bind` this instead of repeating every prop twice - same
// reasoning as ComboboxSelectBase.vue's own bodyProps.
const rangeBodyProps = computed(() => ({
  color: props.color,
  activeColor: props.activeColor,
  headerProps: headerProps.value,
  headingProps: headingProps.value,
  gridsProps: gridsProps.value,
  gridProps: gridProps.value,
  gridHeadProps: gridHeadProps.value,
  headCellProps: headCellProps.value,
  cellProps: cellProps.value,
}))

const calendarBodyProps = computed(() => ({
  internalView: internalView.value,
  color: props.color,
  activeColor: props.activeColor,
  placeholder: placeholder.value,
  monthGridItems: monthGridItems.value,
  yearGridItems: yearGridItems.value,
  decadeHeadingText: decadeHeadingText.value,
  isMonthDisabled,
  isYearDisabled,
  selectMonth,
  selectYear,
  drillUp,
  goToPreviousYear,
  goToNextYear,
  goToPreviousDecade,
  goToNextDecade,
  isTimeGranularity: isTimeGranularity.value,
  granularity: props.granularity,
  placeholderHour: placeholderHour.value,
  placeholderMinute: placeholderMinute.value,
  hourCycle: props.hourCycle,
  minuteStep: props.minuteStep,
  locale: props.locale,
  hourInputId,
  minuteInputId,
  setHour,
  setMinute,
  closeOnSelect: props.closeOnSelect,
  close: () => { isOpen.value = false },
  headerProps: headerProps.value,
  headingProps: headingProps.value,
  gridsProps: gridsProps.value,
  gridProps: gridProps.value,
  gridHeadProps: gridHeadProps.value,
  headCellProps: headCellProps.value,
  cellProps: cellProps.value,
  viewGridProps: viewGridProps.value,
  timeSectionProps: timeSectionProps.value,
}))

const timeBodyProps = computed(() => ({
  hour: timePlaceholder.value.hour,
  minute: timePlaceholder.value.minute,
  granularity: timeOnlyGranularity.value,
  hourCycle: props.hourCycle,
  minuteStep: props.minuteStep,
  locale: props.locale,
  hourInputId,
  minuteInputId,
  setHour: setTimeOnlyHour,
  setMinute: setTimeOnlyMinute,
  closeOnSelect: props.closeOnSelect,
  activeColor: props.activeColor,
  close: () => { timeIsOpen.value = false },
  timeSectionProps: timeSectionProps.value,
}))

// The button-mode trigger's own look - Input-style ring/bg/hover, but using
// Button's native :focus-visible (already in buttonTheme's own base) rather
// than the field slot's :focus-within, since this is a single focusable
// element, not a box of several. variant="text" (any color) contributes no
// bg of its own, so this override's bg/ring/hover classes are the only ones
// in play rather than fighting a second, competing background.
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

// navButtonUi/headingButtonUi/cellTriggerUi/rangeCellTriggerUi (the
// per-branch calendar :ui overrides) moved into DatePickerCalendarBody.vue/
// DatePickerRangeCalendarBody.vue along with the rest of each branch's own
// calendar markup - see those files' own copies of these same comments.
</script>

<template>
  <DateRangePickerRoot
    v-if="range"
    :id="datePickerId"
    v-model:open="isRangeOpen"
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
    :readonly="readonly"
    :prevent-deselect="preventDeselect"
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
            :color="color"
            :size="iconButtonSize"
            :aria-label="messages.clear"
            @click="clear"
          >
            <template #icon="{ class: iconClass }">
              <slot name="clear-icon">
                <Icon :name="icons.close" :class="iconClass" />
              </slot>
            </template>
          </Button>
          <DateRangePickerTrigger as-child>
            <Button variant="text" :color="color" :size="iconButtonSize" :aria-label="messages.dateRangePicker">
              <template #icon="{ class: iconClass }">
                <slot name="trigger-icon">
                  <Icon :name="icons.calendar" :class="iconClass" />
                </slot>
              </template>
            </Button>
          </DateRangePickerTrigger>
        </div>
      </div>

      <div v-else class="relative inline-block w-full">
        <DateRangePickerTrigger as-child>
          <Button
            variant="text"
            :color="color"
            :size="effectiveSize"
            :aria-invalid="datePickerInvalid || undefined"
            :aria-describedby="describedBy"
            :ui="buttonTriggerUi"
          >
            {{ hasValue ? formattedValue : messages.pickDate }}
            <template v-if="!(clearable && hasValue)" #trailing-icon="{ class: iconClass }">
              <slot name="trigger-icon">
                <Icon :name="icons.calendar" :class="iconClass" />
              </slot>
            </template>
          </Button>
        </DateRangePickerTrigger>
        <Button
          v-if="clearable && hasValue"
          variant="text"
          :color="color"
          :size="iconButtonSize"
          :aria-label="messages.clear"
          class="absolute end-1 top-1/2 -translate-y-1/2"
          @click.stop="clear"
        >
          <template #icon="{ class: iconClass }">
            <slot name="clear-icon">
              <Icon :name="icons.close" :class="iconClass" />
            </slot>
          </template>
        </Button>
      </div>
    </DateRangePickerAnchor>

    <DateRangePickerContent v-if="!showMobileModal" :side-offset="6" align="start" v-bind="contentProps">
      <DatePickerRangeCalendarBody v-bind="rangeBodyProps">
        <template #day="scope">
          <slot name="day" v-bind="scope" />
        </template>
        <template #footer>
          <slot name="footer" />
        </template>
      </DatePickerRangeCalendarBody>
      <DateRangePickerArrow v-if="arrow" v-bind="arrowProps" />
    </DateRangePickerContent>
    <!--
      Below 768px, the exact same DatePickerRangeCalendarBody - the same
      Root-injected grid/selection state, unchanged - inside a centered
      Modal instead of the small anchored popover above. See
      ComboboxSelectBase.vue's own mobileModal branch for why there's no
      extra portal here and why DialogTitle is required explicitly.
    -->
    <Modal v-else :open="isRangeOpen" :ui="mobileModalUi" @update:open="isRangeOpen = $event">
      <template #content>
        <DialogTitle class="sr-only">
          {{ messages.dateRangePicker }}
        </DialogTitle>
        <div v-bind="mobileContentProps">
          <DatePickerRangeCalendarBody v-bind="rangeBodyProps">
            <template #day="scope">
              <slot name="day" v-bind="scope" />
            </template>
            <template #footer>
              <slot name="footer" />
            </template>
          </DatePickerRangeCalendarBody>
        </div>
      </template>
    </Modal>
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
          :readonly="readonly"
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
            :color="color"
            :size="iconButtonSize"
            :aria-label="messages.clear"
            @click="clear"
          >
            <template #icon="{ class: iconClass }">
              <slot name="clear-icon">
                <Icon :name="icons.close" :class="iconClass" />
              </slot>
            </template>
          </Button>
          <PopoverTrigger as-child>
            <Button variant="text" :color="color" :size="iconButtonSize" :aria-label="messages.timePicker">
              <template #icon="{ class: iconClass }">
                <slot name="trigger-icon">
                  <Icon :name="icons.clock" :class="iconClass" />
                </slot>
              </template>
            </Button>
          </PopoverTrigger>
        </div>
      </div>

      <div v-else class="relative inline-block w-full">
        <PopoverTrigger as-child>
          <Button
            variant="text"
            :color="color"
            :size="effectiveSize"
            :aria-invalid="datePickerInvalid || undefined"
            :aria-describedby="describedBy"
            :ui="buttonTriggerUi"
          >
            {{ hasValue ? formattedTimeValue : messages.pickTime }}
            <template v-if="!(clearable && hasValue)" #trailing-icon="{ class: iconClass }">
              <slot name="trigger-icon">
                <Icon :name="icons.clock" :class="iconClass" />
              </slot>
            </template>
          </Button>
        </PopoverTrigger>
        <Button
          v-if="clearable && hasValue"
          variant="text"
          :color="color"
          :size="iconButtonSize"
          :aria-label="messages.clear"
          class="absolute end-1 top-1/2 -translate-y-1/2"
          @click.stop="clear"
        >
          <template #icon="{ class: iconClass }">
            <slot name="clear-icon">
              <Icon :name="icons.close" :class="iconClass" />
            </slot>
          </template>
        </Button>
      </div>
    </PopoverAnchor>

    <PopoverPortal v-if="!showMobileModal">
      <PopoverContent :side-offset="6" align="start" v-bind="contentProps">
        <DatePickerTimeBody v-bind="timeBodyProps">
          <template #footer>
            <slot name="footer" />
          </template>
        </DatePickerTimeBody>
        <PopoverArrow v-if="arrow" v-bind="arrowProps" />
      </PopoverContent>
    </PopoverPortal>
    <!-- Below 768px - see the range branch's own identical note above. -->
    <Modal v-else :open="timeIsOpen" :ui="mobileModalUi" @update:open="timeIsOpen = $event">
      <template #content>
        <DialogTitle class="sr-only">
          {{ messages.timePicker }}
        </DialogTitle>
        <div v-bind="mobileContentProps">
          <DatePickerTimeBody v-bind="timeBodyProps">
            <template #footer>
              <slot name="footer" />
            </template>
          </DatePickerTimeBody>
        </div>
      </template>
    </Modal>
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
    :readonly="readonly"
    :prevent-deselect="preventDeselect"
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
            :color="color"
            :size="iconButtonSize"
            :aria-label="messages.clear"
            @click="clear"
          >
            <template #icon="{ class: iconClass }">
              <slot name="clear-icon">
                <Icon :name="icons.close" :class="iconClass" />
              </slot>
            </template>
          </Button>
          <DatePickerTrigger as-child>
            <Button variant="text" :color="color" :size="iconButtonSize" :aria-label="messages.datePicker">
              <template #icon="{ class: iconClass }">
                <slot name="trigger-icon">
                  <Icon :name="icons.calendar" :class="iconClass" />
                </slot>
              </template>
            </Button>
          </DatePickerTrigger>
        </div>
      </div>

      <div v-else class="relative inline-block w-full">
        <DatePickerTrigger as-child>
          <Button
            variant="text"
            :color="color"
            :size="effectiveSize"
            :aria-invalid="datePickerInvalid || undefined"
            :aria-describedby="describedBy"
            :ui="buttonTriggerUi"
          >
            {{ hasValue ? formattedValue : messages.pickDate }}
            <template v-if="!(clearable && hasValue)" #trailing-icon="{ class: iconClass }">
              <slot name="trigger-icon">
                <Icon :name="icons.calendar" :class="iconClass" />
              </slot>
            </template>
          </Button>
        </DatePickerTrigger>
        <Button
          v-if="clearable && hasValue"
          variant="text"
          :color="color"
          :size="iconButtonSize"
          :aria-label="messages.clear"
          class="absolute end-1 top-1/2 -translate-y-1/2"
          @click.stop="clear"
        >
          <template #icon="{ class: iconClass }">
            <slot name="clear-icon">
              <Icon :name="icons.close" :class="iconClass" />
            </slot>
          </template>
        </Button>
      </div>
    </DatePickerAnchor>

    <!-- align="start" (the default everywhere else) puts the trigger's own
    center outside the calendar grid's bounds here, since the grid is
    noticeably wider than the compact field/button trigger - Reka's own
    Floating UI arrow middleware refuses to render an arrow it can't
    center without clipping, so it silently hides instead. Centering the
    panel on the trigger only when `arrow` is on sidesteps that without
    changing the default (start-aligned) layout everyone already sees. -->
    <DatePickerContent v-if="!showMobileModal" :side-offset="6" :align="arrow ? 'center' : 'start'" v-bind="contentProps">
      <DatePickerCalendarBody v-bind="calendarBodyProps">
        <template #day="scope">
          <slot name="day" v-bind="scope" />
        </template>
        <template #footer>
          <slot name="footer" />
        </template>
      </DatePickerCalendarBody>
      <DatePickerArrow v-if="arrow" v-bind="arrowProps" />
    </DatePickerContent>
    <!-- Below 768px - see the range branch's own identical note above. -->
    <Modal v-else :open="isOpen" :ui="mobileModalUi" @update:open="isOpen = $event">
      <template #content>
        <DialogTitle class="sr-only">
          {{ messages.datePicker }}
        </DialogTitle>
        <div v-bind="mobileContentProps">
          <DatePickerCalendarBody v-bind="calendarBodyProps">
            <template #day="scope">
              <slot name="day" v-bind="scope" />
            </template>
            <template #footer>
              <slot name="footer" />
            </template>
          </DatePickerCalendarBody>
        </div>
      </template>
    </Modal>
  </DatePickerRoot>
</template>
