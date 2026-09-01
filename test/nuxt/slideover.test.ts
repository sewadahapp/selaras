import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, describe, expect, it } from 'vitest'
import Slideover from '../../src/runtime/components/Slideover.vue'

function macrotask() {
  return new Promise(resolve => setTimeout(resolve, 50))
}

// DialogContent renders through a real Teleport to document.body (not
// stubbed in this test environment), so its content is invisible to
// `wrapper.find`/`findAll` - query document.body directly instead. Each
// test unmounts its own wrapper so a later test's document.body query
// can't match a previous test's stale, already-torn-down node.
let wrapper: Awaited<ReturnType<typeof mountSuspended>> | undefined

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

describe('slideover', () => {
  it('renders the close button as a real, focusable button with an accessible label', async () => {
    wrapper = await mountSuspended(Slideover, { props: { modelValue: true, title: 'Filters' } })

    const closeButton = document.body.querySelector<HTMLButtonElement>('button[aria-label="Close"]')
    expect(closeButton).toBeTruthy()
    expect(closeButton!.tagName).toBe('BUTTON')
  })

  it('closing via the close button emits update:modelValue with false', async () => {
    wrapper = await mountSuspended(Slideover, { props: { modelValue: true, title: 'Filters' } })

    const closeButton = document.body.querySelector<HTMLButtonElement>('button[aria-label="Close"]')!
    closeButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await wrapper.vm.$nextTick()
    await macrotask()

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
  })

  it('forwards escapeKeyDown so a consumer can preventDefault it', async () => {
    wrapper = await mountSuspended(Slideover, { props: { modelValue: true, title: 'Filters' } })

    const dialog = document.body.querySelector('[role=dialog]')!
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await wrapper.vm.$nextTick()

    const emitted = wrapper.emitted('escapeKeyDown')
    expect(emitted).toBeTruthy()
    expect(emitted![0]![0]).toBeInstanceOf(Event)
  })

  it('renders no close button when close is false', async () => {
    wrapper = await mountSuspended(Slideover, { props: { modelValue: true, title: 'Filters', close: false } })

    expect(document.body.querySelector<HTMLButtonElement>('button[aria-label="Close"]')).toBeFalsy()
  })

  it('still emits escapeKeyDown when dismissible is false, but does not close', async () => {
    wrapper = await mountSuspended(Slideover, { props: { modelValue: true, title: 'Filters', dismissible: false } })

    const dialog = document.body.querySelector('[role=dialog]')!
    // cancelable: true matters here - see modal.test.ts's own note on why.
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('escapeKeyDown')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('non-modal + dismissible=false: focusing an outside element does not close it either', async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const outside = document.createElement('button')
    outside.id = 'outside'
    outside.textContent = 'Outside'
    container.appendChild(outside)

    wrapper = await mountSuspended(Slideover, {
      attachTo: container,
      props: { modelValue: true, title: 'Non-modal', modal: false, dismissible: false },
    })
    await macrotask()

    outside.focus()
    await wrapper.vm.$nextTick()
    await macrotask()

    expect(document.body.querySelector('[role=dialog]')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    container.remove()
  })

  it('renders the content slot in place of header/body/footer entirely', async () => {
    wrapper = await mountSuspended(Slideover, {
      props: { modelValue: true, title: 'Ignored' },
      slots: { content: () => 'Fully custom content', header: () => 'Ignored header', footer: () => 'Ignored footer' },
    })

    const dialog = document.body.querySelector('[role=dialog]')!
    expect(dialog.textContent).toBe('Fully custom content')
  })

  it('replaces the close icon via the close-icon slot', async () => {
    wrapper = await mountSuspended(Slideover, {
      props: { modelValue: true, title: 'Filters' },
      slots: { 'close-icon': '<span class="my-close-icon">x</span>' },
    })

    expect(document.body.querySelector('.my-close-icon')).toBeTruthy()
    expect(document.body.querySelector('.iconify')).toBeFalsy()
  })

  it.each([
    ['top', 'top-0'],
    ['bottom', 'bottom-0'],
    ['left', 'left-0'],
    ['right', 'right-0'],
  ] as const)('side=%s positions the panel against that edge', async (side, expectedClass) => {
    wrapper = await mountSuspended(Slideover, { props: { modelValue: true, title: 'Filters', side } })

    const dialog = document.body.querySelector('[role=dialog]')!
    expect(dialog.className).toContain(expectedClass)
  })

  it('inset floats the panel with rounded corners instead of sitting flush', async () => {
    wrapper = await mountSuspended(Slideover, { props: { modelValue: true, title: 'Filters', inset: true } })

    const dialog = document.body.querySelector('[role=dialog]')!
    expect(dialog.className).toContain('rounded-[var(--ui-radius-lg)]')
  })

  it('modal="false" does not hide the rest of the page from assistive tech, unlike the modal default', async () => {
    wrapper = await mountSuspended(Slideover, { props: { modelValue: true, title: 'Non-modal', modal: false } })

    expect(document.getElementById('__nuxt')?.getAttribute('aria-hidden')).toBeNull()
  })

  it('is modal (hides the rest of the page) by default', async () => {
    wrapper = await mountSuspended(Slideover, { props: { modelValue: true, title: 'Modal' } })

    expect(document.getElementById('__nuxt')?.getAttribute('aria-hidden')).toBe('true')
  })

  it('renders no overlay element when overlay is false', async () => {
    const withOverlay = await mountSuspended(Slideover, { props: { modelValue: true, title: 'A' } })
    expect(document.body.querySelector('[data-state="open"].bg-black\\/50')).toBeTruthy()
    withOverlay.unmount()

    wrapper = await mountSuspended(Slideover, { props: { modelValue: true, title: 'B', overlay: false } })
    expect(document.body.querySelector('.bg-black\\/50')).toBeFalsy()
  })

  it('strips the animation classes entirely when transition is false', async () => {
    const withTransition = await mountSuspended(Slideover, { props: { modelValue: true, title: 'A' } })
    expect(document.body.querySelector('[role=dialog]')!.className).toContain('data-[state=open]:animate-in')
    withTransition.unmount()

    wrapper = await mountSuspended(Slideover, { props: { modelValue: true, title: 'No transition', transition: false } })
    const dialog = document.body.querySelector('[role=dialog]')!
    expect(dialog.className).not.toContain('animate-in')
    expect(dialog.className).not.toContain('animate-out')
  })
})
