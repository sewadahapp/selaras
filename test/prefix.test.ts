import { Buffer } from 'node:buffer'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'
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

  it('renders a registered semantic role marker in the prefixed packed consumer', async () => {
    const html = await $fetch('/')
    expect(html).toMatch(/<button[^>]*data-selaras-color="enterprise"[^>]*id="enterprise-button"/)
  })

  it('renders a second CSS-variable-backed role without changing its values', async () => {
    const html = await $fetch('/')
    expect(html).toMatch(/<button[^>]*data-selaras-color="brand-vars"[^>]*id="brand-vars-button"/)
  })

  it('falls back safely for an unknown runtime role in the packed consumer', async () => {
    const html = await $fetch('/')
    const button = html.match(/<button[^>]*id="unknown-role-button"[^>]*>/)?.[0]
    expect(button).toBeTruthy()
    expect(button).toContain('data-selaras-color="primary"')
    expect(button).toContain('bg-')
  })

  it('generates real CSS for the tw:-prefixed classes - the whole point of the build-time safelist', async () => {
    const css = await fetchCss()
    expect(css).toContain('.tw\\:inline-flex')
  })

  it('uses the host breakpoint for prefixed library and application utilities', async () => {
    const css = await fetchCss()
    expect(css).toContain('--tw-breakpoint-md:60rem')
    expect(css).toContain('--selaras-adaptive-breakpoint:var(--tw-breakpoint-md)')
    expect(css).toContain('.tw\\:md\\:block')
    expect(css).toMatch(/@media\s*\(width>=60rem\)/)
    expect(css).not.toMatch(/@media\s*\(width>=48rem\)/)
  })

  it('ships generated light/dark role CSS alongside the prefixed consumer stylesheet', async () => {
    const css = await fetchCss()
    expect(css).toContain('[data-selaras-color=enterprise]')
    expect(css).toContain('--selaras-resolved-color-enterprise-fill:var(--selaras-color-enterprise-fill,#5134a8)')
    expect(css).toContain('--_selaras-color-fill:var(--selaras-color-enterprise-fill,var(--selaras-resolved-color-enterprise-fill))')
    expect(css).toContain(':root.dark [data-selaras-theme]')
  })

  it('preserves CSS-variable-backed role values in generated light/dark bindings', async () => {
    const css = await fetchCss()
    expect(css).toContain('[data-selaras-color=brand-vars]')
    expect(css).toContain('--selaras-resolved-color-brand-vars-fill:var(--selaras-color-brand-vars-fill,var(--company-brand-fill))')
    expect(css).toContain(':root.dark [data-selaras-theme]')
    expect(css).toContain('--selaras-resolved-color-brand-vars-fill:var(--selaras-color-brand-vars-fill,var(--company-brand-dark-fill))')
  })

  it('ships a real owned foundation value, rather than only a class rule that references a pruned variable', async () => {
    const css = await fetchCss()
    const match = css.match(/--tw-color-selaras-indigo-500:([^;]+);/)
    expect(match?.[1]).toBeTruthy()
    expect(match![1]).not.toBe('initial')
  })

  it('keeps host palette names independent from Selaras-owned foundations under a configured prefix', async () => {
    const css = await fetchCss()
    const host = css.match(/--tw-color-primary-500:([^;]+);/)
    const selaras = css.match(/--tw-color-selaras-indigo-500:([^;]+);/)
    // The host keeps its conventional `primary` namespace while Selaras
    // retains its stock indigo foundation in its owned namespace.
    expect(host?.[1]).toContain('90%')
    expect(selaras?.[1]).toContain('47.55%')
    expect(selaras?.[1]).not.toContain('90%')
  })

  it('generates real animation CSS for tw-animate-css\'s enter/exit utilities (Modal/Dropdown/Select/Toast/Tooltip/Drawer transitions) - these live in theme.css\'s own compilation, not the safelist\'s, so without importing tw-animate-css there too the safelist would generate an empty rule despite the class existing', async () => {
    const css = await fetchCss()
    // A real animation declaration, not an empty/absent rule - matches
    // modal.ts's own `animate-in`/`animate-out` usage.
    expect(css).toContain('.tw\\:animate-in{animation:enter')
    expect(css).toContain('.tw\\:animate-out{animation:exit')
  })

  it('keeps the packed consumer stylesheet within the initial size budget', async () => {
    const css = await fetchCss()
    expect(Buffer.byteLength(css)).toBeLessThanOrEqual(125_000)
    expect(gzipSync(css).byteLength).toBeLessThanOrEqual(18_000)
  })

  it('lets a :ui override actually win over a conflicting base class - the real bug: tailwind-merge has no concept of tw:-style prefixes, so without normalizing the override before merging, both the base and the override class would survive and Selaras\'s own default (loaded first) would win the cascade', async () => {
    const html = await $fetch('/')
    const overrideButton = html.match(/<button[^>]*id="override-button"[^>]*class="([^"]+)"/)?.[1]
    expect(overrideButton).toBeTruthy()
    expect(overrideButton).toContain('tw:bg-purple-700')
    // The base (non-variant) selected-fill class must be
    // gone, not just co-present alongside the override - the hover:/active:
    // variants of it are a separate conflict group and correctly remain.
    expect(overrideButton).not.toContain('tw:bg-[var(--_selaras-color-fill)]')
    expect(overrideButton).toContain('tw:hover:bg-[var(--_selaras-color-fill-hover)]')
  })
})
