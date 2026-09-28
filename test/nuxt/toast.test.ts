import { mountSuspended } from '@nuxt/test-utils/runtime'
import { ToastProvider, ToastRoot } from 'reka-ui'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import Theme from '../../src/runtime/components/Theme.vue'
import Toast from '../../src/runtime/components/Toast.vue'
import { useToast } from '../../src/runtime/composables/use-toast'
import { useToastService } from '../../src/runtime/internal/programmatic-services'
import { layoutToastStack, placeToast, TOAST_PEEK } from '../../src/runtime/internal/toast-stack'
import ToastItemRenderer from '../../src/runtime/internal/ToastItemRenderer.vue'

// Toast.vue only injects a ToastProviderContext - it doesn't provide one
// itself, since in the real app SApp's own ToastProvider ancestor does that
// (see App.vue). Mounting it bare here would throw on injection, so tests
// wrap it in a real ToastProvider the same way SApp does.
const ToastHarness = defineComponent({
  render: () => h(ToastProvider, () => h(Toast)),
})

const ConfiguredToastHarness = defineComponent({
  render: () => h(ToastProvider, () => h(Toast, { position: 'top-center', expand: false, max: 2 })),
})

const TimedToastHarness = defineComponent({
  render: () => h(ToastProvider, () => h(Toast, { duration: 9000 })),
})

const ScopedToastTrigger = defineComponent({
  setup() {
    const { add } = useToast()
    return () => h('button', { 'data-testid': 'scoped-toast-trigger', 'onClick': () => add({ title: 'Scoped', color: 'premium' as any }) }, 'Show')
  },
})

const ThemedToastHarness = defineComponent({
  render: () => h(ToastProvider, () => [
    h(Theme, { ui: { toast: {
      compoundVariants: [{ color: 'premium', class: { root: 'tracking-widest' } }],
    } } }, () => h(ScopedToastTrigger)),
    h(Toast),
  ]),
})

const ScopedToastHarness = defineComponent({
  render: () => h(ToastProvider, () => [
    h(Theme, { as: 'section', tokens: { light: { colors: { premium: { fill: '#5134a8' } } } } }, () => h(ScopedToastTrigger)),
    h(Toast),
  ]),
})

const SurvivingScopedToastHarness = defineComponent({
  setup() {
    const showScope = ref(true)
    return () => h(ToastProvider, () => [
      showScope.value
        ? h(Theme, { as: 'section', tokens: { light: { colors: { premium: { fill: '#5134a8' } } } } }, () => h(ScopedToastTrigger))
        : null,
      h('button', { 'data-testid': 'remove-scope', 'onClick': () => { showScope.value = false } }, 'Remove scope'),
      h(Toast),
    ])
  },
})

// The Nuxt test harness reuses one application instance within this file, so
// its app-owned queue is cleared between tests.
afterEach(() => {
  useToastService().dispose()
})

// ToastRootImpl teleports each root into the real ToastViewport DOM node
// once the provider's viewport ref is set - invisible to wrapper.find, same
// as Modal's DialogContent (see modal.test.ts). Query document.body instead.
let wrapper: Awaited<ReturnType<typeof mountSuspended>> | undefined

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

