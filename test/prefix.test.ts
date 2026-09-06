import { fileURLToPath } from 'node:url'
import { $fetch, setup } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

describe('classPrefix', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/prefix', import.meta.url)),
  })

  async function fetchCss() {
    const html = await $fetch('/')
    const cssHref = html.match(/<link rel="stylesheet" href="([^"]+\.css)"/)?.[1]
    expect(cssHref).toBeTruthy()
    return $fetch<string>(cssHref!)
  }

  it('renders the component with tw:-prefixed classes on its root', async () => {
    const html = await $fetch('/')
    expect(html).toContain('tw:inline-flex')
    // Never double-prefixed, and no unprefixed class ever sits alongside it
    // on the same root - would mean the module option didn't reach the
    // runtime transform at all.
    expect(html).not.toContain('tw:tw:')
  })

  it('generates real CSS for the tw:-prefixed classes - the whole point of the build-time safelist', async () => {
    const css = await fetchCss()
    expect(css).toContain('.tw\\:inline-flex')
  })

  it('actually declares a real color value under the renamed theme variable - not just a class name/rule that looks right (this is exactly what silently broke before: the class rule existed, but the CSS variable it referenced had been pruned)', async () => {
    const css = await fetchCss()
    const match = css.match(/--tw-color-primary-500:([^;]+);/)
    expect(match?.[1]).toBeTruthy()
    expect(match![1]).not.toBe('initial')
  })

  it('respects a consumer\'s own @theme override - Tailwind\'s own theme-merge-by-key semantics keep working under a configured prefix, not just Selaras\'s unprefixed default', async () => {
    const css = await fetchCss()
    const match = css.match(/--tw-color-primary-500:([^;]+);/)
    // The fixture's own main.css declares a @theme override (oklch(0.9 0.15
    // 300), which Tailwind normalizes to percentage form) after importing
    // theme.css - only the override's value should survive, not Selaras's
    // own default (oklch(0.4755 0.2026 279.99)).
    expect(match?.[1]).toContain('90%')
    expect(css).not.toContain('0.4755')
  })

  it('generates real animation CSS for tw-animate-css\'s enter/exit utilities (Modal/Dropdown/Select/Toast/Tooltip/Drawer transitions) - these live in theme.css\'s own compilation, not the safelist\'s, so without importing tw-animate-css there too the safelist would generate an empty rule despite the class existing', async () => {
    const css = await fetchCss()
    // A real animation declaration, not an empty/absent rule - matches
    // modal.ts's own `animate-in`/`animate-out` usage.
    expect(css).toContain('.tw\\:animate-in{animation:enter')
    expect(css).toContain('.tw\\:animate-out{animation:exit')
  })

  it('lets a :ui override actually win over a conflicting base class - the real bug: tailwind-merge has no concept of tw:-style prefixes, so without normalizing the override before merging, both the base and the override class would survive and Selaras\'s own default (loaded first) would win the cascade', async () => {
    const html = await $fetch('/')
    const overrideButton = html.match(/<button[^>]*id="override-button"[^>]*class="([^"]+)"/)?.[1]
    expect(overrideButton).toBeTruthy()
    expect(overrideButton).toContain('tw:bg-purple-700')
    // The base (non-variant) `bg-[var(--ui-primary)]`-derived class must be
    // gone, not just co-present alongside the override - the hover:/active:
    // variants of it are a separate conflict group and correctly remain.
    expect(overrideButton).not.toContain('tw:bg-[var(--ui-primary)]')
    expect(overrideButton).toContain('tw:hover:bg-[var(--ui-primary-hover)]')
  })
})
