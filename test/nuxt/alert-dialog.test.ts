import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, describe, expect, it } from 'vitest'
import { h } from 'vue'
import AlertDialog from '../../src/runtime/components/AlertDialog.vue'

function macrotask() {
  return new Promise(resolve => setTimeout(resolve, 50))
}

// See modal.test.ts for why document.body is queried directly (a real
// Teleport, not stubbed) and why each test unmounts its own wrapper.
let wrapper: Awaited<ReturnType<typeof mountSuspended>> | undefined

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

function findButton(text: string) {
  return Array.from(document.body.querySelectorAll<HTMLButtonElement>('button')).find(b => b.textContent?.trim() === text)
}

describe('alertDialog', () => {
  it('renders default Cancel/Continue buttons with no props given', async () => {
    wrapper = await mountSuspended(AlertDialog, { props: { open: true, title: 'Delete item', description: 'Delete item' } })

    expect(findButton('Cancel')).toBeTruthy()
    expect(findButton('Continue')).toBeTruthy()
  })

  it('cancelLabel/actionLabel override the default button text', async () => {
    wrapper = await mountSuspended(AlertDialog, {
      props: { open: true, title: 'Delete item', description: 'Delete item', cancelLabel: 'Keep it', actionLabel: 'Delete' },
    })

    expect(findButton('Keep it')).toBeTruthy()
    expect(findButton('Delete')).toBeTruthy()
    expect(findButton('Cancel')).toBeFalsy()
  })

  it('actionColor reaches the default action button', async () => {
    wrapper = await mountSuspended(AlertDialog, { props: { open: true, title: 'Delete item', description: 'Delete item', actionColor: 'danger' } })

    expect(findButton('Continue')!.className).toContain('danger')
  })

  it('clicking Cancel emits cancel and closes', async () => {
    wrapper = await mountSuspended(AlertDialog, { props: { open: true, title: 'Delete item', description: 'Delete item' } })

    findButton('Cancel')!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('cancel')).toBeTruthy()
    expect(wrapper.emitted('confirm')).toBeUndefined()
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
  })

  it('clicking the action button emits confirm and closes, exactly once', async () => {
    wrapper = await mountSuspended(AlertDialog, { props: { open: true, title: 'Delete item', description: 'Delete item' } })

    findButton('Continue')!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('confirm')).toHaveLength(1)
    expect(wrapper.emitted('cancel')).toBeUndefined()
    expect(wrapper.emitted('update:open')).toHaveLength(1)
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
  })

  it('a custom footer slot replaces the default Cancel/Continue buttons entirely', async () => {
    wrapper = await mountSuspended(AlertDialog, {
      props: { open: true, title: 'Delete item', description: 'Delete item' },
      slots: { footer: () => h('button', { class: 'my-footer-btn' }, 'Custom action') },
    })

    expect(document.body.querySelector('.my-footer-btn')).toBeTruthy()
    expect(findButton('Cancel')).toBeFalsy()
    expect(findButton('Continue')).toBeFalsy()
  })

  it('forwards escapeKeyDown so a consumer can preventDefault it', async () => {
    wrapper = await mountSuspended(AlertDialog, { props: { open: true, title: 'Delete item', description: 'Delete item' } })

    const dialog = document.body.querySelector('[role=alertdialog]')!
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await wrapper.vm.$nextTick()

    const emitted = wrapper.emitted('escapeKeyDown')
    expect(emitted).toBeTruthy()
    expect(emitted![0]![0]).toBeInstanceOf(Event)
  })

  it('still emits escapeKeyDown when dismissible is false, but does not close', async () => {
    wrapper = await mountSuspended(AlertDialog, { props: { open: true, title: 'Confirm', description: 'Confirm', dismissible: false } })

    const dialog = document.body.querySelector('[role=alertdialog]')!
    // See modal.test.ts for why cancelable: true matters here.
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('escapeKeyDown')).toBeTruthy()
    expect(wrapper.emitted('update:open')).toBeUndefined()
  })

  it('an outside click never closes it, even without dismissible=false - unlike Modal', async () => {
    wrapper = await mountSuspended(AlertDialog, { props: { open: true, title: 'Delete item', description: 'Delete item' } })

    document.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, cancelable: true }))
    await wrapper.vm.$nextTick()
    await macrotask()

    expect(document.body.querySelector('[role=alertdialog]')).toBeTruthy()
    expect(wrapper.emitted('update:open')).toBeUndefined()
  })

  it('always hides the rest of the page from assistive tech - no modal prop, unlike Modal', async () => {
    wrapper = await mountSuspended(AlertDialog, { props: { open: true, title: 'Delete item', description: 'Delete item' } })

    expect(document.getElementById('__nuxt')?.getAttribute('aria-hidden')).toBe('true')
  })

  it('renders no overlay element when overlay is false', async () => {
    const withOverlay = await mountSuspended(AlertDialog, { props: { open: true, title: 'A', description: 'A' } })
    expect(document.body.querySelector('[data-state="open"].bg-black\\/50')).toBeTruthy()
    withOverlay.unmount()

    wrapper = await mountSuspended(AlertDialog, { props: { open: true, title: 'B', description: 'B', overlay: false } })
    expect(document.body.querySelector('.bg-black\\/50')).toBeFalsy()
  })

  it('strips the animation classes entirely when transition is false', async () => {
    const withTransition = await mountSuspended(AlertDialog, { props: { open: true, title: 'A', description: 'A' } })
    expect(document.body.querySelector('[role=alertdialog]')!.className).toContain('data-[state=open]:animate-in')
    withTransition.unmount()

    wrapper = await mountSuspended(AlertDialog, { props: { open: true, title: 'No transition', description: 'No transition', transition: false } })
    const dialog = document.body.querySelector('[role=alertdialog]')!
    expect(dialog.className).not.toContain('animate-in')
    expect(dialog.className).not.toContain('animate-out')
  })

  it('emits afterLeave when the closing animation finishes, not the opening one', async () => {
    wrapper = await mountSuspended(AlertDialog, { props: { open: true, title: 'A', description: 'A' } })

    const dialog = document.body.querySelector('[role=alertdialog]')!
    dialog.dispatchEvent(new AnimationEvent('animationend'))
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('afterLeave')).toBeUndefined()

    await wrapper.setProps({ open: false })
    dialog.dispatchEvent(new AnimationEvent('animationend'))
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('afterLeave')).toBeTruthy()
  })

  it('emits afterLeave immediately on close when transition is off, with no animation to wait for', async () => {
    wrapper = await mountSuspended(AlertDialog, { props: { open: true, title: 'A', description: 'A', transition: false } })

    await wrapper.setProps({ open: false })
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('afterLeave')).toBeTruthy()
  })

  it('uncontrolled (no open prop) opens on trigger click and tracks its own state independently of a sibling instance', async () => {
    const a = await mountSuspended(AlertDialog, {
      props: { title: 'A', description: 'A' },
      slots: { default: () => h('button', 'Trigger A'), body: () => 'Body A' },
    })
    const b = await mountSuspended(AlertDialog, {
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

  it('by default, opening the dialog moves keyboard focus specifically to the Cancel button', async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    wrapper = await mountSuspended(AlertDialog, {
      attachTo: container,
      props: { open: true, title: 'A', description: 'A' },
    })
    await macrotask()

    expect(document.activeElement?.textContent?.trim()).toBe('Cancel')

    container.remove()
  })
})
