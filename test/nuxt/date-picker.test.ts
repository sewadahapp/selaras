import { CalendarDate } from '@internationalized/date'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, describe, expect, it } from 'vitest'
import DatePicker from '../../src/runtime/components/DatePicker.vue'

// DatePickerContent teleports into document.body once opened, same as
// Modal's DialogContent (see modal.test.ts) - query document.body directly
// for anything inside the popover. Nothing auto-unmounts a teleported node
// between tests, so unmount explicitly - otherwise a later test's query can
// match a previous test's stale, already-torn-down button.
let wrapper: Awaited<ReturnType<typeof mountSuspended>> | undefined

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

async function openCalendar(w: Awaited<ReturnType<typeof mountSuspended>>) {
  await w.find('button[aria-label="Date picker"]').trigger('click')
  await new Promise(resolve => setTimeout(resolve, 50))
}

function dayButton(text: string) {
  return Array.from(document.body.querySelectorAll('td button')).find(b => b.textContent?.trim() === text) as HTMLButtonElement
}

describe('datePicker', () => {
  it('renders a day-number button for every day in the placeholder month', async () => {
    wrapper = await mountSuspended(DatePicker, { props: { modelValue: new CalendarDate(2024, 1, 15) } })
    await openCalendar(wrapper)

    // January 2024 has 31 days.
    const dayButtons = Array.from(document.body.querySelectorAll('td button')).filter(b => b.getAttribute('data-outside-view') === null)
    expect(dayButtons).toHaveLength(31)
  })

  it('emits update:modelValue with the clicked CalendarDate', async () => {
    wrapper = await mountSuspended(DatePicker, { props: { modelValue: new CalendarDate(2024, 1, 15) } })
    await openCalendar(wrapper)

    dayButton('10').dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await new Promise(resolve => setTimeout(resolve, 50))

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    const value = emitted!.at(-1)![0] as CalendarDate
    expect(value.toString()).toBe('2024-01-10')
  })

  it('navigates to the next month via the header button', async () => {
    wrapper = await mountSuspended(DatePicker, { props: { modelValue: new CalendarDate(2024, 1, 15) } })
    await openCalendar(wrapper)

    const headingText = () => document.body.querySelector('button[aria-label="Next month"]')?.parentElement?.textContent
    const before = headingText()

    document.body.querySelector<HTMLButtonElement>('button[aria-label="Next month"]')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(headingText()).not.toBe(before)
  })

  it('disables days outside a minValue/maxValue range', async () => {
    wrapper = await mountSuspended(DatePicker, {
      props: {
        modelValue: new CalendarDate(2024, 1, 15),
        minValue: new CalendarDate(2024, 1, 10),
        maxValue: new CalendarDate(2024, 1, 20),
      },
    })
    await openCalendar(wrapper)

    expect(dayButton('5').hasAttribute('disabled')).toBe(true)
    expect(dayButton('15').hasAttribute('disabled')).toBe(false)
  })

  it('marks (but does not block selecting) a date matched by isDateUnavailable', async () => {
    wrapper = await mountSuspended(DatePicker, {
      props: {
        modelValue: new CalendarDate(2024, 1, 15),
        isDateUnavailable: (date: { day: number }) => date.day === 12,
      },
    })
    await openCalendar(wrapper)

    const day12 = dayButton('12')
    expect(day12.getAttribute('data-unavailable')).toBe('')
    expect(day12.hasAttribute('disabled')).toBe(false)
  })

  it('shows a clear button only when clearable and a value is set, and clears on click', async () => {
    const withoutValue = await mountSuspended(DatePicker, { props: { clearable: true } })
    expect(withoutValue.find('button[aria-label="Clear"]').exists()).toBe(false)
    withoutValue.unmount()

    wrapper = await mountSuspended(DatePicker, { props: { clearable: true, modelValue: new CalendarDate(2024, 1, 15) } })
    const clearButton = wrapper.find('button[aria-label="Clear"]')
    expect(clearButton.exists()).toBe(true)
    await clearButton.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([undefined])
  })

  it('closes the popover after picking a date by default (closeOnSelect)', async () => {
    // Uncontrolled (no modelValue prop) - Reka's own internal state only
    // actually advances on click when the value isn't externally controlled
    // by a prop the test never re-feeds back down, same as any v-model
    // needs a consumer to complete the loop in real usage.
    wrapper = await mountSuspended(DatePicker, { props: { defaultPlaceholder: new CalendarDate(2024, 1, 15) } as any })
    await openCalendar(wrapper)
    expect(document.body.querySelectorAll('td button').length).toBeGreaterThan(0)

    dayButton('10').dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(document.body.querySelectorAll('td button').length).toBe(0)
  })
})
