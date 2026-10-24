import type { DocsNavigationNode } from '../packages/docs/app/utils/docs-navigation'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { docsContentPath, docsDefaultContentPath, docsIsLocalizedContentPath, docsLocalizedContentPath } from '../packages/docs/app/utils/content-path'
import { docsMessages, formatDocsMessage, resolveDocsMessages } from '../packages/docs/app/utils/docs-messages'
import { applyDocsTranslatedTitles, withoutDocsLocaleFolders } from '../packages/docs/app/utils/docs-navigation'

describe('documentation locale content paths', () => {
  it('keeps the default locale at the content root', () => {
    expect(docsLocalizedContentPath('/components/elements/button', 'en')).toBe('/components/elements/button')
    expect(docsLocalizedContentPath('/', 'en')).toBe('/')
  })

  it('maps a public path to the locale folder without changing the URL', () => {
    expect(docsLocalizedContentPath('/components/elements/button', 'id')).toBe('/id/components/elements/button')
    expect(docsLocalizedContentPath('/components/elements/button/', 'id')).toBe('/id/components/elements/button')
    expect(docsLocalizedContentPath('/', 'id')).toBe('/id')
    expect(docsLocalizedContentPath('/components/elements/button', 'id', 'id')).toBe('/components/elements/button')
  })

  it('strips a locale folder back to the canonical content path', () => {
    expect(docsDefaultContentPath('/id/components/elements/button', 'id')).toBe('/components/elements/button')
    expect(docsDefaultContentPath('/id', 'id')).toBe('/')
    expect(docsDefaultContentPath('/components/elements/button', 'id')).toBe('/components/elements/button')
    // A route that only shares a prefix with the locale code is not localized.
    expect(docsDefaultContentPath('/identity', 'id')).toBe('/identity')
    expect(docsContentPath('/overview/')).toBe('/overview')
  })

  it('detects localized content paths by folder segment', () => {
    expect(docsIsLocalizedContentPath('/id', 'id')).toBe(true)
    expect(docsIsLocalizedContentPath('/id/overview', 'id')).toBe(true)
    expect(docsIsLocalizedContentPath('/identity', 'id')).toBe(false)
    expect(docsIsLocalizedContentPath('/overview', 'id')).toBe(false)
  })
})

describe('documentation UI messages', () => {
  const locales = Object.keys(docsMessages)

  it('ships English and Indonesian copy', () => {
    expect(locales).toContain('en')
    expect(locales).toContain('id')
  })

  it('keeps the same keys in every locale', () => {
    const expected = Object.keys(docsMessages.en!).sort()
    for (const locale of locales)
      expect(Object.keys(docsMessages[locale]!).sort(), locale).toEqual(expected)
  })

  it('has non-empty copy, including placeholders, in every locale', () => {
    for (const locale of locales) {
      for (const [key, value] of Object.entries(docsMessages[locale]!)) {
        expect(typeof value, `${locale}.${key}`).toBe('string')
        expect((value as string).trim(), `${locale}.${key}`).not.toBe('')
        const expectedPlaceholders = [...String((docsMessages.en as Record<string, string>)[key]).matchAll(/\{(\w+)\}/g)].map(match => match[1]).sort()
        const actualPlaceholders = [...(value as string).matchAll(/\{(\w+)\}/g)].map(match => match[1]).sort()
        expect(actualPlaceholders, `${locale}.${key}`).toEqual(expectedPlaceholders)
      }
    }
  })

  it('falls back to English and applies per-locale overrides', () => {
    expect(resolveDocsMessages('fr').skipToContent).toBe('Skip to content')
    expect(resolveDocsMessages('id').skipToContent).toBe('Lewati ke konten')
    expect(resolveDocsMessages('id', 'en', { skipToContent: 'Langsung ke isi' }).skipToContent).toBe('Langsung ke isi')
  })

  it('formats named placeholders', () => {
    expect(formatDocsMessage('Switch to {language}', { language: 'Bahasa Indonesia' })).toBe('Switch to Bahasa Indonesia')
    expect(formatDocsMessage('Keep {unknown}', {})).toBe('Keep {unknown}')
  })
})

describe('documentation locale navigation', () => {
  const tree: DocsNavigationNode[] = [
    {
      title: 'Components',
      path: '/components',
      children: [
        { title: 'Button', path: '/components/button' },
        { title: 'Calendar', path: '/components/calendar' },
      ],
    },
    { title: 'Id', path: '/id', children: [{ title: 'Tombol', path: '/id/components/button' }] },
  ]

  it('removes locale folders from the default navigation tree', () => {
    const result = withoutDocsLocaleFolders(tree, ['id'])
    expect(result.map(node => node.path)).toEqual(['/components'])
    expect(result[0]!.children?.map(node => node.path)).toEqual(['/components/button', '/components/calendar'])
  })

  it('applies translated titles while keeping the default structure', () => {
    const result = applyDocsTranslatedTitles(tree, new Map([['/components/button', 'Tombol']]))
    expect(result[0]!.children).toEqual([
      { title: 'Tombol', path: '/components/button' },
      { title: 'Calendar', path: '/components/calendar' },
    ])
  })
})

