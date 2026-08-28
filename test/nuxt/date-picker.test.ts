import type { DOMWrapper } from '@vue/test-utils'
import { CalendarDate, CalendarDateTime } from '@internationalized/date'
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

async function openRangeCalendar(w: Awaited<ReturnType<typeof mountSuspended>>) {
  await w.find('button[aria-label="Date range picker"]').trigger('click')
  await new Promise(resolve => setTimeout(resolve, 50))
}

function viewGridButton(text: string) {
  return Array.from(document.body.querySelectorAll('button')).find(b => b.textContent?.trim() === text) as HTMLButtonElement | undefined
}

async function clickAndWait(el: HTMLElement) {
  el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
  await new Promise(resolve => setTimeout(resolve, 50))
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

  it('button mode shows the placeholder message when empty and the formatted date once set', async () => {
    const empty = await mountSuspended(DatePicker, { props: { triggerMode: 'button' } })
    expect(empty.text()).toContain('Pick a date')
    empty.unmount()

    wrapper = await mountSuspended(DatePicker, { props: { triggerMode: 'button', modelValue: new CalendarDate(2024, 6, 15) } })
    expect(wrapper.text()).toContain('Jun 15, 2024')
  })

  it('button mode respects a custom format', async () => {
    wrapper = await mountSuspended(DatePicker, {
      props: {
        triggerMode: 'button',
        modelValue: new CalendarDate(2024, 6, 15),
        format: { year: 'numeric', month: '2-digit', day: '2-digit' },
      },
    })
    expect(wrapper.text()).toContain('06/15/2024')
  })

  it('button mode still opens the calendar and updates the value on day click', async () => {
    wrapper = await mountSuspended(DatePicker, { props: { triggerMode: 'button', modelValue: new CalendarDate(2024, 1, 15) } })
    await wrapper.find('button').trigger('click')
    await new Promise(resolve => setTimeout(resolve, 50))

    dayButton('10').dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await new Promise(resolve => setTimeout(resolve, 50))

    const value = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as CalendarDate
    expect(value.toString()).toBe('2024-01-10')
  })

  it('range mode renders two segment groups separated by a dash', async () => {
    wrapper = await mountSuspended(DatePicker, { props: { range: true } })
    expect(wrapper.text()).toContain('–')
  })

  it('range mode: first click sets only the start and keeps the popover open, second click completes the range and closes it', async () => {
    wrapper = await mountSuspended(DatePicker, { props: { range: true, defaultPlaceholder: new CalendarDate(2024, 1, 1) } as any })
    await openRangeCalendar(wrapper)

    dayButton('10').dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await new Promise(resolve => setTimeout(resolve, 50))

    let emitted = wrapper.emitted('update:modelValue')
    expect(emitted?.at(-1)?.[0]).toMatchObject({ start: expect.anything(), end: undefined })
    expect(document.body.querySelectorAll('td button').length).toBeGreaterThan(0)

    dayButton('20').dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await new Promise(resolve => setTimeout(resolve, 50))

    emitted = wrapper.emitted('update:modelValue')
    const range = emitted?.at(-1)?.[0] as { start: CalendarDate, end: CalendarDate }
    expect(range.start.toString()).toBe('2024-01-10')
    expect(range.end.toString()).toBe('2024-01-20')
    expect(document.body.querySelectorAll('td button').length).toBe(0)
  })

  it('range mode keeps the connecting fill on the days between start and end once the range is fully committed', async () => {
    // Reka's own highlightedRange is deliberately null once both start and
    // end are set (it's a live hover-preview mechanism, not a persistent
    // "day is in range" flag) - regression test for the day this was found
    // to leave already-picked ranges with no connecting bar at all.
    wrapper = await mountSuspended(DatePicker, {
      props: {
        range: true,
        modelValue: { start: new CalendarDate(2024, 1, 10), end: new CalendarDate(2024, 1, 20) },
      },
    })
    await openRangeCalendar(wrapper)

    const middleDay = dayButton('15')
    expect(middleDay.className).toContain('bg-[var(--ui-primary-soft)]')

    const start = dayButton('10')
    const end = dayButton('20')
    expect(start.className).toContain('bg-[var(--ui-primary)]')
    expect(end.className).toContain('bg-[var(--ui-primary)]')
  })

  it('range mode disables days outside a minValue/maxValue range', async () => {
    wrapper = await mountSuspended(DatePicker, {
      props: {
        range: true,
        modelValue: { start: new CalendarDate(2024, 1, 15), end: new CalendarDate(2024, 1, 15) },
        minValue: new CalendarDate(2024, 1, 10),
        maxValue: new CalendarDate(2024, 1, 20),
      },
    })
    await openRangeCalendar(wrapper)

    expect(dayButton('5').hasAttribute('disabled')).toBe(true)
    expect(dayButton('15').hasAttribute('disabled')).toBe(false)
  })

  it('range mode clearable clears both ends', async () => {
    wrapper = await mountSuspended(DatePicker, {
      props: {
        range: true,
        clearable: true,
        modelValue: { start: new CalendarDate(2024, 1, 10), end: new CalendarDate(2024, 1, 20) },
      },
    })
    const clearButton = wrapper.find('button[aria-label="Clear"]')
    expect(clearButton.exists()).toBe(true)
    await clearButton.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([{ start: undefined, end: undefined }])
  })

  it('range mode button trigger shows a formatted range', async () => {
    wrapper = await mountSuspended(DatePicker, {
      props: {
        range: true,
        triggerMode: 'button',
        modelValue: { start: new CalendarDate(2024, 6, 15), end: new CalendarDate(2024, 6, 20) },
      },
    })
    expect(wrapper.text()).toContain('Jun 15')
    expect(wrapper.text()).toContain('20, 2024')
  })

  it('clicking the heading drills into a 12-button month view', async () => {
    wrapper = await mountSuspended(DatePicker, { props: { modelValue: new CalendarDate(2024, 6, 15) } })
    await openCalendar(wrapper)

    await clickAndWait(document.body.querySelector('button[aria-label="Choose month"]')!)

    expect(document.body.querySelectorAll('td button').length).toBe(0)
    expect(viewGridButton('Jun')).toBeTruthy()
    expect(viewGridButton('Dec')).toBeTruthy()
  })

  it('clicking a month returns to date view on that month', async () => {
    wrapper = await mountSuspended(DatePicker, { props: { modelValue: new CalendarDate(2024, 6, 15) } })
    await openCalendar(wrapper)
    await clickAndWait(document.body.querySelector('button[aria-label="Choose month"]')!)

    await clickAndWait(viewGridButton('Dec')!)

    expect(document.body.querySelectorAll('td button').length).toBeGreaterThan(0)
    expect(document.body.querySelector('button[aria-label="Choose month"]')?.textContent).toContain('December')
  })

  it('clicking the heading twice reaches a 12-button year view containing the current year', async () => {
    wrapper = await mountSuspended(DatePicker, { props: { modelValue: new CalendarDate(2024, 6, 15) } })
    await openCalendar(wrapper)

    await clickAndWait(document.body.querySelector('button[aria-label="Choose month"]')!)
    await clickAndWait(document.body.querySelector('button[aria-label="Choose year"]')!)

    expect(document.body.querySelectorAll('td button').length).toBe(0)
    expect(viewGridButton('2024')).toBeTruthy()
  })

  it('clicking a year returns to month view on that year', async () => {
    wrapper = await mountSuspended(DatePicker, { props: { modelValue: new CalendarDate(2024, 6, 15) } })
    await openCalendar(wrapper)
    await clickAndWait(document.body.querySelector('button[aria-label="Choose month"]')!)
    await clickAndWait(document.body.querySelector('button[aria-label="Choose year"]')!)

    const otherYear = viewGridButton('2030') ?? viewGridButton('2018')
    await clickAndWait(otherYear!)

    expect(viewGridButton('Jun')).toBeTruthy()
    expect(document.body.querySelector('button[aria-label="Choose year"]')?.textContent?.trim()).toBe(otherYear!.textContent!.trim())
  })

  it('minValue/maxValue disable out-of-range months and years in view mode', async () => {
    wrapper = await mountSuspended(DatePicker, {
      props: {
        modelValue: new CalendarDate(2024, 6, 15),
        minValue: new CalendarDate(2024, 3, 1),
        maxValue: new CalendarDate(2024, 9, 30),
      },
    })
    await openCalendar(wrapper)
    await clickAndWait(document.body.querySelector('button[aria-label="Choose month"]')!)

    expect(viewGridButton('Jan')?.hasAttribute('disabled')).toBe(true)
    expect(viewGridButton('Jun')?.hasAttribute('disabled')).toBe(false)
  })

  it('resets to date view after the popover closes and reopens', async () => {
    wrapper = await mountSuspended(DatePicker, { props: { modelValue: new CalendarDate(2024, 6, 15) } })
    await openCalendar(wrapper)
    await clickAndWait(document.body.querySelector('button[aria-label="Choose month"]')!)
    expect(viewGridButton('Jun')).toBeTruthy()

    await openCalendar(wrapper) // toggles closed
    await openCalendar(wrapper) // reopen

    expect(document.body.querySelectorAll('td button').length).toBeGreaterThan(0)
  })

  it('range mode heading stays non-interactive (no drill-down)', async () => {
    wrapper = await mountSuspended(DatePicker, { props: { range: true, modelValue: { start: new CalendarDate(2024, 1, 10), end: new CalendarDate(2024, 1, 20) } } })
    await openRangeCalendar(wrapper)

    expect(document.body.querySelector('button[aria-label="Choose month"]')).toBeFalsy()
  })

  it('granularity=month opens straight to the month grid - the day grid never renders', async () => {
    wrapper = await mountSuspended(DatePicker, { props: { granularity: 'month', modelValue: new CalendarDate(2024, 6, 15) } })
    await openCalendar(wrapper)

    expect(document.body.querySelectorAll('td button').length).toBe(0)
    expect(viewGridButton('Jun')).toBeTruthy()
  })

  it('granularity=month: selecting a month is terminal - it closes the popover and emits a day=1 value', async () => {
    wrapper = await mountSuspended(DatePicker, { props: { granularity: 'month', modelValue: new CalendarDate(2024, 6, 15) } })
    await openCalendar(wrapper)

    await clickAndWait(viewGridButton('Dec')!)

    expect(document.body.querySelectorAll('button').length).toBe(0)
    const value = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as CalendarDate
    expect(value.toString()).toBe('2024-12-01')
  })

  it('granularity=year opens straight to the year grid', async () => {
    wrapper = await mountSuspended(DatePicker, { props: { granularity: 'year', modelValue: new CalendarDate(2024, 6, 15) } })
    await openCalendar(wrapper)

    expect(document.body.querySelectorAll('td button').length).toBe(0)
    expect(viewGridButton('2024')).toBeTruthy()
  })

  it('granularity=year: selecting a year is terminal - it closes the popover and emits a month=1/day=1 value', async () => {
    wrapper = await mountSuspended(DatePicker, { props: { granularity: 'year', modelValue: new CalendarDate(2024, 6, 15) } })
    await openCalendar(wrapper)

    const otherYear = viewGridButton('2030') ?? viewGridButton('2018')
    await clickAndWait(otherYear!)

    expect(document.body.querySelectorAll('button').length).toBe(0)
    const value = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as CalendarDate
    expect(value.month).toBe(1)
    expect(value.day).toBe(1)
  })

  it('granularity=month field-mode segments show only month and year, with no stray/doubled separator', async () => {
    wrapper = await mountSuspended(DatePicker, { props: { granularity: 'month', modelValue: new CalendarDate(2024, 6, 15) } })

    const labels = wrapper.findAll('[role="spinbutton"]').map((w: DOMWrapper<Element>) => w.attributes('aria-label')?.trim().replace(',', ''))
    expect(labels).toEqual(['month', 'year'])

    const segmentText = wrapper.findAll('[data-reka-date-field-segment]').map((w: DOMWrapper<Element>) => w.text()).join('')
    expect(segmentText).toBe('6/2024')
  })

  it('granularity=year field-mode segments show only year, with no leftover separator', async () => {
    wrapper = await mountSuspended(DatePicker, { props: { granularity: 'year', modelValue: new CalendarDate(2024, 6, 15) } })

    const labels = wrapper.findAll('[role="spinbutton"]').map((w: DOMWrapper<Element>) => w.attributes('aria-label')?.trim().replace(',', ''))
    expect(labels).toEqual(['year'])

    const segmentText = wrapper.findAll('[data-reka-date-field-segment]').map((w: DOMWrapper<Element>) => w.text()).join('')
    expect(segmentText).toBe('2024')
  })

  it('granularity=month formats the button-mode trigger as month + year', async () => {
    wrapper = await mountSuspended(DatePicker, {
      props: { granularity: 'month', triggerMode: 'button', modelValue: new CalendarDate(2024, 6, 15) },
    })
    expect(wrapper.text()).toContain('June 2024')
  })

  it('day granularity (default) shows no time section', async () => {
    wrapper = await mountSuspended(DatePicker, { props: { modelValue: new CalendarDate(2024, 6, 15) } })
    await openCalendar(wrapper)
    expect(document.body.querySelector('input')).toBeFalsy()
  })

  it('granularity=minute shows hour and minute steppers alongside the day grid, in the locale\'s own hour cycle (12-hour for en-US)', async () => {
    wrapper = await mountSuspended(DatePicker, {
      props: { granularity: 'minute', modelValue: new CalendarDateTime(2024, 6, 15, 14, 30) },
    })
    await openCalendar(wrapper)

    expect(document.body.querySelectorAll('td button').length).toBeGreaterThan(0)
    const inputs = Array.from(document.body.querySelectorAll('input')) as HTMLInputElement[]
    expect(inputs).toHaveLength(2)
    // 14:30 in en-US's default 12-hour cycle displays as "02" (2 PM), not "14".
    expect(inputs[0]!.value).toBe('02')
    expect(inputs[1]!.value).toBe('30')
  })

  it('granularity=hour shows only an hour stepper, plus an AM/PM toggle under the default 12-hour locale', async () => {
    wrapper = await mountSuspended(DatePicker, {
      props: { granularity: 'hour', modelValue: new CalendarDateTime(2024, 6, 15, 14, 30) },
    })
    await openCalendar(wrapper)

    const inputs = Array.from(document.body.querySelectorAll('input')) as HTMLInputElement[]
    expect(inputs).toHaveLength(1)
    expect(inputs[0]!.value).toBe('02')
    const meridiemButton = Array.from(document.body.querySelectorAll('button')).find(b => b.textContent?.trim() === 'PM')
    expect(meridiemButton).toBeTruthy()
  })

  it('hourCycle="24" forces the stepper to 0-23 with no AM/PM toggle, even under a 12-hour locale', async () => {
    wrapper = await mountSuspended(DatePicker, {
      props: { granularity: 'hour', hourCycle: 24, modelValue: new CalendarDateTime(2024, 6, 15, 14, 30) },
    })
    await openCalendar(wrapper)

    const input = document.body.querySelector('input') as HTMLInputElement
    expect(input.value).toBe('14')
    const meridiemButton = Array.from(document.body.querySelectorAll('button')).find(b => b.textContent?.trim() === 'PM' || b.textContent?.trim() === 'AM')
    expect(meridiemButton).toBeFalsy()
  })

  it('hourCycle="12" forces a 12-hour stepper even under a 24-hour locale', async () => {
    wrapper = await mountSuspended(DatePicker, {
      props: { granularity: 'hour', hourCycle: 12, locale: 'de-DE', modelValue: new CalendarDateTime(2024, 6, 15, 14, 30) },
    })
    await openCalendar(wrapper)

    const input = document.body.querySelector('input') as HTMLInputElement
    expect(input.value).toBe('02')
  })

  it('toggling AM/PM changes the emitted hour by exactly 12 without changing the displayed hour', async () => {
    wrapper = await mountSuspended(DatePicker, {
      props: { granularity: 'hour', modelValue: new CalendarDateTime(2024, 6, 15, 14, 30) },
    })
    await openCalendar(wrapper)

    const meridiemButton = Array.from(document.body.querySelectorAll('button')).find(b => b.textContent?.trim() === 'PM')
    await clickAndWait(meridiemButton as HTMLElement)

    const value = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as CalendarDateTime
    expect(value.hour).toBe(2)
    expect(document.body.querySelector('input')?.getAttribute('value')).not.toBe('14')
  })

  it('the hour stepper wraps past its boundary instead of getting stuck (12-hour clock: 12 -> 1)', async () => {
    wrapper = await mountSuspended(DatePicker, {
      props: { granularity: 'hour', modelValue: new CalendarDateTime(2024, 6, 15, 0, 0) },
    })
    await openCalendar(wrapper)

    const input = document.body.querySelector('input') as HTMLInputElement
    expect(input.value).toBe('12') // midnight displays as 12 AM

    const increment = document.body.querySelector('button[aria-label="Increment"]')
    await clickAndWait(increment as HTMLElement)

    const value = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as CalendarDateTime
    expect(value.hour).toBe(1) // wrapped past 12 to 1 AM, not stuck
  })

  it('granularity=minute field-mode segments include hour and minute alongside day/month/year', async () => {
    wrapper = await mountSuspended(DatePicker, {
      props: { granularity: 'minute', modelValue: new CalendarDateTime(2024, 6, 15, 14, 30) },
    })
    const labels = wrapper.findAll('[role="spinbutton"]').map((w: DOMWrapper<Element>) => w.attributes('aria-label')?.trim().replace(',', ''))
    expect(labels).toEqual(expect.arrayContaining(['day', 'month', 'year', 'hour', 'minute']))
  })

  it('clicking a day preserves an already-set time', async () => {
    wrapper = await mountSuspended(DatePicker, {
      props: { granularity: 'minute', modelValue: new CalendarDateTime(2024, 6, 15, 14, 30) },
    })
    await openCalendar(wrapper)

    await clickAndWait(dayButton('20'))

    const value = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as CalendarDateTime
    expect(value.day).toBe(20)
    expect(value.hour).toBe(14)
    expect(value.minute).toBe(30)
  })

  it('adjusting the hour stepper commits a value without closing the popover', async () => {
    wrapper = await mountSuspended(DatePicker, {
      props: { granularity: 'minute', modelValue: new CalendarDateTime(2024, 6, 15, 14, 30) },
    })
    await openCalendar(wrapper)

    const hourIncrement = document.body.querySelectorAll('button[aria-label="Increment"]')[0]
    await clickAndWait(hourIncrement as HTMLElement)

    const value = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as CalendarDateTime
    expect(value.hour).toBe(15)
    expect(value.day).toBe(15)
    expect(document.body.querySelectorAll('td button').length).toBeGreaterThan(0)
  })

  it('adjusting the time before any day is picked commits a value seeded from today', async () => {
    wrapper = await mountSuspended(DatePicker, { props: { granularity: 'hour' } })
    await openCalendar(wrapper)

    const hourIncrement = document.body.querySelector('button[aria-label="Increment"]')
    await clickAndWait(hourIncrement as HTMLElement)

    const value = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as CalendarDateTime
    expect(value).toBeTruthy()
    expect('hour' in value).toBe(true)
  })

  it('the Done button closes the popover', async () => {
    wrapper = await mountSuspended(DatePicker, {
      props: { granularity: 'minute', modelValue: new CalendarDateTime(2024, 6, 15, 14, 30) },
    })
    await openCalendar(wrapper)
    expect(document.body.querySelectorAll('td button').length).toBeGreaterThan(0)

    const doneButton = Array.from(document.body.querySelectorAll('button')).find(b => b.textContent?.trim() === 'Done')
    await clickAndWait(doneButton as HTMLElement)

    expect(document.body.querySelectorAll('td button').length).toBe(0)
  })

  it('closeOnSelect=false hides the Done button', async () => {
    wrapper = await mountSuspended(DatePicker, {
      props: { granularity: 'minute', closeOnSelect: false, modelValue: new CalendarDateTime(2024, 6, 15, 14, 30) },
    })
    await openCalendar(wrapper)

    const doneButton = Array.from(document.body.querySelectorAll('button')).find(b => b.textContent?.trim() === 'Done')
    expect(doneButton).toBeUndefined()
  })

  it('minuteStep controls the minute stepper click increment', async () => {
    wrapper = await mountSuspended(DatePicker, {
      props: { granularity: 'minute', minuteStep: 15, modelValue: new CalendarDateTime(2024, 6, 15, 14, 0) },
    })
    await openCalendar(wrapper)

    const minuteIncrement = document.body.querySelectorAll('button[aria-label="Increment"]')[1]
    await clickAndWait(minuteIncrement as HTMLElement)

    const value = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as CalendarDateTime
    expect(value.minute).toBe(15)
  })
})
