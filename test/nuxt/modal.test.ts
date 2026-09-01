import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, describe, expect, it } from 'vitest'
import Modal from '../../src/runtime/components/Modal.vue'

function macrotask() {
  return new Promise(resolve => setTimeout(resolve, 50))
}

// DialogContent renders through a real Teleport to document.body (not
// stubbed in this test environment), so its content is invisible to
// `wrapper.find`/`findAll` - query document.body directly instead. Nothing
// auto-unmounts a teleported node between tests here, so each test unmounts
// its own wrapper - otherwise a later test's document.body query can match
// a previous test's stale, already-torn-down button.
let wrapper: Awaited<ReturnType<typeof mountSuspended>> | undefined

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

describe('modal', () => {
  it('renders the close button as a real, focusable button with an accessible label', async () => {
    wrapper = await mountSuspended(Modal, { props: { modelValue: true, title: 'Delete item' } })

    const closeButton = document.body.querySelector<HTMLButtonElement>('button[aria-label="Close"]')
    expect(closeButton).toBeTruthy()
    expect(closeButton!.tagName).toBe('BUTTON')
  })

  it('closing via the close button emits update:modelValue with false', async () => {
    wrapper = await mountSuspended(Modal, { props: { modelValue: true, title: 'Delete item' } })

    const closeButton = document.body.querySelector<HTMLButtonElement>('button[aria-label="Close"]')!
    closeButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await wrapper.vm.$nextTick()
    await macrotask()

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
  })

  it('forwards escapeKeyDown so a consumer can preventDefault it', async () => {
    wrapper = await mountSuspended(Modal, { props: { modelValue: true, title: 'Delete item' } })

    const dialog = document.body.querySelector('[role=dialog]')!
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await wrapper.vm.$nextTick()

    const emitted = wrapper.emitted('escapeKeyDown')
    expect(emitted).toBeTruthy()
    expect(emitted![0]![0]).toBeInstanceOf(Event)
  })

  it('applies the full-viewport layout instead of the centered card when fullscreen is set', async () => {
    wrapper = await mountSuspended(Modal, { props: { modelValue: true, title: 'Delete item', fullscreen: true } })

    const dialog = document.body.querySelector('[role=dialog]')!
    expect(dialog.className).toContain('rounded-none')
    expect(dialog.className).not.toContain('max-w-md')
  })

  it('renders no close button when close is false', async () => {
    wrapper = await mountSuspended(Modal, { props: { modelValue: true, title: 'Delete item', close: false } })

    const closeButton = document.body.querySelector<HTMLButtonElement>('button[aria-label="Close"]')
    expect(closeButton).toBeFalsy()
  })

  it('still emits escapeKeyDown when dismissible is false, but does not close', async () => {
    wrapper = await mountSuspended(Modal, { props: { modelValue: true, title: 'Confirm', dismissible: false } })

    const dialog = document.body.querySelector('[role=dialog]')!
    // cancelable: true matters here - a real browser keydown is cancelable
    // by default, but the synthetic KeyboardEvent above (deliberately not
    // cancelable, since that test never calls preventDefault) is not. A
    // preventDefault() call on a non-cancelable event is a silent no-op per
    // spec, which would make this test pass for the wrong reason.
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('escapeKeyDown')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('non-modal + dismissible=false: focusing an outside element does not close it either - regression, this used to only guard pointerDownOutside/escapeKeyDown', async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const outside = document.createElement('button')
    outside.id = 'outside'
    outside.textContent = 'Outside'
    container.appendChild(outside)

    wrapper = await mountSuspended(Modal, {
      attachTo: container,
      props: { modelValue: true, title: 'Non-modal', modal: false, dismissible: false },
    })
    await new Promise(resolve => setTimeout(resolve, 50))

    outside.focus()
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(document.body.querySelector('[role=dialog]')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    container.remove()
  })

  it('body grows to fill remaining space - regression: without flex-1, the footer sat right after a short body instead of pinned to the bottom once fullscreen gave the dialog a real fixed height', async () => {
    wrapper = await mountSuspended(Modal, { props: { modelValue: true, title: 'Fullscreen', fullscreen: true } })

    const body = document.body.querySelector('.overflow-y-auto')!
    expect(body.className).toContain('flex-1')
  })

  it('renders the content slot in place of header/body/footer entirely', async () => {
    wrapper = await mountSuspended(Modal, {
      props: { modelValue: true, title: 'Ignored' },
      slots: { content: () => 'Fully custom content', header: () => 'Ignored header', footer: () => 'Ignored footer' },
    })

    const dialog = document.body.querySelector('[role=dialog]')!
    expect(dialog.textContent).toBe('Fully custom content')
  })

  it('replaces the close icon via the close-icon slot', async () => {
    wrapper = await mountSuspended(Modal, {
      props: { modelValue: true, title: 'Delete item' },
      slots: { 'close-icon': '<span class="my-close-icon">x</span>' },
    })

    expect(document.body.querySelector('.my-close-icon')).toBeTruthy()
    expect(document.body.querySelector('.iconify')).toBeFalsy()
  })

  it('maximizable renders a toggle button that flips fullscreen and emits update:fullscreen', async () => {
    wrapper = await mountSuspended(Modal, { props: { modelValue: true, title: 'Report', maximizable: true } })

    const maximizeButton = document.body.querySelector<HTMLButtonElement>('button[aria-label="Maximize"]')!
    expect(maximizeButton).toBeTruthy()

    const dialog = document.body.querySelector('[role=dialog]')!
    expect(dialog.className).not.toContain('rounded-none')

    maximizeButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await wrapper.vm.$nextTick()

    expect(dialog.className).toContain('rounded-none')
    expect(wrapper.emitted('update:fullscreen')?.at(-1)).toEqual([true])
    expect(document.body.querySelector('button[aria-label="Minimize"]')).toBeTruthy()
  })

  it('replaces the maximize/minimize icons via their own slots', async () => {
    wrapper = await mountSuspended(Modal, {
      props: { modelValue: true, title: 'Report', maximizable: true },
      slots: { 'maximize-icon': '<span class="my-maximize-icon">+</span>' },
    })

    expect(document.body.querySelector('.my-maximize-icon')).toBeTruthy()
  })

  it('does not render a maximize button when maximizable is unset', async () => {
    wrapper = await mountSuspended(Modal, { props: { modelValue: true, title: 'Delete item' } })

    expect(document.body.querySelector('button[aria-label="Maximize"]')).toBeFalsy()
  })

  it('modal="false" does not hide the rest of the page from assistive tech, unlike the modal default', async () => {
    wrapper = await mountSuspended(Modal, { props: { modelValue: true, title: 'Non-modal', modal: false } })

    expect(document.getElementById('__nuxt')?.getAttribute('aria-hidden')).toBeNull()
  })

  it('is modal (hides the rest of the page) by default', async () => {
    wrapper = await mountSuspended(Modal, { props: { modelValue: true, title: 'Modal' } })

    expect(document.getElementById('__nuxt')?.getAttribute('aria-hidden')).toBe('true')
  })

  it('renders no overlay element when overlay is false', async () => {
    const withOverlay = await mountSuspended(Modal, { props: { modelValue: true, title: 'A' } })
    expect(document.body.querySelector('[data-state="open"].bg-black\\/50')).toBeTruthy()
    withOverlay.unmount()

    wrapper = await mountSuspended(Modal, { props: { modelValue: true, title: 'B', overlay: false } })
    expect(document.body.querySelector('.bg-black\\/50')).toBeFalsy()
  })

  it('strips the animation classes entirely when transition is false', async () => {
    const withTransition = await mountSuspended(Modal, { props: { modelValue: true, title: 'A' } })
    expect(document.body.querySelector('[role=dialog]')!.className).toContain('data-[state=open]:animate-in')
    withTransition.unmount()

    wrapper = await mountSuspended(Modal, { props: { modelValue: true, title: 'No transition', transition: false } })
    const dialog = document.body.querySelector('[role=dialog]')!
    expect(dialog.className).not.toContain('animate-in')
    expect(dialog.className).not.toContain('animate-out')
  })

  it('supports a modal nested inside another modal, opened independently', async () => {
    wrapper = await mountSuspended({
      components: { Modal },
      data: () => ({ outer: true, inner: false }),
      template: `
        <Modal v-model="outer" title="Outer">
          <template #body>
            <button id="open-inner" @click="inner = true">Open inner</button>
          </template>
        </Modal>
        <Modal v-model="inner" title="Inner" />
      `,
    })

    expect(document.body.querySelectorAll('[role=dialog]')).toHaveLength(1)

    document.getElementById('open-inner')!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await wrapper.vm.$nextTick()

    const dialogs = document.body.querySelectorAll('[role=dialog]')
    expect(dialogs).toHaveLength(2)
    expect(Array.from(dialogs).map(d => d.textContent)).toContain('Inner')
  })
})
