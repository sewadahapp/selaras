import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import ModalRenderer from '../../src/runtime/components/ModalRenderer.vue'
import { useModal } from '../../src/runtime/composables/use-modal'

const TestDialog = defineComponent({
  props: { message: { type: String, default: '' } },
  emits: ['close'],
  setup(props, { emit }) {
    return () => h('div', [
      h('span', { class: 'test-dialog-message' }, props.message),
      h('button', { class: 'confirm-btn', onClick: () => emit('close', 'confirmed') }, 'Confirm'),
    ])
  },
})

// useModal's state is a module-level singleton, not scoped to a mount - it
// survives across tests in this file, same reason toast.test.ts resets
// useToast()'s own useState singleton in its own afterEach.
afterEach(() => {
  useModal().modals.value = []
})

// DialogContent teleports to document.body (see modal.test.ts) - invisible
// to wrapper.find, so query document.body directly. Each test unmounts its
// own wrapper so a later test's query can't match a stale teleported node.
let wrapper: Awaited<ReturnType<typeof mountSuspended>> | undefined

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

describe('useModal', () => {
  it('open() resolves with the value the rendered component\'s close event carries', async () => {
    wrapper = await mountSuspended(ModalRenderer)
    const { open } = useModal()
    const promise = open<string>(TestDialog)
    await wrapper.vm.$nextTick()

    document.body.querySelector<HTMLButtonElement>('.confirm-btn')!.click()

    expect(await promise).toBe('confirmed')
  })

  it('passes props through to the rendered component', async () => {
    wrapper = await mountSuspended(ModalRenderer)
    const { open } = useModal()
    open(TestDialog, { props: { message: 'Hello from useModal' } })
    await wrapper.vm.$nextTick()

    expect(document.body.querySelector('.test-dialog-message')?.textContent).toBe('Hello from useModal')
  })

  it('close(id) with no value resolves the promise with undefined', async () => {
    wrapper = await mountSuspended(ModalRenderer)
    const { open, close, modals } = useModal()
    const promise = open(TestDialog)
    await wrapper.vm.$nextTick()

    close(modals.value[0]!.id)

    expect(await promise).toBeUndefined()
  })

  it('renders two independent instances from two open() calls at once', async () => {
    wrapper = await mountSuspended(ModalRenderer)
    const { open } = useModal()
    open(TestDialog, { props: { message: 'First' } })
    open(TestDialog, { props: { message: 'Second' } })
    await wrapper.vm.$nextTick()

    const messages = Array.from(document.body.querySelectorAll('.test-dialog-message')).map(el => el.textContent)
    expect(messages).toEqual(['First', 'Second'])
  })

  it('modal option reaches the underlying SModal instance', async () => {
    wrapper = await mountSuspended(ModalRenderer)
    const { open } = useModal()
    open(TestDialog, { modal: false })
    await wrapper.vm.$nextTick()

    expect(document.getElementById('__nuxt')?.getAttribute('aria-hidden')).toBeNull()
  })

  it('overlay option reaches the underlying SModal instance', async () => {
    wrapper = await mountSuspended(ModalRenderer)
    const { open } = useModal()
    open(TestDialog, { overlay: false })
    await wrapper.vm.$nextTick()

    expect(document.body.querySelector('.bg-black\\/50')).toBeFalsy()
  })

  it('transition option reaches the underlying SModal instance', async () => {
    wrapper = await mountSuspended(ModalRenderer)
    const { open } = useModal()
    open(TestDialog, { transition: false })
    await wrapper.vm.$nextTick()

    expect(document.body.querySelector('[role=dialog]')!.className).not.toContain('animate-in')
  })

  it('does not remove the dialog from the DOM until the exit animation finishes', async () => {
    wrapper = await mountSuspended(ModalRenderer)
    const { open, close, modals } = useModal()
    const promise = open(TestDialog)
    await wrapper.vm.$nextTick()

    const id = modals.value[0]!.id
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

  it('removes the dialog immediately when transition is off, with no animationend needed', async () => {
    wrapper = await mountSuspended(ModalRenderer)
    const { open, close, modals } = useModal()
    open(TestDialog, { transition: false })
    await wrapper.vm.$nextTick()

    close(modals.value[0]!.id)
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(document.body.querySelector('[role=dialog]')).toBeFalsy()
  })
})
