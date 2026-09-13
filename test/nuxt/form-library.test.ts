import type { DOMWrapper } from '@vue/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, describe, expect, it } from 'vitest'
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
    const file = new File(['proof'], 'proof.txt', { type: 'text/plain' })
    const upload = wrapper.find('#integration-files').element.parentElement!
    upload.querySelector('button')!.dispatchEvent(Object.assign(new Event('drop', { bubbles: true, cancelable: true }), { dataTransfer: { files: [file] } }))
    await wrapper.find('form').trigger('submit')
    await expect.poll(() => wrapper!.emitted('submitted')?.length).toBe(1)
    expect(wrapper.emitted('submitted')![0]).toEqual([{ email: 'reader@example.com', plan: 0, files: [file] }])
    expect(state().plan).toBe(0)
    expect(Array.from((wrapper.find('#integration-files').element as HTMLInputElement).files!, file => file.name)).toEqual(['proof.txt'])

    wrapper.find('form').element.reset()
    await expect.poll(state).toEqual({ email: '', plan: 0, files: [], touched: false })
    expect(wrapper.findAll('[role="alert"]')).toHaveLength(0)
    expect(wrapper.find('#integration-email').attributes('aria-invalid')).toBeUndefined()
    expect(wrapper.find('#integration-email').attributes('aria-describedby')).toBe('integration-email-hint')
    expect((wrapper.find('#integration-files').element as HTMLInputElement).files).toHaveLength(0)
    expect(wrapper.findAll('li')).toHaveLength(0)
  })
})
