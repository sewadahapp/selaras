import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import DrawerRenderer from '../../src/runtime/components/DrawerRenderer.vue'
import { useDrawer } from '../../src/runtime/composables/use-drawer'

const TestPanel = defineComponent({
  props: { message: { type: String, default: '' } },
  emits: ['close'],
  setup(props, { emit }) {
    return () => h('div', [
      h('span', { class: 'test-panel-message' }, props.message),
      h('button', { class: 'confirm-btn', onClick: () => emit('close', 'confirmed') }, 'Confirm'),
    ])
  },
})

// useDrawer's state is a module-level singleton, not scoped to a mount -
// it survives across tests in this file, same reason use-modal.test.ts
// resets useModal()'s own singleton in its own afterEach.
afterEach(() => {
  useDrawer().drawers.value = []
})

// DrawerContent teleports to document.body (see drawer.test.ts) -
// invisible to wrapper.find, so query document.body directly. Each test
// unmounts its own wrapper so a later test's query can't match a stale
// teleported node.
let wrapper: Awaited<ReturnType<typeof mountSuspended>> | undefined

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

describe('useDrawer', () => {
  it('open() resolves with the value the rendered component\'s close event carries', async () => {
    wrapper = await mountSuspended(DrawerRenderer)
    const { open } = useDrawer()
    const promise = open<string>(TestPanel)
    await wrapper.vm.$nextTick()

    document.body.querySelector<HTMLButtonElement>('.confirm-btn')!.click()

    expect(await promise).toBe('confirmed')
  })

  it('passes props through to the rendered component', async () => {
    wrapper = await mountSuspended(DrawerRenderer)
    const { open } = useDrawer()
    open(TestPanel, { props: { message: 'Hello from useDrawer' } })
    await wrapper.vm.$nextTick()

    expect(document.body.querySelector('.test-panel-message')?.textContent).toBe('Hello from useDrawer')
  })

  it('close(id) with no value resolves the promise with undefined', async () => {
    wrapper = await mountSuspended(DrawerRenderer)
    const { open, close, drawers } = useDrawer()
    const promise = open(TestPanel)
    await wrapper.vm.$nextTick()

    close(drawers.value[0]!.id)

    expect(await promise).toBeUndefined()
  })

  it('renders two independent instances from two open() calls at once', async () => {
    wrapper = await mountSuspended(DrawerRenderer)
    const { open } = useDrawer()
    open(TestPanel, { props: { message: 'First' } })
    open(TestPanel, { props: { message: 'Second' } })
    await wrapper.vm.$nextTick()

    const messages = Array.from(document.body.querySelectorAll('.test-panel-message')).map(el => el.textContent)
    expect(messages).toEqual(['First', 'Second'])
  })

  it('side option reaches the underlying SDrawer instance', async () => {
    wrapper = await mountSuspended(DrawerRenderer)
    const { open } = useDrawer()
    open(TestPanel, { side: 'left' })
    await wrapper.vm.$nextTick()

    expect(document.body.querySelector('[role=dialog]')!.className).toContain('left-0')
  })

  it('snapPoints option reaches the underlying SDrawer instance', async () => {
    wrapper = await mountSuspended(DrawerRenderer)
    const { open } = useDrawer()
    open(TestPanel, { snapPoints: [0.5, 1] })
    await wrapper.vm.$nextTick()

    expect(document.body.querySelector('[role=dialog]')!.getAttribute('style')).toContain('--drawer-snap-point-offset')
  })

  it('handle option reaches the underlying SDrawer instance', async () => {
    wrapper = await mountSuspended(DrawerRenderer)
    const { open } = useDrawer()
    open(TestPanel, { handle: false })
    await wrapper.vm.$nextTick()

    expect(document.body.querySelector('[role=dialog] > [aria-hidden="true"].rounded-full')).toBeFalsy()
  })

  it('overlay option reaches the underlying SDrawer instance', async () => {
    wrapper = await mountSuspended(DrawerRenderer)
    const { open } = useDrawer()
    open(TestPanel, { overlay: false })
    await wrapper.vm.$nextTick()

    expect(document.body.querySelector('.bg-black\\/50')).toBeFalsy()
  })

  it('transition option reaches the underlying SDrawer instance', async () => {
    wrapper = await mountSuspended(DrawerRenderer)
    const { open } = useDrawer()
    open(TestPanel, { transition: false })
    await wrapper.vm.$nextTick()

    expect(document.body.querySelector('[role=dialog]')!.className).not.toContain('animate-in')
  })

  it('does not remove the panel from the DOM until the exit animation finishes', async () => {
    wrapper = await mountSuspended(DrawerRenderer)
    const { open, close, drawers } = useDrawer()
    const promise = open(TestPanel)
    await wrapper.vm.$nextTick()

    const id = drawers.value[0]!.id
    close(id)
    await wrapper.vm.$nextTick()

    const dialog = document.body.querySelector('[role=dialog]')
    expect(dialog).toBeTruthy()

    dialog!.dispatchEvent(new AnimationEvent('animationend'))
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(document.body.querySelector('[role=dialog]')).toBeFalsy()
    expect(await promise).toBeUndefined()
  })

  it('removes the panel immediately when transition is off, with no animationend needed', async () => {
    wrapper = await mountSuspended(DrawerRenderer)
    const { open, close, drawers } = useDrawer()
    open(TestPanel, { transition: false })
    await wrapper.vm.$nextTick()

    close(drawers.value[0]!.id)
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(document.body.querySelector('[role=dialog]')).toBeFalsy()
  })
})
