import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import SlideoverRenderer from '../../src/runtime/components/SlideoverRenderer.vue'
import { useSlideover } from '../../src/runtime/composables/use-slideover'

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

// useSlideover's state is a module-level singleton, not scoped to a mount -
// it survives across tests in this file, same reason use-modal.test.ts
// resets useModal()'s own singleton in its own afterEach.
afterEach(() => {
  useSlideover().slideovers.value = []
})

// DialogContent teleports to document.body (see slideover.test.ts) -
// invisible to wrapper.find, so query document.body directly. Each test
// unmounts its own wrapper so a later test's query can't match a stale
// teleported node.
let wrapper: Awaited<ReturnType<typeof mountSuspended>> | undefined

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

describe('useSlideover', () => {
  it('open() resolves with the value the rendered component\'s close event carries', async () => {
    wrapper = await mountSuspended(SlideoverRenderer)
    const { open } = useSlideover()
    const promise = open<string>(TestPanel)
    await wrapper.vm.$nextTick()

    document.body.querySelector<HTMLButtonElement>('.confirm-btn')!.click()

    expect(await promise).toBe('confirmed')
  })

  it('passes props through to the rendered component', async () => {
    wrapper = await mountSuspended(SlideoverRenderer)
    const { open } = useSlideover()
    open(TestPanel, { props: { message: 'Hello from useSlideover' } })
    await wrapper.vm.$nextTick()

    expect(document.body.querySelector('.test-panel-message')?.textContent).toBe('Hello from useSlideover')
  })

  it('close(id) with no value resolves the promise with undefined', async () => {
    wrapper = await mountSuspended(SlideoverRenderer)
    const { open, close, slideovers } = useSlideover()
    const promise = open(TestPanel)
    await wrapper.vm.$nextTick()

    close(slideovers.value[0]!.id)

    expect(await promise).toBeUndefined()
  })

  it('renders two independent instances from two open() calls at once', async () => {
    wrapper = await mountSuspended(SlideoverRenderer)
    const { open } = useSlideover()
    open(TestPanel, { props: { message: 'First' } })
    open(TestPanel, { props: { message: 'Second' } })
    await wrapper.vm.$nextTick()

    const messages = Array.from(document.body.querySelectorAll('.test-panel-message')).map(el => el.textContent)
    expect(messages).toEqual(['First', 'Second'])
  })

  it('side option reaches the underlying SSlideover instance', async () => {
    wrapper = await mountSuspended(SlideoverRenderer)
    const { open } = useSlideover()
    open(TestPanel, { side: 'left' })
    await wrapper.vm.$nextTick()

    expect(document.body.querySelector('[role=dialog]')!.className).toContain('left-0')
  })

  it('modal option reaches the underlying SSlideover instance', async () => {
    wrapper = await mountSuspended(SlideoverRenderer)
    const { open } = useSlideover()
    open(TestPanel, { modal: false })
    await wrapper.vm.$nextTick()

    expect(document.getElementById('__nuxt')?.getAttribute('aria-hidden')).toBeNull()
  })

  it('overlay option reaches the underlying SSlideover instance', async () => {
    wrapper = await mountSuspended(SlideoverRenderer)
    const { open } = useSlideover()
    open(TestPanel, { overlay: false })
    await wrapper.vm.$nextTick()

    expect(document.body.querySelector('.bg-black\\/50')).toBeFalsy()
  })

  it('transition option reaches the underlying SSlideover instance', async () => {
    wrapper = await mountSuspended(SlideoverRenderer)
    const { open } = useSlideover()
    open(TestPanel, { transition: false })
    await wrapper.vm.$nextTick()

    expect(document.body.querySelector('[role=dialog]')!.className).not.toContain('animate-in')
  })

  it('does not remove the panel from the DOM until the exit animation finishes', async () => {
    wrapper = await mountSuspended(SlideoverRenderer)
    const { open, close, slideovers } = useSlideover()
    const promise = open(TestPanel)
    await wrapper.vm.$nextTick()

    const id = slideovers.value[0]!.id
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
    wrapper = await mountSuspended(SlideoverRenderer)
    const { open, close, slideovers } = useSlideover()
    open(TestPanel, { transition: false })
    await wrapper.vm.$nextTick()

    close(slideovers.value[0]!.id)
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(document.body.querySelector('[role=dialog]')).toBeFalsy()
  })
})
