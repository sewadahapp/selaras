<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import type { CalendarThemeSlots } from '../theme/calendar'
import type { ColorRole } from '../utils/color-registry'
import type { UiProp } from '../utils/ui'
import {
  CalendarCell,
  CalendarCellTrigger,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHead,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarHeader,
  CalendarHeading,
  CalendarNext,
  CalendarPrev,
  CalendarRoot,
} from 'reka-ui'
import { computed, getCurrentInstance, useId, useSlots } from 'vue'
import { useIcons } from '../composables/use-icons'
import { useMessages } from '../composables/use-messages'
import { calendarTheme } from '../theme/calendar'
import { resolveRegisteredColorRole } from '../utils/registered-colors'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import Button from './Button.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<CalendarProps>(), {
  color: 'neutral',
  activeColor: 'primary',
})

const emit = defineEmits<CalendarEmits>()

defineSlots<{
  'day'?: (props: CalendarDaySlotProps) => any
  /** Renders beside the date trigger within its grid cell. Safe for event links/buttons. */
  'day-details'?: (props: { date: DateValue, month: DateValue }) => any
  'footer'?: () => any
}>()

export interface CalendarProps {
  modelValue?: DateValue
  defaultValue?: DateValue
  /** The displayed month when controlled independently of the selected date. */
  placeholder?: DateValue
  defaultPlaceholder?: DateValue
  minValue?: DateValue
  maxValue?: DateValue
  isDateDisabled?: (date: DateValue) => boolean
  isDateUnavailable?: (date: DateValue) => boolean
  locale?: string
  numberOfMonths?: number
  pagedNavigation?: boolean
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  weekdayFormat?: 'narrow' | 'short' | 'long'
  fixedWeeks?: boolean
  disableDaysOutsideCurrentView?: boolean
  preventDeselect?: boolean
  disabled?: boolean
  readonly?: boolean
  initialFocus?: boolean
  calendarLabel?: string
  color?: ColorRole
  activeColor?: ColorRole
  ui?: UiProp<CalendarThemeSlots>
}

export interface CalendarEmits {
  'update:modelValue': [value: DateValue | undefined]
  'update:placeholder': [value: DateValue]
}

export interface CalendarDaySlotProps {
  date: DateValue
  month: DateValue
  dayValue: string
  selected: boolean
  today: boolean
  disabled: boolean
  unavailable: boolean
  outsideView: boolean
  outsideVisibleView: boolean
}

const slots = useSlots()
const instance = getCurrentInstance()!
const detailsId = useId()
const icons = useIcons()
const messages = useMessages()
const theme = useComponentTheme('calendar', calendarTheme)
const ui = computed(() => theme.value())
const color = computed(() => resolveRegisteredColorRole(props.color, 'neutral'))
const activeColor = computed(() => resolveRegisteredColorRole(props.activeColor, 'primary'))
// Reka treats an undefined modelValue as uncontrolled. Preserve the normal
// Selaras distinction between an omitted prop and a deliberately bound empty
// v-model by passing null for the latter (Reka accepts null as a controlled
// empty value).
const rootModelValue = computed(() => {
  const vnodeProps = instance.vnode.props ?? {}
  const isControlled = Object.hasOwn(vnodeProps, 'modelValue') || Object.hasOwn(vnodeProps, 'model-value')
  return isControlled && props.modelValue === undefined ? null : props.modelValue
})
const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
const headerProps = computed(() => resolveSlot(ui.value.header, props.ui?.header))
const headingProps = computed(() => resolveSlot(ui.value.heading, props.ui?.heading))
const gridsProps = computed(() => resolveSlot(ui.value.grids, props.ui?.grids))
const gridProps = computed(() => resolveSlot(ui.value.grid, props.ui?.grid))
const gridHeadProps = computed(() => resolveSlot(ui.value.gridHead, props.ui?.gridHead))
const headCellProps = computed(() => resolveSlot(ui.value.headCell, props.ui?.headCell))
const cellProps = computed(() => resolveSlot(ui.value.cell, props.ui?.cell))
const dayButtonProps = computed(() => resolveSlot(ui.value.dayButton, props.ui?.dayButton))
const dayDetailsProps = computed(() => resolveSlot(ui.value.dayDetails, props.ui?.dayDetails))
const footerProps = computed(() => resolveSlot(ui.value.footer, props.ui?.footer))
const navButtonUi = { leadingIcon: 'rtl:-scale-x-100' }
const dayDetailsId = (month: DateValue, date: DateValue) => `${detailsId}-${month.toString()}-${date.toString()}`
</script>

