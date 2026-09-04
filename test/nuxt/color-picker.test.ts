import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import ColorPicker from '../../src/runtime/components/ColorPicker.vue'

function trigger(wrapper: Awaited<ReturnType<typeof mountSuspended>>) {
  return wrapper.find('[aria-haspopup="dialog"]')
}

async function open(wrapper: Awaited<ReturnType<typeof mountSuspended>>) {
  await trigger(wrapper).trigger('click')
  await nextTick()
}

describe('colorPicker', () => {
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
