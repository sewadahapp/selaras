import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import ColorPicker from '../../src/runtime/components/ColorPicker.vue'
import './helpers/adaptive-breakpoint'

function trigger(wrapper: Awaited<ReturnType<typeof mountSuspended>>) {
  return wrapper.find('[aria-haspopup="dialog"]')
}

async function open(wrapper: Awaited<ReturnType<typeof mountSuspended>>) {
  await trigger(wrapper).trigger('click')
  await nextTick()
}

describe('colorPicker', () => {
  it('forwards an opt-in arrow to its anchored popover', async () => {
    const wrapper = await mountSuspended(ColorPicker, { props: { open: true, arrow: { width: 16, height: 8, rounded: true } } })
    try {
      const arrow = document.body.querySelector('.fill-\\[var\\(--selaras-resolved-surface-default\\)\\]')
      expect(arrow?.getAttribute('width')).toBe('16')
      expect(arrow?.getAttribute('height')).toBe('8')
    }
    finally {
      wrapper.unmount()
    }
  })

  it('preserves a template-style controlled color on native form reset', async () => {
    const wrapper = await mountSuspended(defineComponent({
      render: () => h('form', {}, [h(ColorPicker, { 'name': 'color', 'model-value': '#ff0000', 'defaultValue': '#00ff00' })]),
    }))
    const form = wrapper.find('form').element
    form.reset()
    await nextTick()
    await nextTick()
    expect(new FormData(form).get('color')).toBe('#ff0000')
    wrapper.unmount()
  })

  it('submits a persistent native value and resets an uncontrolled default', async () => {
    const wrapper = await mountSuspended(defineComponent({
      render: () => h('form', {}, [
        h(ColorPicker, { name: 'color', defaultValue: '#00ff00' }),
      ]),
    }))
    const form = wrapper.find('form').element
    expect(new FormData(form).get('color')).toBe('#00ff00')

    await wrapper.find('[aria-haspopup="dialog"]').trigger('click')
    const field = document.body.querySelector('input[type="text"]') as HTMLInputElement
    field.value = '#ff0000'
    field.dispatchEvent(new Event('input', { bubbles: true }))
    field.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await nextTick()
    expect(new FormData(form).get('color')).toBe('#ff0000')

    form.reset()
    await nextTick()
    await nextTick()
    expect(new FormData(form).get('color')).toBe('#00ff00')
    wrapper.unmount()
  })

  it('supports defaultOpen and lets a controlled parent veto closing', async () => {
    const uncontrolled = await mountSuspended(ColorPicker, { props: { defaultOpen: true } })
    expect(trigger(uncontrolled).attributes('aria-expanded')).toBe('true')
    uncontrolled.unmount()

    const controlled = await mountSuspended(ColorPicker, { props: { open: true } })
    const controlledTrigger = trigger(controlled)
    expect(controlledTrigger.attributes('aria-expanded')).toBe('true')
    await controlledTrigger.trigger('click')
    expect(controlled.emitted('update:open')?.[0]).toEqual([false])
    expect(controlledTrigger.attributes('aria-expanded')).toBe('true')
    controlled.unmount()
  })

  it('binds a custom semantic role to the trigger', async () => {
    const wrapper = await mountSuspended(ColorPicker, { props: { color: 'premium' as any } })
    expect(wrapper.find('[data-selaras-color="premium"]').exists()).toBe(true)
  })

  it('renders the trigger swatch and hex text from modelValue', async () => {
    const wrapper = await mountSuspended(ColorPicker, { props: { modelValue: '#7c3aed' } })

    expect(wrapper.text()).toContain('#7c3aed')
    const swatch = wrapper.find('[role="img"][aria-roledescription="color swatch"]')
    expect(swatch.attributes('style')).toContain('--reka-color-swatch-color: #7c3aed')

    wrapper.unmount()
  })

  it('falls back to defaultValue, then black, when modelValue is not given', async () => {
    const withDefault = await mountSuspended(ColorPicker, { props: { defaultValue: '#00ff00' } })
    expect(withDefault.text()).toContain('#00ff00')
    withDefault.unmount()

    const withNeither = await mountSuspended(ColorPicker)
    expect(withNeither.text()).toContain('#000000')
    withNeither.unmount()
  })

  // Popover's own teleported content lands in document.body, outside the
  // wrapper's own DOM subtree - every test below that opens the popover
  // unmounts at the end (mirroring select.test.ts's own established
  // pattern) so a later test's document.body query can't accidentally
  // pick up a still-open earlier instance's leftover content.
  it('opens a popover on trigger click, with the area, hue slider, and alpha slider all present', async () => {
    const wrapper = await mountSuspended(ColorPicker, { props: { modelValue: '#7c3aed' } })
    await open(wrapper)

    expect(document.body.querySelector('[role="application"][aria-roledescription="Color picker"]')).toBeTruthy()
    expect(document.body.querySelector('[role="slider"][aria-label="Hue"]')).toBeTruthy()
    expect(document.body.querySelector('[role="slider"][aria-label="Alpha"]')).toBeTruthy()
    expect(document.body.querySelector('input[type="text"]')).toBeTruthy()

    wrapper.unmount()
  })

  it('alpha=false hides the alpha slider but keeps hue and the area', async () => {
    const wrapper = await mountSuspended(ColorPicker, { props: { modelValue: '#7c3aed', alpha: false } })
    await open(wrapper)

    expect(document.body.querySelector('[role="slider"][aria-label="Hue"]')).toBeTruthy()
    expect(document.body.querySelector('[role="slider"][aria-label="Alpha"]')).toBeFalsy()

    wrapper.unmount()
  })

  it('committing a new value in the hex field updates modelValue and the trigger', async () => {
    const wrapper = await mountSuspended(ColorPicker, { props: { modelValue: '#7c3aed' } })
    await open(wrapper)

    const field = document.body.querySelector('input[type="text"]') as HTMLInputElement
    field.value = '#00ff00'
    field.dispatchEvent(new Event('input', { bubbles: true }))
    field.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['#00ff00'])
    expect(wrapper.text()).toContain('#00ff00')

    wrapper.unmount()
  })

  it('arrow-key interaction on the hue thumb changes modelValue', async () => {
    const wrapper = await mountSuspended(ColorPicker, { props: { modelValue: '#7c3aed' } })
    await open(wrapper)

    const hueThumb = document.body.querySelector('[role="slider"][aria-label="Hue"]') as HTMLElement
    hueThumb.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await nextTick()

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted!.at(-1)![0]).not.toBe('#7c3aed')

    wrapper.unmount()
  })

  it('swatches renders clickable presets that update modelValue on click, omitted entirely without the prop', async () => {
    const withoutSwatches = await mountSuspended(ColorPicker, { props: { modelValue: '#7c3aed' } })
    await open(withoutSwatches)
    expect(document.body.querySelectorAll('[role="option"]')).toHaveLength(0)
    withoutSwatches.unmount()

    const wrapper = await mountSuspended(ColorPicker, {
      props: { modelValue: '#7c3aed', swatches: ['#ef4444', '#22c55e', '#3b82f6'] },
    })
    await open(wrapper)

    const options = document.body.querySelectorAll('[role="option"]')
    expect(options).toHaveLength(3)

    const green = Array.from(options).find(el => el.getAttribute('data-color') === '#22c55e') as HTMLElement
    green.click()
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['#22c55e'])
    expect(wrapper.text()).toContain('#22c55e')

    wrapper.unmount()
  })

  // Popover.vue has no disabled concept of its own (unlike Select's
  // ComboboxRoot, which gates opening at the JS level) - this only ever
  // disables the trigger `<button>` itself, which is sufficient for a
  // real user (a disabled button is unclickable/unfocusable by real
  // mouse, keyboard, or touch input) but not for a synthetic
  // dispatchEvent the way `.trigger('click')` issues, in either a real
  // browser or this test environment - confirmed by checking real
  // browser semantics directly, not assumed. Matches NavigationMenu's
  // own established pattern for a disabled Popover-based trigger:
  // assert the marker attribute, not a click's absence of effect.
  it('disabled marks the trigger unclickable', async () => {
    const wrapper = await mountSuspended(ColorPicker, { props: { modelValue: '#7c3aed', disabled: true } })

    expect(trigger(wrapper).attributes('disabled')).toBeDefined()

    wrapper.unmount()
  })
})

