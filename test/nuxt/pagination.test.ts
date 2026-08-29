import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import Pagination from '../../src/runtime/components/Pagination.vue'

describe('pagination', () => {
  it('renders one button per page number when they all fit with no ellipsis', async () => {
    const wrapper = await mountSuspended(Pagination, { props: { total: 30, itemsPerPage: 10, siblingCount: 5 } })
    expect(wrapper.findAll('[data-type="page"]').map(b => b.text())).toEqual(['1', '2', '3'])
    expect(wrapper.find('[data-type="ellipsis"]').exists()).toBe(false)
  })

  it('renders an ellipsis when the page range does not fully fit', async () => {
    const wrapper = await mountSuspended(Pagination, {
      props: { total: 200, itemsPerPage: 10, defaultPage: 1, siblingCount: 1, showEdges: true },
    })
    expect(wrapper.find('[data-type="ellipsis"]').exists()).toBe(true)
  })

  it('emits update:page with the clicked page number', async () => {
    const wrapper = await mountSuspended(Pagination, { props: { total: 30, itemsPerPage: 10 } })
    const buttons = wrapper.findAll('[data-type="page"]')
    await buttons[1]!.trigger('click')
    expect(wrapper.emitted('update:page')?.at(-1)).toEqual([2])
  })

  it('disables Prev on the first page and Next on the last page', async () => {
    const wrapper = await mountSuspended(Pagination, { props: { total: 30, itemsPerPage: 10, defaultPage: 1 } })
    const [prev, next] = wrapper.findAll('button[aria-label="Previous"], button[aria-label="Next"]')
    expect(prev!.attributes('disabled')).toBeDefined()
    expect(next!.attributes('disabled')).toBeUndefined()
  })

  it('does not mount First/Last buttons by default, but does when showFirstLast is set', async () => {
    const withoutFirstLast = await mountSuspended(Pagination, { props: { total: 30, itemsPerPage: 10 } })
    expect(withoutFirstLast.find('button[aria-label="First"]').exists()).toBe(false)
    expect(withoutFirstLast.find('button[aria-label="Last"]').exists()).toBe(false)

    const withFirstLast = await mountSuspended(Pagination, { props: { total: 30, itemsPerPage: 10, showFirstLast: true } })
    expect(withFirstLast.find('button[aria-label="First"]').exists()).toBe(true)
    expect(withFirstLast.find('button[aria-label="Last"]').exists()).toBe(true)
  })

  it('disables every button when disabled is set, even on a page where Prev/Next would otherwise be enabled', async () => {
    const wrapper = await mountSuspended(Pagination, {
      props: { total: 30, itemsPerPage: 10, defaultPage: 2, disabled: true },
    })
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBeGreaterThan(0)
    for (const button of buttons)
      expect(button.attributes('disabled')).toBeDefined()
  })

  it('marks the current page\'s button active (aria-current) and no other', async () => {
    const wrapper = await mountSuspended(Pagination, { props: { total: 30, itemsPerPage: 10, defaultPage: 2 } })
    const buttons = wrapper.findAll('[data-type="page"]')
    expect(buttons[1]!.attributes('aria-current')).toBe('page')
    expect(buttons[0]!.attributes('aria-current')).toBeUndefined()
    expect(buttons[2]!.attributes('aria-current')).toBeUndefined()
  })

  it('renders no Previous/Next when showControls is false', async () => {
    const wrapper = await mountSuspended(Pagination, { props: { total: 30, itemsPerPage: 10, showControls: false } })
    expect(wrapper.find('button[aria-label="Previous"]').exists()).toBe(false)
    expect(wrapper.find('button[aria-label="Next"]').exists()).toBe(false)
  })

  it('renders every control as a real link with the page-derived href when to is set', async () => {
    const wrapper = await mountSuspended(Pagination, {
      props: { total: 30, itemsPerPage: 10, defaultPage: 2, to: (p: number) => `/posts?page=${p}` },
    })
    const pageLinks = wrapper.findAll('[data-type="page"]')
    expect(pageLinks.map(el => el.element.tagName)).toEqual(['A', 'A', 'A'])
    expect(pageLinks.map(el => el.attributes('href'))).toEqual(['/posts?page=1', '/posts?page=2', '/posts?page=3'])

    const next = wrapper.find('[aria-label="Next"]')
    expect(next.element.tagName).toBe('A')
    expect(next.attributes('href')).toBe('/posts?page=3')
  })

  it('applies color/variant to inactive controls and activeColor/activeVariant to the current page', async () => {
    const wrapper = await mountSuspended(Pagination, {
      props: {
        total: 30,
        itemsPerPage: 10,
        defaultPage: 2,
        color: 'primary',
        variant: 'outline',
        activeColor: 'danger',
        activeVariant: 'solid',
      },
    })
    const [page1, page2] = wrapper.findAll('[data-type="page"]')
    expect(page1!.classes().join(' ')).toContain('ring-[var(--ui-primary)]')
    expect(page2!.classes().join(' ')).toContain('bg-[var(--ui-danger)]')
  })
})
