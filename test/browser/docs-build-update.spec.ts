import type { Page } from '@playwright/test'
import { fileURLToPath } from 'node:url'
import { expect, test } from '@nuxt/test-utils/playwright'

test.use({ nuxt: { rootDir: fileURLToPath(new URL('../fixtures/docs-build-update', import.meta.url)) } })

async function simulateDeployment(page: Page) {
  let published = false
  let currentId = ''
  let checks = 0
  let documents = 0
  page.on('request', (request) => {
    if (request.isNavigationRequest() && request.frame() === page.mainFrame())
      documents++
  })
  await page.route('**/manual/**', async (route) => {
    const request = route.request()
    if (!published || request.resourceType() !== 'document')
      return route.fallback()
    const response = await route.fetch()
    await route.fulfill({ response, body: (await response.text()).replaceAll(currentId, 'next-deployment') })
  })
  await page.route('**/_nuxt/builds/latest.json?*', async (route) => {
    checks++
    const response = await route.fetch()
    const latest = await response.json()
    currentId = latest.id
    await route.fulfill({ response, json: { ...latest, id: published ? 'next-deployment' : currentId } })
  })
  await page.route('**/_nuxt/builds/meta/next-deployment.json', async (route) => {
    const response = await route.fetch({ url: route.request().url().replace('next-deployment', currentId) })
    await route.fulfill({ response, json: { ...await response.json(), id: 'next-deployment' } })
  })
  return {
    publish: () => { published = true },
    documents: () => documents,
    checks: () => checks,
  }
}

test('keeps ordinary navigation client-side and preserves real 404s', async ({ page, goto }) => {
  const deployment = await simulateDeployment(page)
  await goto('/manual/guide/start', { waitUntil: 'hydration' })
  await expect.poll(deployment.checks).toBeGreaterThan(0)
  await page.getByRole('link', { name: 'Next guide', exact: true }).last().click()
  await expect(page.getByRole('heading', { name: 'Next guide', level: 1 })).toBeVisible()
  expect(deployment.documents()).toBe(1)
  await goto('/manual/guide/missing', { waitUntil: 'hydration' })
  await expect(page.getByRole('heading', { name: 'Page not found', exact: true })).toBeVisible()
  expect(deployment.documents()).toBe(2)
})

test('reloads at the requested route when navigation discovers a newer deployment', async ({ page, goto }) => {
  await page.clock.install()
  const deployment = await simulateDeployment(page)
  await goto('/manual/guide/start', { waitUntil: 'hydration' })
  await expect.poll(deployment.checks).toBeGreaterThan(0)
  deployment.publish()
  // Advance beyond the navigation check interval without waiting a minute.
  await page.clock.fastForward(61_000)
  await page.getByRole('link', { name: 'Next guide', exact: true }).last().click()
  await expect(page).toHaveURL(/\/manual\/guide\/next\?source=guide#details$/)
  await expect(page.getByRole('heading', { name: 'Next guide', level: 1 })).toBeVisible()
  await expect.poll(deployment.documents).toBe(2)
  await expect(page.locator('[data-error-kind]')).toHaveCount(0)
})

test('checks a returning tab immediately and reloads only once for a newer build', async ({ page, goto }) => {
  const deployment = await simulateDeployment(page)
  await goto('/manual/guide/start?source=return#start-guide', { waitUntil: 'hydration' })
  await expect.poll(deployment.checks).toBeGreaterThan(0)
  deployment.publish()
  await page.evaluate(() => {
    document.dispatchEvent(new Event('visibilitychange'))
    document.dispatchEvent(new Event('visibilitychange'))
  })
  await expect.poll(deployment.documents).toBe(2)
  await expect(page).toHaveURL(/\/manual\/guide\/start\?source=return#start-guide$/)
  await expect(page.getByRole('heading', { name: 'Start guide', level: 1 })).toBeVisible()
  await page.getByRole('link', { name: 'Next guide', exact: true }).last().click()
  await expect(page.getByRole('heading', { name: 'Next guide', level: 1 })).toBeVisible()
  expect(deployment.documents()).toBe(2)
})

test('does not reload when the build check is offline', async ({ page, goto }) => {
  let documents = 0
  page.on('request', (request) => {
    if (request.isNavigationRequest() && request.frame() === page.mainFrame())
      documents++
  })
  await page.route('**/_nuxt/builds/latest.json?*', route => route.abort())
  await goto('/manual/guide/start', { waitUntil: 'hydration' })
  await page.getByRole('link', { name: 'Next guide', exact: true }).last().click()
  await expect(page.getByRole('heading', { name: 'Next guide', level: 1 })).toBeVisible()
  expect(documents).toBe(1)
})