describe('toast', () => {
  it('binds a custom semantic role to a queued toast root', async () => {
    const { add } = useToast()
    add({ title: 'Custom', color: 'premium' as any })
    wrapper = await mountSuspended(ToastHarness)
    await new Promise(resolve => setTimeout(resolve, 50))

    const root = document.body.querySelector('[data-selaras-color="premium"]')
    expect(root).toBeTruthy()
    expect(root?.getAttribute('style')).not.toContain('--_selaras-color-fill')
    expect(statusIcons()).toHaveLength(0)
  })

  it('uses the toast semantic color for its close button', async () => {
    const { add } = useToast()
    add({ title: 'Saved', color: 'success' })
    wrapper = await mountSuspended(ToastHarness)
    await new Promise(resolve => setTimeout(resolve, 50))

    const toast = document.body.querySelector('[data-selaras-color="success"]')
    const closeButton = toast?.querySelector('button')
    expect(closeButton?.getAttribute('data-selaras-color')).toBe('success')
  })

  it('passes a custom semantic role to scoped recipe conditions', async () => {
    wrapper = await mountSuspended(ThemedToastHarness)
    await wrapper.find('[data-testid="scoped-toast-trigger"]').trigger('click')
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(document.body.querySelector('[data-selaras-color="premium"]')?.classList).toContain('tracking-widest')
  })

  it('keeps a colorless toast neutral even when it has an explicit icon', async () => {
    const { add } = useToast()
    add({ title: 'Plain', icon: 'lucide:star' })
    wrapper = await mountSuspended(ToastHarness)
    await new Promise(resolve => setTimeout(resolve, 50))

    const root = Array.from(document.body.querySelectorAll('[data-state]')).find(element => element.textContent?.includes('Plain'))
    expect(root?.hasAttribute('data-selaras-color')).toBe(false)
    expect(statusIcons()[0]?.classList).toContain('text-[var(--_selaras-color-text,var(--selaras-resolved-text-muted))]')
  })

  it('owns a snapshot of the nearest explicit theme when the toast is added', async () => {
    wrapper = await mountSuspended(ScopedToastHarness)
    await wrapper.find('[data-testid="scoped-toast-trigger"]').trigger('click')
    await new Promise(resolve => setTimeout(resolve, 50))

    const sourceScope = wrapper.find('[data-selaras-theme]').attributes('data-selaras-theme')
    const root = document.body.querySelector('[data-selaras-color="premium"]')
    const snapshotScope = root?.getAttribute('data-selaras-theme')
    expect(snapshotScope).toMatch(/^p/)
    expect(snapshotScope).not.toBe(sourceScope)
    expect([...document.head.querySelectorAll('style')].some(style => style.textContent?.includes(`[data-selaras-theme="${snapshotScope}"]`) && style.textContent.includes('#5134a8'))).toBe(true)
  })

  it('keeps its theme snapshot after the caller scope unmounts', async () => {
    wrapper = await mountSuspended(SurvivingScopedToastHarness)
    await wrapper.find('[data-testid="scoped-toast-trigger"]').trigger('click')
    await new Promise(resolve => setTimeout(resolve, 50))
    const root = document.body.querySelector('[data-selaras-color="premium"]')
    const snapshotScope = root?.getAttribute('data-selaras-theme')

    await wrapper.find('[data-testid="remove-scope"]').trigger('click')
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(wrapper.find('section[data-selaras-theme]').exists()).toBe(false)
    expect(document.body.querySelector('[data-selaras-color="premium"]')?.getAttribute('data-selaras-theme')).toBe(snapshotScope)
    expect([...document.head.querySelectorAll('style')].some(style => style.textContent?.includes(`[data-selaras-theme="${snapshotScope}"]`) && style.textContent.includes('#5134a8'))).toBe(true)
  })

  it('renders an added toast\'s title and description', async () => {
    const { add } = useToast()
    add({ title: 'Saved', description: 'Your changes were saved.' })
    wrapper = await mountSuspended(ToastHarness)
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(document.body.textContent).toContain('Saved')
    expect(document.body.textContent).toContain('Your changes were saved.')
  })

  it('renders one root per queued toast', async () => {
    const { add } = useToast()
    add({ title: 'First' })
    add({ title: 'Second' })
    wrapper = await mountSuspended(ToastHarness)
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(document.body.textContent).toContain('First')
    expect(document.body.textContent).toContain('Second')
  })

  function rootFor(title: string) {
    return Array.from(document.body.querySelectorAll<HTMLElement>('[data-state="open"]')).find(element => element.textContent?.includes(title))
  }

  it('supports positioned, collapsed toast stacks', async () => {
    const { add } = useToast()
    add({ title: 'First' })
    add({ title: 'Second' })
    add({ title: 'Third' })
    wrapper = await mountSuspended(ConfiguredToastHarness)
    await new Promise(resolve => setTimeout(resolve, 50))

    const root = rootFor('Second')
    const frontRoot = rootFor('Third')
    expect(document.body.textContent).not.toContain('First')
    expect(frontRoot?.dataset.stack).toBe('front')
    expect(root?.dataset.stack).toBe('behind')
    // A top stack grows downward, so the card behind peeks out below.
    expect(root?.style.transform).toBe(`translateY(${TOAST_PEEK}px) scale(0.95)`)
    expect(Number(frontRoot?.style.zIndex)).toBeGreaterThan(Number(root?.style.zIndex))
    expect(root?.style.height).toMatch(/px$/)
    expect(frontRoot?.style.height).toBe('')
    expect(root?.className).toContain('top-4')
    expect(root?.parentElement?.className).toContain('top-0')
    expect(root?.parentElement?.className).toContain('left-1/2')
    expect(root?.parentElement?.className).toContain('-translate-x-1/2')

    root?.parentElement?.dispatchEvent(new MouseEvent('mouseenter'))
    await nextTick()
    expect(rootFor('Second')?.dataset.stack).toBe('expanded')
    expect(rootFor('Second')?.style.height).toBe('')

    rootFor('Second')?.parentElement?.dispatchEvent(new MouseEvent('mouseleave'))
    await nextTick()
    expect(rootFor('Second')?.dataset.stack).toBe('behind')
  })

  it.each([
    ['stacks by default', ToastHarness, 'behind'],
    ['shows every toast separately with expand', defineComponent({ render: () => h(ToastProvider, () => h(Toast, { expand: true })) }), 'expanded'],
  ] as const)('%s', async (_, harness, olderState) => {
    const { add } = useToast()
    add({ title: 'First' })
    add({ title: 'Second' })
    wrapper = await mountSuspended(harness)
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(rootFor('First')?.dataset.stack).toBe(olderState)
  })

  it('expands while focus is inside the stack', async () => {
    const { add } = useToast()
    add({ title: 'First' })
    add({ title: 'Second' })
    wrapper = await mountSuspended(ToastHarness)
    await new Promise(resolve => setTimeout(resolve, 50))

    rootFor('Second')?.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    await nextTick()
    expect(rootFor('First')?.dataset.stack).toBe('expanded')
  })

  it('keeps a dismissed toast mounted while it animates out', async () => {
    const { add, remove } = useToast()
    add({ title: 'First' })
    const second = add({ title: 'Second' })
    wrapper = await mountSuspended(ToastHarness)
    await new Promise(resolve => setTimeout(resolve, 50))

    remove(second)
    await nextTick()
    await nextTick()
    // The older card moves to the front straight away...
    expect(rootFor('First')?.dataset.stack).toBe('front')
    // ...while the dismissed one is still in the page, closing.
    expect(document.body.textContent).toContain('Second')
    await new Promise(resolve => setTimeout(resolve, 400))
    expect(document.body.textContent).not.toContain('Second')
  })

  it('lays out a stack by depth and fans it out by measured height', () => {
    const collapsed = layoutToastStack([60, 100, 80, 70], false)
    expect(collapsed.height).toBe(60 + 2 * TOAST_PEEK)
    expect(placeToast(1, collapsed, false, -1)).toMatchObject({ state: 'behind', height: '60px', transform: `translateY(-${TOAST_PEEK}px) scale(0.95)` })
    // Cards past the visible depth wait in the last slot.
    expect(placeToast(3, collapsed, false, -1)).toMatchObject({ state: 'hidden', transform: placeToast(2, collapsed, false, -1).transform })

    const expanded = layoutToastStack([60, 100, 80], true)
    expect(expanded.offsets).toEqual([0, 72, 184])
    expect(expanded.height).toBe(264)
    expect(placeToast(2, expanded, true, 1)).toMatchObject({ state: 'expanded', height: undefined, transform: 'translateY(184px) scale(1)' })
  })

  it('uses the renderer duration as a fallback and lets each toast override it', async () => {
    const { add } = useToast()
    add({ title: 'Default duration' })
    add({ title: 'Custom duration', duration: 2500 })
    wrapper = await mountSuspended(TimedToastHarness)
    await new Promise(resolve => setTimeout(resolve, 50))

    const rendered = wrapper.findAllComponents(ToastItemRenderer)
    expect(rendered).toHaveLength(2)
    expect(rendered[0]!.findComponent(ToastRoot).props('duration')).toBe(9000)
    expect(rendered[1]!.findComponent(ToastRoot).props('duration')).toBe(2500)
  })

  it('removes the toast from state when its close button is clicked', async () => {
    const { add } = useToast()
    const { toasts } = useToastService()
    const id = add({ title: 'Dismiss me' })
    wrapper = await mountSuspended(ToastHarness)
    await new Promise(resolve => setTimeout(resolve, 50))

    const closeButton = document.body.querySelector<HTMLButtonElement>('button[aria-label="Close"]')
    expect(closeButton).toBeTruthy()
    closeButton!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(toasts.value.find(t => t.id === id)).toBeUndefined()
  })

  // Excludes the close button's own icon (always rendered, "hugeicons:cancel-01")
  // from every query below - only interested in the status icon these
  // tests are actually about.
  function statusIcons() {
    return Array.from(document.body.querySelectorAll('.iconify')).filter(el => !el.closest('button[aria-label="Close"]'))
  }

  it('a color toast renders with its color\'s own default icon', async () => {
    const { add } = useToast()
    add({ title: 'Saved', color: 'success' })
    wrapper = await mountSuspended(ToastHarness)
    await new Promise(resolve => setTimeout(resolve, 50))

    const icons = statusIcons()
    expect(icons).toHaveLength(1)
    expect(icons[0]!.classList.contains('i-hugeicons:checkmark-circle-01')).toBe(true)
  })

  it('an explicit icon overrides the color\'s own default', async () => {
    const { add } = useToast()
    add({ title: 'Saved', color: 'success', icon: 'lucide:star' })
    wrapper = await mountSuspended(ToastHarness)
    await new Promise(resolve => setTimeout(resolve, 50))

    const icons = statusIcons()
    expect(icons).toHaveLength(1)
    expect(icons[0]!.classList.contains('i-lucide:star')).toBe(true)
  })

  it('renders no icon at all when neither color nor icon is set', async () => {
    const { add } = useToast()
    add({ title: 'Saved' })
    wrapper = await mountSuspended(ToastHarness)
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(statusIcons()).toHaveLength(0)
  })
})
