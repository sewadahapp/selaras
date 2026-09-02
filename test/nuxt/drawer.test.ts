import { mountSuspended } from '@nuxt/test-utils/runtime'
import { DrawerRoot } from 'reka-ui'
import { afterEach, describe, expect, it } from 'vitest'
import { h } from 'vue'
import Drawer from '../../src/runtime/components/Drawer.vue'

function macrotask() {
  return new Promise(resolve => setTimeout(resolve, 50))
}

// DrawerContent renders through a real Teleport to document.body (not
// stubbed in this test environment), so its content is invisible to
// `wrapper.find`/`findAll` - query document.body directly instead. Each
// test unmounts its own wrapper so a later test's document.body query
// can't match a previous test's stale, already-torn-down node.
let wrapper: Awaited<ReturnType<typeof mountSuspended>> | undefined

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

describe('drawer', () => {
  it('renders the close button as a real, focusable button with an accessible label', async () => {
    wrapper = await mountSuspended(Drawer, { props: { open: true, title: 'Filters' } })

    const closeButton = document.body.querySelector<HTMLButtonElement>('button[aria-label="Close"]')
    expect(closeButton).toBeTruthy()
    expect(closeButton!.tagName).toBe('BUTTON')
  })

  // Deliberately run early, right after the first test - Reka's DrawerRoot
  // tracks "how many modal drawers are currently open" to know when to
  // release aria-hiding the rest of the page, and that counter only
  // decrements on a real Reka-driven close, not a bare Vue unmount. Several
  // tests below intentionally unmount a still-`open:true` instance (e.g.
  // the dismissible=false ones, which never let it close), which leaks an
  // increment - accumulate enough of those first and this assertion starts
  // seeing a stale aria-hidden="true" left over from an unrelated earlier
  // test, not from this one's own `modal` prop. Confirmed narrowly by
  // bisecting with vitest's -t filter across various subsets.
  it('modal="false" does not hide the rest of the page from assistive tech, unlike the modal default', async () => {
    wrapper = await mountSuspended(Drawer, { props: { open: true, title: 'Non-modal', modal: false } })

    expect(document.getElementById('__nuxt')?.getAttribute('aria-hidden')).toBeNull()
  })

  it('is modal (hides the rest of the page) by default', async () => {
    wrapper = await mountSuspended(Drawer, { props: { open: true, title: 'Modal' } })

    expect(document.getElementById('__nuxt')?.getAttribute('aria-hidden')).toBe('true')
  })

  it('renders a grip handle by default', async () => {
    wrapper = await mountSuspended(Drawer, { props: { open: true, title: 'Filters' } })

    expect(document.body.querySelector('[role=dialog] > [aria-hidden="true"].rounded-full')).toBeTruthy()
  })

  it('renders no handle when handle is false', async () => {
    wrapper = await mountSuspended(Drawer, { props: { open: true, title: 'Filters', handle: false } })

    expect(document.body.querySelector('[role=dialog] > [aria-hidden="true"].rounded-full')).toBeFalsy()
  })

  it('closing via the close button emits update:open with false', async () => {
    wrapper = await mountSuspended(Drawer, { props: { open: true, title: 'Filters' } })

    const closeButton = document.body.querySelector<HTMLButtonElement>('button[aria-label="Close"]')!
    closeButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await wrapper.vm.$nextTick()
    await macrotask()

    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
  })

  it('forwards escapeKeyDown so a consumer can preventDefault it', async () => {
    wrapper = await mountSuspended(Drawer, { props: { open: true, title: 'Filters' } })

    const dialog = document.body.querySelector('[role=dialog]')!
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await wrapper.vm.$nextTick()

    const emitted = wrapper.emitted('escapeKeyDown')
    expect(emitted).toBeTruthy()
    expect(emitted![0]![0]).toBeInstanceOf(Event)
  })

  it('renders no close button when close is false', async () => {
    wrapper = await mountSuspended(Drawer, { props: { open: true, title: 'Filters', close: false } })

    expect(document.body.querySelector<HTMLButtonElement>('button[aria-label="Close"]')).toBeFalsy()
  })

  it('still emits escapeKeyDown when dismissible is false, but does not close', async () => {
    wrapper = await mountSuspended(Drawer, { props: { open: true, title: 'Filters', dismissible: false } })

    const dialog = document.body.querySelector('[role=dialog]')!
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('escapeKeyDown')).toBeTruthy()
    expect(wrapper.emitted('update:open')).toBeUndefined()
  })

  it('a swipe-driven close is blocked when dismissible is false', async () => {
    wrapper = await mountSuspended(Drawer, { props: { open: true, title: 'Filters', dismissible: false } })

    // A real drag gesture isn't simulated here - Reka only reports a swipe
    // after the fact, via update:open's second argument, so emitting that
    // same event from the DrawerRoot child (which the component's own
    // @update:open="onUpdateOpen" template binding listens on) exercises
    // the real interception logic, unlike emitting from the wrapper itself
    // (which would bypass onUpdateOpen entirely).
    wrapper.findComponent(DrawerRoot).vm.$emit('update:open', false, { reason: 'swipe' })
    await wrapper.vm.$nextTick()

    expect(document.body.querySelector('[role=dialog]')).toBeTruthy()
    expect(wrapper.emitted('update:open')).toBeUndefined()
  })

  it('a swipe-driven close is allowed when dismissible is true (default)', async () => {
    wrapper = await mountSuspended(Drawer, { props: { open: true, title: 'Filters' } })

    wrapper.findComponent(DrawerRoot).vm.$emit('update:open', false, { reason: 'swipe' })
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
  })

  it('renders the content slot in place of header/body/footer entirely', async () => {
    wrapper = await mountSuspended(Drawer, {
      props: { open: true, title: 'Ignored' },
      slots: { content: () => 'Fully custom content', header: () => 'Ignored header', footer: () => 'Ignored footer' },
    })

    const dialog = document.body.querySelector('[role=dialog]')!
    expect(dialog.textContent).toBe('Fully custom content')
  })

  it('replaces the close icon via the close-icon slot', async () => {
    wrapper = await mountSuspended(Drawer, {
      props: { open: true, title: 'Filters' },
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
    wrapper = await mountSuspended(Drawer, { props: { open: true, title: 'Filters', side } })

    const dialog = document.body.querySelector('[role=dialog]')!
    expect(dialog.className).toContain(expectedClass)
  })

  it.each([
    ['top', 'up'],
    ['bottom', 'down'],
    ['left', 'left'],
    ['right', 'right'],
  ] as const)('side=%s swipes toward %s to dismiss', async (side, expectedDirection) => {
    wrapper = await mountSuspended(Drawer, { props: { open: true, title: 'Filters', side } })

    const dialog = document.body.querySelector('[role=dialog]')!
    expect(dialog.getAttribute('data-swipe-direction')).toBe(expectedDirection)
  })

  it('renders no overlay element when overlay is false', async () => {
    const withOverlay = await mountSuspended(Drawer, { props: { open: true, title: 'A' } })
    expect(document.body.querySelector('[data-state="open"].bg-black\\/50')).toBeTruthy()
    withOverlay.unmount()

    wrapper = await mountSuspended(Drawer, { props: { open: true, title: 'B', overlay: false } })
    expect(document.body.querySelector('.bg-black\\/50')).toBeFalsy()
  })

  it('strips the animation classes entirely when transition is false', async () => {
    const withTransition = await mountSuspended(Drawer, { props: { open: true, title: 'A' } })
    expect(document.body.querySelector('[role=dialog]')!.className).toContain('data-[state=open]:animate-in')
    withTransition.unmount()

    wrapper = await mountSuspended(Drawer, { props: { open: true, title: 'No transition', transition: false } })
    const dialog = document.body.querySelector('[role=dialog]')!
    expect(dialog.className).not.toContain('animate-in')
    expect(dialog.className).not.toContain('animate-out')
  })

  it('emits afterLeave when the closing animation finishes, not the opening one', async () => {
    wrapper = await mountSuspended(Drawer, { props: { open: true, title: 'A' } })

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
    wrapper = await mountSuspended(Drawer, { props: { open: true, title: 'A', transition: false } })

    await wrapper.setProps({ open: false })
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('afterLeave')).toBeTruthy()
  })

  it('uncontrolled (no open prop) opens on trigger click and tracks its own state independently of a sibling instance', async () => {
    const a = await mountSuspended(Drawer, {
      props: { title: 'A' },
      slots: { default: () => h('button', 'Trigger A'), body: () => 'Body A' },
    })
    const b = await mountSuspended(Drawer, {
      props: { title: 'B' },
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

  it('passes snapPoints through to the underlying DrawerRoot', async () => {
    wrapper = await mountSuspended(Drawer, { props: { open: true, title: 'A', snapPoints: [0.3, 0.6, 1] } })

    const dialog = document.body.querySelector('[role=dialog]')!
    // Reka exposes the active snap point's offset as a CSS custom property
    // on the content element - its mere presence confirms snapPoints
    // actually reached DrawerRoot (a plain prop-forwarding bug would leave
    // this variable absent entirely).
    expect(dialog.getAttribute('style')).toContain('--drawer-snap-point-offset')
  })
})
