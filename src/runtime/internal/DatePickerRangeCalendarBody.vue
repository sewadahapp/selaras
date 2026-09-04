<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { buttonTheme } from '../theme/button'
import {
  DateRangePickerCalendar,
  DateRangePickerCell,
  DateRangePickerCellTrigger,
  DateRangePickerGrid,
  DateRangePickerGridBody,
  DateRangePickerGridHead,
  DateRangePickerGridRow,
  DateRangePickerHeadCell,
  DateRangePickerHeader,
  DateRangePickerHeading,
  DateRangePickerNext,
  DateRangePickerPrev,
} from 'reka-ui'
import Button from '../components/Button.vue'
import { useIcons } from '../composables/use-icons'
import { useMessages } from '../composables/use-messages'

type ButtonVariants = VariantProps<typeof buttonTheme>

// DatePicker.vue's own range-mode calendar body - everything that used to
// sit inside <DateRangePickerCalendar> there, split out so the exact same
// markup (closing over DateRangePickerRoot's own injected context - Vue's
// provide/inject follows the component tree, not the DOM tree, so this
// resolves correctly whether it's rendered under the desktop
// DateRangePickerContent or under a mobile Modal's own content slot) can
// be instantiated once for each, without duplicating the grid/cell
// rendering between them. DateRangePickerCalendar itself is included here
// (not left in the parent) since it carries no desktop-anchoring chrome
// of its own - it's a pure context/grid-data provider, same reasoning
// DatePickerContent/DateRangePickerContent/*Arrow stay OUT (those genuinely
// are anchoring-only and never instantiated on the mobile path).
export interface DatePickerRangeCalendarBodyProps {
  color?: ButtonVariants['color']
  activeColor?: ButtonVariants['color']
  headerProps?: Record<string, unknown>
  headingProps?: Record<string, unknown>
  gridsProps?: Record<string, unknown>
  gridProps?: Record<string, unknown>
  gridHeadProps?: Record<string, unknown>
  headCellProps?: Record<string, unknown>
  cellProps?: Record<string, unknown>
}

defineProps<DatePickerRangeCalendarBodyProps>()

const icons = useIcons()
const messages = useMessages()

// Same inline :ui overrides as DatePicker.vue's own (pre-extraction)
// copies - see that file's own comments on navButtonUi/rangeCellTriggerUi
// for why these stay plain object literals rather than theme slots.
const navButtonUi = { leadingIcon: 'rtl:-scale-x-100' }
const rangeCellTriggerUi = {
  base: 'relative w-full rounded-none data-[selection-start]:rounded-s-full data-[selection-end]:rounded-e-full data-[today]:font-semibold data-[today]:after:absolute data-[today]:after:bottom-1 data-[today]:after:left-1/2 data-[today]:after:size-1 data-[today]:after:-translate-x-1/2 data-[today]:after:rounded-full data-[today]:after:bg-[var(--ui-primary)] data-[outside-view]:opacity-40 data-[unavailable]:opacity-40 data-[unavailable]:line-through',
}
</script>

<template>
  <DateRangePickerCalendar v-slot="{ grid, weekDays }">
    <DateRangePickerHeader v-bind="headerProps">
      <DateRangePickerPrev as-child>
        <Button variant="ghost" :color="color" size="sm" :icon="icons.chevronLeft" :aria-label="messages.previousMonth" :ui="navButtonUi" />
      </DateRangePickerPrev>
      <DateRangePickerHeading v-bind="headingProps" />
      <DateRangePickerNext as-child>
        <Button variant="ghost" :color="color" size="sm" :icon="icons.chevronRight" :aria-label="messages.nextMonth" :ui="navButtonUi" />
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
                  :color="selectionStart || selectionEnd || highlighted || selected ? activeColor : color"
                  size="sm"
                  :disabled="dayDisabled"
                  :ui="rangeCellTriggerUi"
                >
                  <slot
                    name="day"
                    :date="date"
                    :day-value="dayValue"
                    :selected="selected"
                    :disabled="dayDisabled"
                    :selection-start="selectionStart"
                    :selection-end="selectionEnd"
                    :highlighted="highlighted"
                  >
                    {{ dayValue }}
                  </slot>
                </Button>
              </DateRangePickerCellTrigger>
            </DateRangePickerCell>
          </DateRangePickerGridRow>
        </DateRangePickerGridBody>
      </DateRangePickerGrid>
    </div>
    <slot name="footer" />
  </DateRangePickerCalendar>
</template>
