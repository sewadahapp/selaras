import type { DateValue } from '@internationalized/date'
import { CalendarDate } from '@internationalized/date'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import Calendar from '../../src/runtime/components/Calendar.vue'

const january = new CalendarDate(2024, 1, 15)

describe('calendar', () => {
  it('renders an inline date grid and updates uncontrolled selection', async () => {
    const wrapper = await mountSuspended(Calendar, { props: { defaultPlaceholder: january } })
    const day = wrapper.find('[data-value="2024-01-18"]')

    expect(wrapper.find('[role="application"]').exists()).toBe(true)
    expect(day.attributes('aria-label')).toBeTruthy()
    await day.trigger('click')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]?.toString()).toBe('2024-01-18')
    expect(day.attributes('data-selected')).toBe('true')
    wrapper.unmount()
  })

  it('keeps a controlled selection when its parent ignores the update', async () => {
    const wrapper = await mountSuspended(Calendar, { props: { modelValue: january } })
    await wrapper.find('[data-value="2024-01-18"]').trigger('click')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]?.toString()).toBe('2024-01-18')
    expect(wrapper.find('[data-value="2024-01-15"]').attributes('data-selected')).toBe('true')
    wrapper.unmount()
  })

  it('keeps an explicitly controlled empty selection when its parent ignores the update', async () => {
    const wrapper = await mountSuspended(Calendar, { props: { modelValue: undefined, defaultPlaceholder: january } })
    await wrapper.find('[data-value="2024-01-18"]').trigger('click')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]?.toString()).toBe('2024-01-18')
    expect(wrapper.find('[data-value="2024-01-18"]').attributes('data-selected')).toBeUndefined()
    wrapper.unmount()
  })

  it('navigates its displayed month independently from selection', async () => {
    const wrapper = await mountSuspended(Calendar, { props: { defaultValue: january } })
    await wrapper.find('button[aria-label="Next month"]').trigger('click')
    await nextTick()

    const displayedMonth = wrapper.emitted('update:placeholder')?.[0]?.[0] as DateValue | undefined
    expect(displayedMonth?.month).toBe(2)
    expect(wrapper.find('[data-value="2024-02-18"]').exists()).toBe(true)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('can display meeting days without allowing a readonly selection change', async () => {
    const wrapper = await mountSuspended(Calendar, { props: { defaultPlaceholder: january, readonly: true } })
    await wrapper.find('[data-value="2024-01-18"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('provides a separate day-details area for interactive meeting content', async () => {
    const wrapper = await mountSuspended(Calendar, {
      props: { defaultPlaceholder: january },
      slots: {
        'day': ({ dayValue }: { dayValue: string }) => h('span', dayValue),
        'day-details': ({ date }: { date: DateValue }) => date.toString() === '2024-01-18'
          ? h('a', { href: '/meeting' }, 'Design review')
          : null,
      },
    })
    const dateCell = wrapper.find('[data-value="2024-01-18"]').element.closest('td')!
    const link = dateCell.querySelector('a')!

    expect(dateCell.querySelector('button')?.contains(link)).toBe(false)
    expect(link.getAttribute('href')).toBe('/meeting')
    expect(dateCell.querySelector('button')?.getAttribute('aria-describedby')).toBe(dateCell.querySelector('div')?.id)
    link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })
})
