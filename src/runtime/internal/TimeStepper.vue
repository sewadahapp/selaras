<script setup lang="ts">
import { computed } from 'vue'
import Button from '../components/Button.vue'
import InputNumber from '../components/InputNumber.vue'
import { useLocale } from '../composables/use-locale'

// Shared by DatePicker.vue's hour/minute granularity time section and its
// time-only mode - both need the identical hour/minute steppers + AM/PM
// toggle, and duplicating the 12-hour conversion dance in two places would
// mean two copies to keep in sync (see ComboboxSelectBase.vue for the same
// "shared behavior justifies a private internal component" precedent).
// Callers only ever hand this 24-hour numbers and receive 24-hour numbers
// back - the 12-hour display/AM-PM toggling is fully contained in here.
export interface TimeStepperProps {
  /** Always 24-hour (0-23), regardless of what's displayed. */
  hour: number
  /** Only read/rendered when granularity is 'minute'. */
  minute?: number
  granularity: 'hour' | 'minute'
  /** Forces 12-hour or 24-hour display; defaults to whatever `locale` itself resolves to. */
  hourCycle?: 12 | 24
  minuteStep?: number
  locale?: string
  size?: 'sm' | 'md' | 'lg'
  /** Ids for the caller's own paired <label for> elements - neither SInputNumber nor SInput forward a bare aria-label to their inner <input>, so callers pair a real sr-only label instead. */
  hourId?: string
  minuteId?: string
}

export interface TimeStepperEmits {
  'update:hour': [value: number]
  'update:minute': [value: number]
}

const props = withDefaults(defineProps<TimeStepperProps>(), {
  minuteStep: 1,
})

const emit = defineEmits<TimeStepperEmits>()

// Same resolution the typed segmented field applies internally via Reka's
// own hourCycle handling - deriving it here too keeps the click stepper
// and the typed field showing the same thing for the same value, instead
// of "14" next to "2:00 PM". h11/h12 are the two 12-hour cycles Intl can
// resolve to, h23/h24 the two 24-hour ones.
const effectiveLocale = computed(() => props.locale ?? useLocale().value)
const resolvedIs12Hour = computed(() => {
  if (props.hourCycle === 12)
    return true
  if (props.hourCycle === 24)
    return false
  const resolved = new Intl.DateTimeFormat(effectiveLocale.value, { hour: 'numeric' }).resolvedOptions().hourCycle
  return resolved === 'h11' || resolved === 'h12'
})
const isPM = computed(() => props.hour >= 12)
// Derived from the same locale driving resolvedIs12Hour above, via
// Intl's own 'dayPeriod' part, rather than the global messages registry -
// the two used to be independent channels that could disagree (an
// Arabic-formatted hour cycle next to an always-English "AM"/"PM"). An
// arbitrary reference date supplies the hour; only its dayPeriod part is
// read back out.
const meridiemText = computed(() => {
  const parts = new Intl.DateTimeFormat(effectiveLocale.value, { hour: 'numeric', hour12: true })
    .formatToParts(new Date(2020, 0, 1, isPM.value ? 13 : 1))
  return parts.find(part => part.type === 'dayPeriod')?.value ?? (isPM.value ? 'PM' : 'AM')
})
function to12Hour(hour24: number) {
  const hour = hour24 % 12
  return hour === 0 ? 12 : hour
}
function from12Hour(hour12: number, pm: boolean) {
  const hour = hour12 % 12
  return pm ? hour + 12 : hour
}
// What the stepper itself shows/accepts - 1-12 in 12-hour mode, 0-23
// otherwise. `hour` (the prop) always stays 24-hour regardless.
const displayHour = computed(() => (resolvedIs12Hour.value ? to12Hour(props.hour) : props.hour))

// On a real clock, the hour and the AM/PM half of the day aren't
// independent - advancing past 12 crosses into the other half (11 PM -> 12
// AM), and stepping back does the same in reverse (12 AM -> 11 PM).
// Without this, wrap-around clamps the *displayed* 1-12 number in
// isolation, leaving AM/PM stuck - clicking the hour stepper could never
// actually reach a time like 12:10 AM from 11:xx PM, only the AM/PM button
// itself could cross that boundary. These are the only two adjacent-value
// transitions where a single ±1 step crosses it either direction.
function setHour(value: number | undefined) {
  if (value === undefined)
    return
  if (!resolvedIs12Hour.value) {
    emit('update:hour', value)
    return
  }
  const crossesBoundary = (displayHour.value === 11 && value === 12) || (displayHour.value === 12 && value === 11)
  const pm = crossesBoundary ? !isPM.value : isPM.value
  emit('update:hour', from12Hour(value, pm))
}
function setMinute(value: number | undefined) {
  if (value === undefined)
    return
  emit('update:minute', value)
}
// Flips AM/PM by +-12 hours - the displayed 1-12 number stays exactly the
// same (7:00 AM -> 7:00 PM), only the 24-hour value changes.
function toggleMeridiem() {
  emit('update:hour', isPM.value ? props.hour - 12 : props.hour + 12)
}

const twoDigitFormat = { minimumIntegerDigits: 2 }
const effectiveSize = computed(() => props.size ?? 'sm')
</script>

<template>
  <InputNumber
    :id="hourId"
    :model-value="displayHour"
    :min="resolvedIs12Hour ? 1 : 0"
    :max="resolvedIs12Hour ? 12 : 23"
    wrap
    :format-options="twoDigitFormat"
    :size="effectiveSize"
    class="w-28"
    @update:model-value="setHour"
  />
  <span v-if="granularity === 'minute'" class="text-[var(--ui-text-muted)]">:</span>
  <InputNumber
    v-if="granularity === 'minute'"
    :id="minuteId"
    :model-value="minute"
    :min="0"
    :max="59"
    :step="minuteStep"
    wrap
    :format-options="twoDigitFormat"
    :size="effectiveSize"
    class="w-28"
    @update:model-value="setMinute"
  />
  <Button
    v-if="resolvedIs12Hour"
    variant="outline"
    color="neutral"
    :size="effectiveSize"
    @click="toggleMeridiem"
  >
    {{ meridiemText }}
  </Button>
</template>