<template>
  <CalendarRoot
    :model-value="rootModelValue"
    :default-value="defaultValue"
    :placeholder="placeholder"
    :default-placeholder="defaultPlaceholder"
    :min-value="minValue"
    :max-value="maxValue"
    :is-date-disabled="isDateDisabled"
    :is-date-unavailable="isDateUnavailable"
    :locale="locale"
    :number-of-months="numberOfMonths"
    :paged-navigation="pagedNavigation"
    :week-starts-on="weekStartsOn"
    :weekday-format="weekdayFormat"
    :fixed-weeks="fixedWeeks"
    :disable-days-outside-current-view="disableDaysOutsideCurrentView"
    :prevent-deselect="preventDeselect"
    :disabled="disabled"
    :readonly="readonly"
    :initial-focus="initialFocus"
    :calendar-label="calendarLabel"
    :data-selaras-color="activeColor"
    v-bind="rootProps"
    @update:model-value="(value) => emit('update:modelValue', value)"
    @update:placeholder="(value) => emit('update:placeholder', value)"
  >
    <template #default="{ grid, weekDays }">
      <CalendarHeader v-bind="headerProps">
        <CalendarPrev as-child>
          <Button variant="ghost" :color="color" size="sm" :icon="icons.chevronLeft" :aria-label="messages.previousMonth" :ui="navButtonUi" />
        </CalendarPrev>
        <CalendarHeading v-bind="headingProps" />
        <CalendarNext as-child>
          <Button variant="ghost" :color="color" size="sm" :icon="icons.chevronRight" :aria-label="messages.nextMonth" :ui="navButtonUi" />
        </CalendarNext>
      </CalendarHeader>

      <div v-bind="gridsProps">
        <CalendarGrid v-for="month in grid" :key="month.value.toString()" v-bind="gridProps">
          <CalendarGridHead v-bind="gridHeadProps">
            <CalendarGridRow>
              <CalendarHeadCell v-for="day in weekDays" :key="day" v-bind="headCellProps">
                {{ day }}
              </CalendarHeadCell>
            </CalendarGridRow>
          </CalendarGridHead>
          <CalendarGridBody>
            <CalendarGridRow v-for="(week, weekIndex) in month.rows" :key="weekIndex">
              <CalendarCell v-for="date in week" :key="date.toString()" :date="date" v-bind="cellProps">
                <CalendarCellTrigger
                  v-slot="dayState"
                  :day="date"
                  :month="month.value"
                  as-child
                >
                  <Button
                    :variant="dayState.selected ? 'solid' : 'ghost'"
                    :color="dayState.selected ? activeColor : color"
                    size="sm"
                    square
                    :disabled="dayState.disabled"
                    :aria-describedby="slots['day-details'] ? dayDetailsId(month.value, date) : undefined"
                    v-bind="dayButtonProps"
                  >
                    <slot name="day" :date="date" :month="month.value" v-bind="dayState">
                      {{ dayState.dayValue }}
                    </slot>
                  </Button>
                </CalendarCellTrigger>
                <div v-if="slots['day-details']" :id="dayDetailsId(month.value, date)" v-bind="dayDetailsProps">
                  <slot name="day-details" :date="date" :month="month.value" />
                </div>
              </CalendarCell>
            </CalendarGridRow>
          </CalendarGridBody>
        </CalendarGrid>
      </div>
      <div v-if="slots.footer" v-bind="footerProps">
        <slot name="footer" />
      </div>
    </template>
  </CalendarRoot>
</template>
