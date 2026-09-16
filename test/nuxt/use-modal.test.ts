import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import Button from '../../src/runtime/components/Button.vue'
import ModalRenderer from '../../src/runtime/components/ModalRenderer.vue'
import Theme from '../../src/runtime/components/Theme.vue'
import { useModal } from '../../src/runtime/composables/use-modal'
import { useModalService } from '../../src/runtime/internal/programmatic-services'

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

const ThemedDialog = defineComponent({
  render: () => h(Button, { class: 'snapshot-button', color: 'premium' as any }, () => 'Themed action'),
})

const ThemedModalTrigger = defineComponent({
  setup() {
    const { open } = useModal()
    return () => h('button', {
      'data-testid': 'themed-modal-trigger',
      'onClick': () => open(ThemedDialog, { title: 'Themed dialog', description: 'Snapshot verification', dismissible: false }),
    }, 'Open')
  },
})

const ThemedModalHarness = defineComponent({
  setup() {
    const showScope = ref(true)
    return () => [
      showScope.value
        ? h(Theme, {
            as: 'section',
            mode: 'dark',
            ui: { modal: { slots: { content: 'tracking-widest' } } },
            defaults: { button: { size: 'lg' } },
            tokens: { light: { colors: { premium: { fill: '#5134a8' } } } },
          }, () => h(ThemedModalTrigger))
        : null,
      h('button', { 'data-testid': 'remove-scope', 'onClick': () => { showScope.value = false } }, 'Remove scope'),
      h(ModalRenderer),
    ]
  },
})

// The Nuxt test harness reuses one application instance within this file.
afterEach(() => {
  useModalService().dispose()
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
    const promise = open<string>(TestDialog, { title: 'Test dialog', description: 'Test dialog' })
    await wrapper.vm.$nextTick()

    document.body.querySelector<HTMLButtonElement>('.confirm-btn')!.click()

    expect(await promise).toBe('confirmed')
  })

  it('passes props through to the rendered component', async () => {
    wrapper = await mountSuspended(ModalRenderer)
    const { open } = useModal()
    open(TestDialog, { title: 'Test dialog', description: 'Test dialog', props: { message: 'Hello from useModal' } })
    await wrapper.vm.$nextTick()

    expect(document.body.querySelector('.test-dialog-message')?.textContent).toBe('Hello from useModal')
  })

  it('close(id) with no value resolves the promise with undefined', async () => {
    wrapper = await mountSuspended(ModalRenderer)
    const { open } = useModal()
    const { close, instances: modals } = useModalService()
    const promise = open(TestDialog, { title: 'Test dialog', description: 'Test dialog' })
    await wrapper.vm.$nextTick()

    close(modals.value[0]!.id)

    expect(await promise).toBeUndefined()
  })

  it('settles pending work when its renderer app boundary unmounts', async () => {
    wrapper = await mountSuspended(ModalRenderer)
    const promise = useModal().open(TestDialog, { title: 'Test dialog', description: 'Test dialog' })
    await wrapper.vm.$nextTick()

    wrapper.unmount()
    wrapper = undefined

    expect(await promise).toBeUndefined()
  })

  it('renders two independent instances from two open() calls at once', async () => {
    wrapper = await mountSuspended(ModalRenderer)
    const { open } = useModal()
    open(TestDialog, { title: 'Test dialog', description: 'Test dialog', props: { message: 'First' } })
    open(TestDialog, { title: 'Test dialog', description: 'Test dialog', props: { message: 'Second' } })
    await wrapper.vm.$nextTick()

    const messages = Array.from(document.body.querySelectorAll('.test-dialog-message')).map(el => el.textContent)
    expect(messages).toEqual(['First', 'Second'])
  })

  it('modal option reaches the underlying SModal instance', async () => {
    wrapper = await mountSuspended(ModalRenderer)
    const { open } = useModal()
    open(TestDialog, { title: 'Test dialog', description: 'Test dialog', modal: false })
    await wrapper.vm.$nextTick()

    expect(document.getElementById('__nuxt')?.getAttribute('aria-hidden')).toBeNull()
  })

  it('overlay option reaches the underlying SModal instance', async () => {
    wrapper = await mountSuspended(ModalRenderer)
    const { open } = useModal()
    open(TestDialog, { title: 'Test dialog', description: 'Test dialog', overlay: false })
    await wrapper.vm.$nextTick()

    expect(document.body.querySelector('.bg-black\\/50')).toBeFalsy()
  })

  it('transition option reaches the underlying SModal instance', async () => {
    wrapper = await mountSuspended(ModalRenderer)
    const { open } = useModal()
    open(TestDialog, { title: 'Test dialog', description: 'Test dialog', transition: false })
    await wrapper.vm.$nextTick()

    expect(document.body.querySelector('[role=dialog]')!.className).not.toContain('animate-in')
  })

  it('does not remove the dialog from the DOM until the exit animation finishes', async () => {
    wrapper = await mountSuspended(ModalRenderer)
    const { open } = useModal()
    const { close, instances: modals } = useModalService()
    const promise = open(TestDialog, { title: 'Test dialog', description: 'Test dialog' })
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
    const { open } = useModal()
    const { close, instances: modals } = useModalService()
    open(TestDialog, { title: 'Test dialog', description: 'Test dialog', transition: false })
    await wrapper.vm.$nextTick()

    close(modals.value[0]!.id)
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(document.body.querySelector('[role=dialog]')).toBeFalsy()
  })

  it('keeps its UI, defaults, tokens, and mode owner after the caller scope unmounts', async () => {
    wrapper = await mountSuspended(ThemedModalHarness)
    await wrapper.find('[data-testid="themed-modal-trigger"]').trigger('click')
    await wrapper.vm.$nextTick()

    const dialog = document.body.querySelector<HTMLElement>('[role=dialog]')
    const button = dialog?.querySelector<HTMLElement>('.snapshot-button')
    const snapshotScope = dialog?.getAttribute('data-selaras-theme')
    expect(dialog?.classList).toContain('tracking-widest')
    expect(button?.classList).toContain('h-11')
    expect(snapshotScope).toMatch(/^p/)
    expect(dialog?.getAttribute('data-selaras-mode')).toBe('dark')
    expect(dialog?.getAttribute('style')).toContain('color-scheme: dark')

    await wrapper.find('[data-testid="remove-scope"]').trigger('click')
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(wrapper.find('section[data-selaras-theme]').exists()).toBe(false)
    expect(document.body.querySelector('[role=dialog]')?.getAttribute('data-selaras-theme')).toBe(snapshotScope)
    expect([...document.head.querySelectorAll('style')].some(style => style.textContent?.includes(`[data-selaras-theme="${snapshotScope}"]`) && style.textContent.includes('#5134a8'))).toBe(true)
  })
})
