<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { buttonTheme } from '../theme/button'
import Button from '../components/Button.vue'
import { useMessages } from '../composables/use-messages'
import TimeStepper from './TimeStepper.vue'

type ButtonVariants = VariantProps<typeof buttonTheme>

// DatePicker.vue's own timeOnly-mode body - everything that used to sit
// inside its own raw <PopoverContent>, split out for the same reason as
// DatePickerRangeCalendarBody.vue/DatePickerCalendarBody.vue (see the
// former's own comment) - small (just TimeStepper + the Done button)
// since the timeOnly branch has no Root context or grid of its own to
// carry, extracted mainly for structural symmetry with the other two.
export interface DatePickerTimeBodyProps {
  hour: number
  minute: number
  granularity: 'hour' | 'minute'
  hourCycle?: 12 | 24
  minuteStep?: number
  locale?: string
  hourInputId: string
  minuteInputId: string
  setHour: (hour24: number) => void
  setMinute: (minute: number) => void
  closeOnSelect?: boolean
  activeColor?: ButtonVariants['color']
  /** Closes the popover/modal - the Done button's own action. */
  close: () => void
  timeSectionProps?: Record<string, unknown>
}

defineProps<DatePickerTimeBodyProps>()

const messages = useMessages()
</script>

<template>
  <div v-bind="timeSectionProps">
    <label :for="hourInputId" class="sr-only">{{ messages.hour }}</label>
    <label v-if="granularity === 'minute'" :for="minuteInputId" class="sr-only">{{ messages.minute }}</label>
    <TimeStepper
      :hour="hour"
      :minute="minute"
      :granularity="granularity"
      :hour-cycle="hourCycle"
      :minute-step="minuteStep"
      :locale="locale"
      :hour-id="hourInputId"
      :minute-id="minuteInputId"
      @update:hour="setHour"
      @update:minute="setMinute"
    />
  </div>
  <slot name="footer" />
  <Button
    v-if="closeOnSelect"
    variant="solid"
    :color="activeColor"
    size="sm"
    block
    class="mt-2"
    @click="close"
  >
    {{ messages.done }}
  </Button>
</template>
