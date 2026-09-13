import type { DOMWrapper } from '@vue/test-utils'
import { CalendarDate } from '@internationalized/date'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, describe, expect, it } from 'vitest'
import DatePicker from '../../src/runtime/components/DatePicker.vue'
import VeeValidateForm from './fixtures/VeeValidateForm.vue'

let wrapper: Awaited<ReturnType<typeof mountSuspended>> | undefined
afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

function state() {
  return JSON.parse(wrapper!.find('[data-test="state"]').text())
}

describe('vee-validate integration', () => {
  it('validates an empty selection and preserves numeric zero through a user selection', async () => {
    wrapper = await mountSuspended(VeeValidateForm)
    await wrapper.find('[aria-label="Clear"]').trigger('click')
    await expect.poll(() => state().plan).toBeUndefined()
    await wrapper.find('form').trigger('submit')
    await expect.poll(() => wrapper!.find('#integration-plan-error').text()).toBe('Choose a plan')

    await wrapper.find('[aria-haspopup="listbox"]').trigger('click')
    await expect.poll(() => Array.from(document.body.querySelectorAll('[role="option"]')).some(option => option.textContent?.trim() === 'Free')).toBe(true)
    const free = Array.from(document.body.querySelectorAll<HTMLElement>('[role="option"]')).find(option => option.textContent?.trim() === 'Free')!
    free.click()
    await expect.poll(() => state().plan).toBe(0)
    await expect.poll(() => wrapper!.find('#integration-plan-error').exists()).toBe(false)
  })

  it('associates library errors with controls and forwards native blur to touched state', async () => {
    wrapper = await mountSuspended(VeeValidateForm)
    await wrapper.find('form').trigger('submit')
    await expect.poll(() => wrapper!.findAll('[role="alert"]').map((error: DOMWrapper<Element>) => error.text())).toEqual(['Enter a valid email', 'Attach a file'])
    expect(wrapper.find('#integration-email').attributes('aria-invalid')).toBe('true')
    expect(wrapper.find('#integration-email').attributes('aria-describedby')).toBe('integration-email-hint integration-email-error')
    expect(wrapper.find('#integration-files').attributes('aria-describedby')).toBe('integration-files-error')
    expect(wrapper.emitted('submitted')).toBeUndefined()

    await wrapper.find('#integration-email').setValue('reader@example.com')
    await wrapper.find('#integration-email').trigger('blur')
    await expect.poll(() => state().touched).toBe(true)
    await expect.poll(() => wrapper!.find('#integration-email').attributes('aria-invalid')).toBeUndefined()
  })

  it('submits typed model values and restores library initial values on native form reset', async () => {
    wrapper = await mountSuspended(VeeValidateForm)
    await wrapper.find('#integration-email').setValue('reader@example.com')
    const quantityInput = wrapper.find('#integration-quantity')
    await quantityInput.trigger('focus')
    await quantityInput.setValue('2.5')
    await quantityInput.trigger('blur')
    await wrapper.find('button[aria-label="Date picker"]').trigger('click')
    await expect.poll(() => Array.from(document.body.querySelectorAll('td button')).some(button => button.textContent?.trim() === '20')).toBe(true)
    const day = Array.from(document.body.querySelectorAll<HTMLButtonElement>('td button')).find(button => button.textContent?.trim() === '20')!
    day.click()
    await expect.poll(() => state().date).toBe('2024-01-20')
    const file = new File(['proof'], 'proof.txt', { type: 'text/plain' })
    const upload = wrapper.find('#integration-files').element.parentElement!
    upload.querySelector('button')!.dispatchEvent(Object.assign(new Event('drop', { bubbles: true, cancelable: true }), { dataTransfer: { files: [file] } }))
    await wrapper.find('form').trigger('submit')
    await expect.poll(() => wrapper!.emitted('submitted')?.length).toBe(1)
    expect(wrapper.emitted('submitted')![0]).toEqual([{ email: 'reader@example.com', plan: 0, files: [file], date: new CalendarDate(2024, 1, 20), quantity: 2.5 }])
    expect(state().plan).toBe(0)
    expect(Array.from((wrapper.find('#integration-files').element as HTMLInputElement).files!, file => file.name)).toEqual(['proof.txt'])

    wrapper.find('form').element.reset()
    await expect.poll(state).toEqual({ email: '', plan: 0, files: [], date: '2024-01-15', quantity: 1, touched: false, quantityTouched: false })
    expect(wrapper.findAll('[role="alert"]')).toHaveLength(0)
    expect(wrapper.find('#integration-email').attributes('aria-invalid')).toBeUndefined()
    expect(wrapper.find('#integration-email').attributes('aria-describedby')).toBe('integration-email-hint')
    expect((wrapper.find('#integration-files').element as HTMLInputElement).files).toHaveLength(0)
    expect(wrapper.findAll('li')).toHaveLength(0)
  })

  it('validates a cleared date and restores the typed initial date on library reset', async () => {
    wrapper = await mountSuspended(VeeValidateForm)
    const dateField = wrapper.findComponent(DatePicker)
    expect(dateField.find('input[name="date"]').element.getAttribute('value')).toBe('2024-01-15')
    await dateField.find('[aria-label="Clear"]').trigger('click')
    await expect.poll(() => state().date).toBeUndefined()
    await expect.poll(() => wrapper!.find('#integration-date-error').text()).toBe('Choose a date')
    expect(dateField.find('[aria-invalid="true"]').attributes('aria-describedby')).toBe('integration-date-error')
    expect((dateField.find('input[name="date"]').element as HTMLInputElement).value).toBe('')

    wrapper.find('form').element.reset()
    await expect.poll(() => state().date).toBe('2024-01-15')
    await expect.poll(() => wrapper!.find('#integration-date-error').exists()).toBe(false)
    expect(dateField.find('[aria-invalid="true"]').exists()).toBe(false)
    expect((dateField.find('input[name="date"]').element as HTMLInputElement).value).toBe('2024-01-15')
  })

  it('commits numeric edits to the library, validates empty values, and resets touched state', async () => {
    wrapper = await mountSuspended(VeeValidateForm)
    const input = wrapper.find('#integration-quantity')
    await input.trigger('focus')
    await input.setValue('2.5')
    await input.trigger('blur')
    await expect.poll(() => state().quantity).toBe(2.5)
    expect(state().quantityTouched).toBe(true)

    await input.trigger('focus')
    await input.setValue('')
    await input.trigger('blur')
    await expect.poll(() => state().quantity).toBeUndefined()
    await expect.poll(() => wrapper!.find('#integration-quantity-error').text()).toBe('Enter a positive quantity')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('aria-describedby')).toBe('integration-quantity-error')

    wrapper.find('form').element.reset()
    await expect.poll(() => state().quantity).toBe(1)
    expect(state().quantityTouched).toBe(false)
    expect((input.element as HTMLInputElement).value).toBe('1')
    expect(wrapper.find('#integration-quantity-error').exists()).toBe(false)
    expect(input.attributes('aria-invalid')).toBeUndefined()
  })
})
