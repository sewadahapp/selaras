import { mountSuspended } from '@nuxt/test-utils/runtime'
import { ToastProvider, ToastRoot } from 'reka-ui'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import Theme from '../../src/runtime/components/Theme.vue'
import Toast from '../../src/runtime/components/Toast.vue'
import { useToast } from '../../src/runtime/composables/use-toast'
import { useToastService } from '../../src/runtime/internal/programmatic-services'
import { getToastStackMargin } from '../../src/runtime/internal/toast-stack'
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

  it('supports positioned, collapsed toast stacks', async () => {
    const { add } = useToast()
    add({ title: 'First' })
    add({ title: 'Second' })
    add({ title: 'Third' })
    wrapper = await mountSuspended(ConfiguredToastHarness)
    await new Promise(resolve => setTimeout(resolve, 50))

    const root = Array.from(document.body.querySelectorAll('[data-state="open"]')).find(element => element.textContent?.includes('Second'))
    const frontRoot = Array.from(document.body.querySelectorAll('[data-state="open"]')).find(element => element.textContent?.includes('Third'))
    const displayedTitles = Array.from(document.body.querySelectorAll('[data-state="open"]'))
      .map(element => ['First', 'Second', 'Third'].find(title => element.textContent?.includes(title)))
      .filter((title): title is string => title !== undefined)
    expect(document.body.textContent).not.toContain('First')
    expect(document.body.textContent).toContain('Third')
    expect(displayedTitles).toEqual(['Third', 'Second'])
    expect(root?.className).toContain('transition-[margin,transform,opacity]')
    expect((root as HTMLElement | undefined)?.style.marginBlockStart).toBe('-36px')
    expect(frontRoot?.className).toContain('first:z-10')
    expect(root?.className).toContain('data-[state=open]:slide-in-from-top-2')
    expect(root?.className).toContain('data-[state=closed]:slide-out-to-top-2')
    expect(root?.parentElement?.className).toContain('top-0')
    expect(root?.parentElement?.className).toContain('left-1/2')
    expect(root?.parentElement?.className).toContain('-translate-x-1/2')
    expect(root?.parentElement?.className).toContain('gap-2')

    root?.parentElement?.dispatchEvent(new MouseEvent('mouseenter'))
    await nextTick()
    const expandedRoot = Array.from(document.body.querySelectorAll('[data-state="open"]')).find(element => element.textContent?.includes('Second'))
    expect((expandedRoot as HTMLElement | undefined)?.style.marginBlockStart).toBe('')

    expandedRoot?.parentElement?.dispatchEvent(new MouseEvent('mouseleave'))
    await nextTick()
    const collapsedRoot = Array.from(document.body.querySelectorAll('[data-state="open"]')).find(element => element.textContent?.includes('Second'))
    expect((collapsedRoot as HTMLElement | undefined)?.style.marginBlockStart).toBe('-36px')
  })

  it.each([
    ['stacks by default', ToastHarness, '-36px'],
    ['shows every toast separately with expand', defineComponent({ render: () => h(ToastProvider, () => h(Toast, { expand: true })) }), ''],
  ] as const)('%s', async (_, harness, secondMargin) => {
    const { add } = useToast()
    add({ title: 'First' })
    add({ title: 'Second' })
    wrapper = await mountSuspended(harness)
    await new Promise(resolve => setTimeout(resolve, 50))

    // At the default bottom position the newer toast is the one layered over the first.
    const layered = Array.from(document.body.querySelectorAll('[data-state="open"]')).find(element => element.textContent?.includes('Second'))
    expect((layered as HTMLElement | undefined)?.style.marginBlockStart).toBe(secondMargin)
  })

  it('keeps the same narrow reveal for short and tall stacked toasts', () => {
    expect(getToastStackMargin(52)).toBe('-36px')
    expect(getToastStackMargin(194)).toBe('-178px')
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