// window.matchMedia isn't simulated in this test environment (it never
// matches a real viewport size - see dashboard-group.test.ts's own note
// on this), so useIsMobile's underlying query is stubbed directly here to
// exercise both branches deterministically instead. Same helper as
// select.test.ts/autocomplete.test.ts/date-picker.test.ts's own copies.
function mockMatchMedia(matches: boolean) {
  const original = window.matchMedia
  window.matchMedia = ((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia
  return () => {
    window.matchMedia = original
  }
}

function mockResponsiveMatchMedia(matches: boolean) {
  const original = window.matchMedia
  let current = matches
  const listeners = new Set<(event: MediaQueryListEvent) => void>()
  const mediaQuery = {
    get matches() { return current },
    media: '(max-width: 767px)',
    onchange: null,
    addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => listeners.add(listener),
    removeEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => listeners.delete(listener),
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  } as unknown as MediaQueryList
  window.matchMedia = (() => mediaQuery) as unknown as typeof window.matchMedia
  return {
    setMatches(value: boolean) {
      current = value
      listeners.forEach(listener => listener({ matches: value } as MediaQueryListEvent))
    },
    restore() {
      window.matchMedia = original
    },
  }
}

// Popover's own desktop content also carries role="dialog" (confirmed by
// reading the rendered DOM directly - Reka's PopoverContent sets it by
// default, same reason date-picker.test.ts's own hasModalOverlay exists
// rather than a [role=dialog] check), so the reliable discriminator
// between the two presentations is Modal's sibling backdrop overlay,
// as in modal.test.ts. Its configured color is irrelevant to presentation.
function hasModalOverlay() {
  return [...document.body.querySelectorAll('[role="dialog"]')]
    .some(dialog => dialog.previousElementSibling?.getAttribute('data-state') === 'open')
}

describe('colorPicker (adaptive)', () => {
  it('adaptive unset (default false): still the anchored popover even on a mobile-matching viewport', async () => {
    const restore = mockMatchMedia(true)
    const wrapper = await mountSuspended(ColorPicker, { props: { modelValue: '#7c3aed' } })
    await open(wrapper)

    expect(hasModalOverlay()).toBe(false)
    expect(document.body.querySelector('[role="application"]')).toBeTruthy()

    wrapper.unmount()
    restore()
  })

  it('adaptive=true on a desktop viewport: still the anchored popover, not a Modal', async () => {
    const restore = mockMatchMedia(false)
    const wrapper = await mountSuspended(ColorPicker, { props: { modelValue: '#7c3aed', adaptive: true } })
    await open(wrapper)

    expect(hasModalOverlay()).toBe(false)
    expect(document.body.querySelector('[role="application"]')).toBeTruthy()

    wrapper.unmount()
    restore()
  })

  it('adaptive=true on a mobile-matching viewport: renders a Modal, and the hex field there still updates modelValue', async () => {
    const restore = mockMatchMedia(true)
    const wrapper = await mountSuspended(ColorPicker, { props: { modelValue: '#7c3aed', adaptive: true } })
    await open(wrapper)

    expect(hasModalOverlay()).toBe(true)
    expect(document.body.querySelector('[role="application"]')).toBeTruthy()

    const field = document.body.querySelector('input[type="text"]') as HTMLInputElement
    field.value = '#00ff00'
    field.dispatchEvent(new Event('input', { bubbles: true }))
    field.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['#00ff00'])

    wrapper.unmount()
    restore()
  })

  it('holds the chosen presentation while open when the viewport crosses the breakpoint', async () => {
    const media = mockResponsiveMatchMedia(true)
    const wrapper = await mountSuspended(ColorPicker, { props: { modelValue: '#7c3aed', adaptive: true } })
    await open(wrapper)
    expect(hasModalOverlay()).toBe(true)

    media.setMatches(false)
    await nextTick()
    expect(hasModalOverlay()).toBe(true)

    wrapper.unmount()
    media.restore()
  })

  it('adaptive=true: the modal content uses the same rounded-md as the desktop popover, not Modal\'s own larger default', async () => {
    const restore = mockMatchMedia(true)
    const wrapper = await mountSuspended(ColorPicker, { props: { modelValue: '#7c3aed', adaptive: true } })
    await open(wrapper)

    const dialog = document.body.querySelector('[role=dialog]')
    expect(dialog?.classList.contains('rounded-[var(--selaras-resolved-radius-md)]')).toBe(true)
    expect(dialog?.classList.contains('rounded-[var(--selaras-resolved-radius-lg)]')).toBe(false)

    wrapper.unmount()
    restore()
  })
})
