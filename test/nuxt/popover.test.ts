import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, describe, expect, it } from 'vitest'
import { h } from 'vue'
import Popover from '../../src/runtime/components/Popover.vue'

// PopoverContent renders through a real Teleport to document.body (not
// stubbed in this test environment), so its content is invisible to
// `wrapper.find`/`findAll` - query document.body directly instead. Each
// test unmounts its own wrapper so a later test's document.body query
// can't match a previous test's stale, already-torn-down node.
let wrapper: Awaited<ReturnType<typeof mountSuspended>> | undefined

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

describe('popover', () => {
  it('renders the content slot when open', async () => {
    wrapper = await mountSuspended(Popover, {
      props: { modelValue: true },
      slots: { content: () => 'Popover body' },
    })

    expect(document.body.textContent).toContain('Popover body')
  })

  it('renders nothing from the content slot when closed', async () => {
    wrapper = await mountSuspended(Popover, {
      props: { modelValue: false },
      slots: { default: () => 'Trigger', content: () => 'Popover body' },
    })

    expect(document.body.textContent).not.toContain('Popover body')
  })

  it('forwards escapeKeyDown so a consumer can preventDefault it', async () => {
    wrapper = await mountSuspended(Popover, {
      props: { modelValue: true },
      slots: { content: () => 'Body' },
    })

    const content = document.body.querySelector('[role=dialog]')!
    content.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await wrapper.vm.$nextTick()

    const emitted = wrapper.emitted('escapeKeyDown')
    expect(emitted).toBeTruthy()
    expect(emitted![0]![0]).toBeInstanceOf(Event)
  })

  it('still emits escapeKeyDown when dismissible is false, but does not close', async () => {
    wrapper = await mountSuspended(Popover, {
      props: { modelValue: true, dismissible: false },
      slots: { content: () => 'Body' },
    })

    const content = document.body.querySelector('[role=dialog]')!
    // cancelable: true matters here - see modal.test.ts's own note on why.
    content.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('escapeKeyDown')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('non-modal (the default) + dismissible=false: focusing an outside element does not close it either', async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const outside = document.createElement('button')
    outside.id = 'outside'
    outside.textContent = 'Outside'
    container.appendChild(outside)

    wrapper = await mountSuspended(Popover, {
      attachTo: container,
      props: { modelValue: true, dismissible: false },
      slots: { content: () => 'Body' },
    })
    await new Promise(resolve => setTimeout(resolve, 50))

    outside.focus()
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(document.body.textContent).toContain('Body')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    container.remove()
  })

  it.each(['top', 'right', 'bottom', 'left'] as const)('side=%s reaches the underlying content classes', async (side) => {
    wrapper = await mountSuspended(Popover, {
      props: { modelValue: true, side },
      slots: { content: () => 'Body' },
    })

    // The content's own class list is theme-driven and orientation-agnostic
    // (data-[side=] classes cover every side at once) - what actually
    // varies per `side` is the `data-side` attribute Reka forwards to
    // Popper, which drives real positioning. Assert the prop reached
    // Reka itself.
    const content = document.body.querySelector('[role=dialog]')
    expect(content?.getAttribute('data-side')).toBe(side)
  })

  it('renders no arrow element by default', async () => {
    wrapper = await mountSuspended(Popover, {
      props: { modelValue: true },
      slots: { content: () => 'Body' },
    })

    expect(document.body.querySelector('.fill-\\[var\\(--ui-bg\\)\\]')).toBeFalsy()
  })

  it('arrow renders the pointer triangle', async () => {
    wrapper = await mountSuspended(Popover, {
      props: { modelValue: true, arrow: true },
      slots: { content: () => 'Body' },
    })

    expect(document.body.querySelector('.fill-\\[var\\(--ui-bg\\)\\]')).toBeTruthy()
  })

  it('modal="true" hides the rest of the page from assistive tech', async () => {
    wrapper = await mountSuspended(Popover, {
      props: { modelValue: true, modal: true },
      slots: { content: () => 'Body' },
    })

    expect(document.getElementById('__nuxt')?.getAttribute('aria-hidden')).toBe('true')
  })

  it('is non-modal by default - does not hide the rest of the page', async () => {
    wrapper = await mountSuspended(Popover, {
      props: { modelValue: true },
      slots: { content: () => 'Body' },
    })

    expect(document.getElementById('__nuxt')?.getAttribute('aria-hidden')).toBeNull()
  })

  it('uncontrolled (no modelValue) opens on trigger click and tracks its own state independently of a sibling instance', async () => {
    const a = await mountSuspended(Popover, {
      slots: { default: () => h('button', 'Trigger A'), content: () => 'Body A' },
    })
    const b = await mountSuspended(Popover, {
      slots: { default: () => h('button', 'Trigger B'), content: () => 'Body B' },
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
})
