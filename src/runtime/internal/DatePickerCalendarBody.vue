<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import type { VariantProps } from 'tailwind-variants'
import type { buttonTheme } from '../theme/button'
import {
  DatePickerCalendar,
  DatePickerCell,
  DatePickerCellTrigger,
  DatePickerGrid,
  DatePickerGridBody,
  DatePickerGridHead,
  DatePickerGridRow,
  DatePickerHeadCell,
  DatePickerHeader,
  DatePickerHeading,
  DatePickerNext,
  DatePickerPrev,
} from 'reka-ui'
import Button from '../components/Button.vue'
import { useIcons } from '../composables/use-icons'
import { useMessages } from '../composables/use-messages'
import TimeStepper from './TimeStepper.vue'

type ButtonVariants = VariantProps<typeof buttonTheme>

// DatePicker.vue's own plain (single-date) calendar body - everything
// that used to sit inside <DatePickerCalendar> there (the view-aware
// header/nav, the three mutually-exclusive date/month/year grids, and
// the time section + Done button), split out for the same reason as
// DatePickerRangeCalendarBody.vue - see that file's own comment. This is
// the largest of the three extracted bodies since the plain branch is
// the only one with the month/year drill-down and the closeOnSelect
// Done button.
export interface DatePickerCalendarBodyProps {
  internalView: 'date' | 'month' | 'year'
  color?: ButtonVariants['color']
  activeColor?: ButtonVariants['color']
  placeholder: DateValue
  monthGridItems: { value: DateValue, label: string }[]
  yearGridItems: { value: number, label: string }[]
  decadeHeadingText: string
  isMonthDisabled: (date: DateValue) => boolean
  isYearDisabled: (year: number) => boolean
  selectMonth: (date: DateValue) => void
  selectYear: (year: number) => void
  drillUp: () => void
  goToPreviousYear: () => void
  goToNextYear: () => void
  goToPreviousDecade: () => void
  goToNextDecade: () => void
  isTimeGranularity: boolean
  granularity?: 'year' | 'month' | 'day' | 'hour' | 'minute'
  placeholderHour: number
  placeholderMinute: number
  hourCycle?: 12 | 24
  minuteStep?: number
  locale?: string
  hourInputId: string
  minuteInputId: string
  setHour: (hour24: number) => void
  setMinute: (minute: number) => void
  closeOnSelect?: boolean
  /** Closes the popover/modal - the Done button's own action. A plain callback, not a v-model, matching every other action prop here (selectMonth/drillUp/etc). */
  close: () => void
  headerProps?: Record<string, unknown>
  headingProps?: Record<string, unknown>
  gridsProps?: Record<string, unknown>
  gridProps?: Record<string, unknown>
  gridHeadProps?: Record<string, unknown>
  headCellProps?: Record<string, unknown>
  cellProps?: Record<string, unknown>
  viewGridProps?: Record<string, unknown>
  timeSectionProps?: Record<string, unknown>
}

defineProps<DatePickerCalendarBodyProps>()

const icons = useIcons()
const messages = useMessages()

// Same inline :ui overrides as DatePicker.vue's own (pre-extraction)
// copies - see that file's own comments on these for why they stay plain
// object literals/strings rather than theme slots.
const navButtonUi = { leadingIcon: 'rtl:-scale-x-100' }
const headingButtonUi = 'rounded-[var(--ui-radius-sm)] px-1.5 py-0.5 transition-colors hover:bg-[var(--ui-bg-elevated)] disabled:hover:bg-transparent disabled:cursor-default'
const cellTriggerUi = {
  base: 'relative data-[today]:font-semibold data-[today]:after:absolute data-[today]:after:bottom-1 data-[today]:after:left-1/2 data-[today]:after:size-1 data-[today]:after:-translate-x-1/2 data-[today]:after:rounded-full data-[today]:after:bg-[var(--ui-primary)] data-[outside-view]:opacity-40 data-[unavailable]:opacity-40 data-[unavailable]:line-through',
}
</script>

<template>
  <DatePickerCalendar v-slot="{ grid, weekDays }">
    <DatePickerHeader v-bind="headerProps">
      <DatePickerPrev v-if="internalView === 'date'" as-child>
        <Button variant="ghost" :color="color" size="sm" :icon="icons.chevronLeft" :aria-label="messages.previousMonth" :ui="navButtonUi" />
      </DatePickerPrev>
      <Button
        v-else
        variant="ghost"
        :color="color"
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
        <Button variant="ghost" :color="color" size="sm" :icon="icons.chevronRight" :aria-label="messages.nextMonth" :ui="navButtonUi" />
      </DatePickerNext>
      <Button
        v-else
        variant="ghost"
        :color="color"
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
                  :color="selected ? activeColor : color"
                  size="sm"
                  square
                  :disabled="dayDisabled"
                  :ui="cellTriggerUi"
                >
                  <slot name="day" :date="date" :day-value="dayValue" :selected="selected" :disabled="dayDisabled">
                    {{ dayValue }}
                  </slot>
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
        :color="monthItem.value.month === placeholder.month ? activeColor : color"
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
        :color="yearItem.value === placeholder.year ? activeColor : color"
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
        :color="activeColor"
        size="sm"
        block
        class="mt-2"
        @click="close"
      >
        {{ messages.done }}
      </Button>
    </template>
    <slot name="footer" />
  </DatePickerCalendar>
</template>
