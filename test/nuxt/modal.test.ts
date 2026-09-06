import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, describe, expect, it } from 'vitest'
import { h } from 'vue'
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
    wrapper = await mountSuspended(Modal, { props: { open: true, title: 'Delete item', description: 'Delete item' } })

    const closeButton = document.body.querySelector<HTMLButtonElement>('button[aria-label="Close"]')
    expect(closeButton).toBeTruthy()
    expect(closeButton!.tagName).toBe('BUTTON')
  })

  it('closing via the close button emits update:open with false', async () => {
    wrapper = await mountSuspended(Modal, { props: { open: true, title: 'Delete item', description: 'Delete item' } })

    const closeButton = document.body.querySelector<HTMLButtonElement>('button[aria-label="Close"]')!
    closeButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await wrapper.vm.$nextTick()
    await macrotask()

    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
  })

  it('forwards escapeKeyDown so a consumer can preventDefault it', async () => {
    wrapper = await mountSuspended(Modal, { props: { open: true, title: 'Delete item', description: 'Delete item' } })

    const dialog = document.body.querySelector('[role=dialog]')!
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await wrapper.vm.$nextTick()

    const emitted = wrapper.emitted('escapeKeyDown')
    expect(emitted).toBeTruthy()
    expect(emitted![0]![0]).toBeInstanceOf(Event)
  })

  it('applies the full-viewport layout instead of the centered card when fullscreen is set', async () => {
    wrapper = await mountSuspended(Modal, { props: { open: true, title: 'Delete item', description: 'Delete item', fullscreen: true } })

    const dialog = document.body.querySelector('[role=dialog]')!
    expect(dialog.className).toContain('rounded-none')
    expect(dialog.className).not.toContain('max-w-md')
  })

  it('renders no close button when close is false', async () => {
    wrapper = await mountSuspended(Modal, { props: { open: true, title: 'Delete item', description: 'Delete item', close: false } })

    const closeButton = document.body.querySelector<HTMLButtonElement>('button[aria-label="Close"]')
    expect(closeButton).toBeFalsy()
  })

  it('still emits escapeKeyDown when dismissible is false, but does not close', async () => {
    wrapper = await mountSuspended(Modal, { props: { open: true, title: 'Confirm', description: 'Confirm', dismissible: false } })

    const dialog = document.body.querySelector('[role=dialog]')!
    // cancelable: true matters here - a real browser keydown is cancelable
    // by default, but the synthetic KeyboardEvent above (deliberately not
    // cancelable, since that test never calls preventDefault) is not. A
    // preventDefault() call on a non-cancelable event is a silent no-op per
    // spec, which would make this test pass for the wrong reason.
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('escapeKeyDown')).toBeTruthy()
    expect(wrapper.emitted('update:open')).toBeUndefined()
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
      props: { open: true, title: 'Non-modal', description: 'Non-modal', modal: false, dismissible: false },
    })
    await new Promise(resolve => setTimeout(resolve, 50))

    outside.focus()
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(document.body.querySelector('[role=dialog]')).toBeTruthy()
    expect(wrapper.emitted('update:open')).toBeUndefined()

    container.remove()
  })

  it('body grows to fill remaining space - regression: without flex-1, the footer sat right after a short body instead of pinned to the bottom once fullscreen gave the dialog a real fixed height', async () => {
    wrapper = await mountSuspended(Modal, { props: { open: true, title: 'Fullscreen', description: 'Fullscreen', fullscreen: true } })

    const body = document.body.querySelector('.overflow-y-auto')!
    expect(body.className).toContain('flex-1')
  })

  it('renders the content slot in place of header/body/footer entirely, but still registers title/description for a11y', async () => {
    wrapper = await mountSuspended(Modal, {
      props: { open: true, title: 'Custom dialog', description: 'A dialog with fully custom content' },
      slots: { content: () => 'Fully custom content', header: () => 'Ignored header', footer: () => 'Ignored footer' },
    })

    const dialog = document.body.querySelector('[role=dialog]')!
    expect(dialog.textContent).not.toContain('Ignored header')
    expect(dialog.textContent).not.toContain('Ignored footer')

    const titleId = dialog.getAttribute('aria-labelledby')
    expect(document.getElementById(titleId!)?.textContent).toBe('Custom dialog')
  })

  it('replaces the close icon via the close-icon slot', async () => {
    wrapper = await mountSuspended(Modal, {
      props: { open: true, title: 'Delete item', description: 'Delete item' },
      slots: { 'close-icon': '<span class="my-close-icon">x</span>' },
    })

    expect(document.body.querySelector('.my-close-icon')).toBeTruthy()
    expect(document.body.querySelector('.iconify')).toBeFalsy()
  })

  it('maximizable renders a toggle button that flips fullscreen and emits update:fullscreen', async () => {
    wrapper = await mountSuspended(Modal, { props: { open: true, title: 'Report', description: 'Report', maximizable: true } })

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
      props: { open: true, title: 'Report', description: 'Report', maximizable: true },
      slots: { 'maximize-icon': '<span class="my-maximize-icon">+</span>' },
    })

    expect(document.body.querySelector('.my-maximize-icon')).toBeTruthy()
  })

  it('does not render a maximize button when maximizable is unset', async () => {
    wrapper = await mountSuspended(Modal, { props: { open: true, title: 'Delete item', description: 'Delete item' } })

    expect(document.body.querySelector('button[aria-label="Maximize"]')).toBeFalsy()
  })

  it('modal="false" does not hide the rest of the page from assistive tech, unlike the modal default', async () => {
    wrapper = await mountSuspended(Modal, { props: { open: true, title: 'Non-modal', description: 'Non-modal', modal: false } })

    expect(document.getElementById('__nuxt')?.getAttribute('aria-hidden')).toBeNull()
  })

  it('is modal (hides the rest of the page) by default', async () => {
    wrapper = await mountSuspended(Modal, { props: { open: true, title: 'Modal', description: 'Modal' } })

    expect(document.getElementById('__nuxt')?.getAttribute('aria-hidden')).toBe('true')
  })

  it('renders no overlay element when overlay is false', async () => {
    const withOverlay = await mountSuspended(Modal, { props: { open: true, title: 'A', description: 'A' } })
    expect(document.body.querySelector('[data-state="open"].bg-black\\/50')).toBeTruthy()
    withOverlay.unmount()

    wrapper = await mountSuspended(Modal, { props: { open: true, title: 'B', description: 'B', overlay: false } })
    expect(document.body.querySelector('.bg-black\\/50')).toBeFalsy()
  })

  it('strips the animation classes entirely when transition is false', async () => {
    const withTransition = await mountSuspended(Modal, { props: { open: true, title: 'A', description: 'A' } })
    expect(document.body.querySelector('[role=dialog]')!.className).toContain('data-[state=open]:animate-in')
    withTransition.unmount()

    wrapper = await mountSuspended(Modal, { props: { open: true, title: 'No transition', description: 'No transition', transition: false } })
    const dialog = document.body.querySelector('[role=dialog]')!
    expect(dialog.className).not.toContain('animate-in')
    expect(dialog.className).not.toContain('animate-out')
  })

  it('emits afterLeave when the closing animation finishes, not the opening one', async () => {
    wrapper = await mountSuspended(Modal, { props: { open: true, title: 'A', description: 'A' } })

    const dialog = document.body.querySelector('[role=dialog]')!
    dialog.dispatchEvent(new AnimationEvent('animationend'))
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('afterLeave')).toBeUndefined()

    await wrapper.setProps({ open: false })
    dialog.dispatchEvent(new AnimationEvent('animationend'))
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('afterLeave')).toBeTruthy()
  })

  it('emits afterLeave immediately on close when transition is off, with no animation to wait for', async () => {
    wrapper = await mountSuspended(Modal, { props: { open: true, title: 'A', description: 'A', transition: false } })

    await wrapper.setProps({ open: false })
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('afterLeave')).toBeTruthy()
  })

  it('supports a modal nested inside another modal, opened independently', async () => {
    wrapper = await mountSuspended({
      components: { Modal },
      data: () => ({ outer: true, inner: false }),
      template: `
        <Modal v-model:open="outer" title="Outer" description="Outer dialog">
          <template #body>
            <button id="open-inner" @click="inner = true">Open inner</button>
          </template>
        </Modal>
        <Modal v-model:open="inner" title="Inner" description="Inner dialog" />
      `,
    })

    expect(document.body.querySelectorAll('[role=dialog]')).toHaveLength(1)

    document.getElementById('open-inner')!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await wrapper.vm.$nextTick()

    const dialogs = document.body.querySelectorAll('[role=dialog]')
    expect(dialogs).toHaveLength(2)
    expect(Array.from(dialogs).some(d => d.textContent?.includes('Inner'))).toBe(true)
  })

  it('uncontrolled (no open prop) opens on trigger click and tracks its own state independently of a sibling instance', async () => {
    const a = await mountSuspended(Modal, {
      props: { title: 'A', description: 'A' },
      slots: { default: () => h('button', 'Trigger A'), body: () => 'Body A' },
    })
    const b = await mountSuspended(Modal, {
      props: { title: 'B', description: 'B' },
      slots: { default: () => h('button', 'Trigger B'), body: () => 'Body B' },
    })

    await a.find('button').trigger('click')
    await a.vm.$nextTick()
    expect(document.body.textContent).toContain('Body A')
    expect(document.body.textContent).not.toContain('Body B')

    await b.find('button').trigger('click')
    await b.vm.$nextTick()
    expect(document.body.textContent).toContain('Body B')

    a.unmount()
    b.unmount()
  })

  it('by default, opening the dialog moves keyboard focus into it', async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    wrapper = await mountSuspended(Modal, {
      attachTo: container,
      props: { open: true, title: 'A', description: 'A' },
      slots: { body: () => h('button', { id: 'inside' }, 'Inside') },
    })
    await macrotask()

    expect(document.body.querySelector('[role=dialog]')?.contains(document.activeElement)).toBe(true)

    container.remove()
  })

  // Autocomplete's own mobileModal usage needs this - its trigger *is* a
  // search input, typed into continuously while the dialog stays open, so
  // Reka's default open-autofocus stealing focus away broke every
  // keystroke after the first (confirmed live - see
  // ComboboxSelectBase.vue's own comment on its `auto-focus="!creatable"`).
  it('autoFocus=false: opening the dialog leaves focus wherever it already was', async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const outside = document.createElement('button')
    outside.id = 'outside'
    outside.textContent = 'Outside'
    container.appendChild(outside)
    outside.focus()

    wrapper = await mountSuspended(Modal, {
      attachTo: container,
      props: { open: true, autoFocus: false, title: 'A', description: 'A' },
      slots: { body: () => h('button', { id: 'inside' }, 'Inside') },
    })
    await macrotask()

    expect(document.activeElement?.id).toBe('outside')

    container.remove()
  })
})