describe('documentation Indonesian translations', () => {
  const root = new URL('..', import.meta.url).pathname
  const paths = [
    'index.md',
    'overview/getting-started/introduction.md',
    'overview/getting-started/installation.md',
    'overview/getting-started/component-usage.md',
    'overview/getting-started/nuxt-configuration.md',
    'overview/getting-started/icons.md',
    'overview/getting-started/messages.md',
    'overview/getting-started/adaptive-interfaces.md',
    'overview/getting-started/typescript.md',
    'overview/getting-started/accessibility.md',
    'overview/getting-started/migrating-to-1.md',
    'overview/agent-support/overview.md',
    'overview/agent-support/documentation.md',
    'overview/agent-support/skills.md',
    'overview/agent-support/mcp.md',
    'overview/theming/overview.md',
    'overview/theming/css-tokens.md',
    'overview/theming/color-roles.md',
    'overview/theming/color-modes.md',
    'overview/theming/component-styling.md',
    'overview/theming/global-configuration.md',
    'overview/theming/scoped-themes.md',
    'overview/theming/complete-themes.md',
    'components/elements/alert.md',
    'components/elements/avatar-group.md',
    'components/elements/avatar.md',
    'components/elements/badge.md',
    'components/elements/button-group.md',
    'components/elements/button.md',
    'components/elements/chip.md',
    'components/elements/icon.md',
    'components/elements/kbd.md',
    'components/elements/progress.md',
    'components/elements/separator.md',
    'components/elements/skeleton.md',
    'components/elements/toggle-group.md',
    'components/elements/toggle.md',
    'components/elements/toolbar.md',
    'components/data/calendar.md',
    'components/data/empty-state.md',
    'components/data/table.md',
    'components/data/timeline.md',
    'components/layout/app.md',
    'components/layout/card-group.md',
    'components/layout/card.md',
    'components/layout/color-mode-switch.md',
    'components/layout/color-mode-toggle.md',
    'components/layout/container.md',
    'components/layout/header.md',
    'components/layout/scroll-area.md',
    'components/layout/splitter.md',
    'components/layout/theme.md',
    'components/navigation/accordion.md',
    'components/navigation/breadcrumb.md',
    'components/navigation/collapsible.md',
    'components/navigation/navigation-menu.md',
    'components/navigation/pagination.md',
    'components/navigation/stepper.md',
    'components/navigation/tabs.md',
    'components/navigation/tree.md',
    'components/overlays/alert-dialog.md',
    'components/overlays/command-palette.md',
    'components/overlays/context-menu.md',
    'components/overlays/drawer.md',
    'components/overlays/dropdown.md',
    'components/overlays/modal.md',
    'components/overlays/popover.md',
    'components/overlays/slideover.md',
    'components/overlays/toast.md',
    'components/overlays/tooltip.md',
    'components/typography/callout.md',
    'components/typography/code-button.md',
    'components/typography/code-group.md',
    'components/typography/code-tree.md',
    'components/typography/file-tree.md',
    'components/typography/prose.md',
    'components/typography/read-more.md',
    'blocks/overview.md',
    'blocks/sign-in.md',
    'blocks/dashboard-overview.md',
    'blocks/profile-settings.md',
    'blocks/data-management.md',
    'blocks/editors/tiptap.md',
    'blocks/editors/lexical.md',
    'blocks/editors/quill.md',
    'composites/dashboard/dashboard-group.md',
    'composites/dashboard/dashboard-navbar.md',
    'composites/dashboard/dashboard-panel.md',
    'composites/dashboard/dashboard-resize-handle.md',
    'composites/dashboard/dashboard-sidebar.md',
    'composites/dashboard/dashboard-sidebar-toggle.md',
    'composites/documentation/content-navigation.md',
    'composites/documentation/content-surround.md',
    'composites/documentation/content-toc.md',
    'composites/documentation/page-aside.md',
    'composites/documentation/page-header.md',
    'utilities/composables/use-confirm.md',
    'utilities/composables/use-drawer.md',
    'utilities/composables/use-icons.md',
    'utilities/composables/use-locale.md',
    'utilities/composables/use-messages.md',
    'utilities/composables/use-modal.md',
    'utilities/composables/use-slideover.md',
    'utilities/directives/hotkey.md',
    'utilities/directives/mask.md',
    'utilities/directives/ripple.md',
    'components/forms/autocomplete.md',
    'components/forms/checkbox.md',
    'components/forms/color-picker.md',
    'components/forms/date-picker.md',
    'components/forms/editable.md',
    'components/forms/file-upload.md',
    'components/forms/form-field.md',
    'components/forms/input-group.md',
    'components/forms/input-number.md',
    'components/forms/input.md',
    'components/forms/listbox.md',
    'components/forms/pin-input.md',
    'components/forms/radio-group.md',
    'components/forms/rating.md',
    'components/forms/select.md',
    'components/forms/slider.md',
    'components/forms/switch.md',
    'components/forms/textarea.md',
    'components/forms/transfer-list.md',
    'components/forms/validation.md',
  ]

  it.each(paths)('has an Indonesian translation for %s', (path) => {
    const content = readFileSync(join(root, 'docs/content/id', path), 'utf8')
    expect(content).toMatch(/^---\n/)
    expect(content).toMatch(/title:/)
    expect(content).toMatch(/description:/)
    expect(content.length).toBeGreaterThan(100)
  })
})
