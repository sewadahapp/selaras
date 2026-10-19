import { describe, expect, it, vi } from 'vitest'
import { createDocsBuildUpdate } from '../packages/docs/app/utils/build-update'

describe('documentation build recovery', () => {
  it('keeps the current page for an unchanged build and throttles navigation checks', async () => {
    const fetchLatest = vi.fn().mockResolvedValue({ id: 'current' })
    const reload = vi.fn()
    let time = 0
    const check = createDocsBuildUpdate({ buildId: 'current', fetchLatest, reload, now: () => time })
    expect(await check('/guide')).toBe(false)
    expect(await check('/next')).toBe(false)
    expect(fetchLatest).toHaveBeenCalledTimes(1)
    time = 60_000
    expect(await check('/next')).toBe(false)
    expect(fetchLatest).toHaveBeenCalledTimes(2)
    expect(reload).not.toHaveBeenCalled()
  })

  it('reloads once at the requested URL, including its query and fragment', async () => {
    const reload = vi.fn()
    const check = createDocsBuildUpdate({ buildId: 'old', fetchLatest: async () => ({ id: 'new' }), reload })
    expect(await check('/guide?source=sidebar#install')).toBe(true)
    expect(await check('/another')).toBe(true)
    expect(reload).toHaveBeenCalledExactlyOnceWith('/guide?source=sidebar#install')
  })

  it('checks immediately on tab return or a missing page, even within the navigation interval', async () => {
    const fetchLatest = vi.fn().mockResolvedValueOnce({ id: 'current' }).mockResolvedValueOnce({ id: 'new' })
    const reload = vi.fn()
    const check = createDocsBuildUpdate({ buildId: 'current', fetchLatest, reload })
    expect(await check('/guide')).toBe(false)
    expect(await check('/guide', true)).toBe(true)
    expect(fetchLatest).toHaveBeenCalledTimes(2)
    expect(reload).toHaveBeenCalledOnce()
  })

  it.each([undefined, null, '', '<html>404</html>', {}, { id: '' }, { id: 42 }])('ignores an invalid manifest: %j', async (latest) => {
    const reload = vi.fn()
    const check = createDocsBuildUpdate({ buildId: 'current', fetchLatest: async () => latest, reload })
    expect(await check('/guide')).toBe(false)
    expect(reload).not.toHaveBeenCalled()
  })

  it('keeps navigation usable during network failure and can recover on a later check', async () => {
    const fetchLatest = vi.fn().mockRejectedValueOnce(new Error('Offline')).mockResolvedValueOnce({ id: 'new' })
    const reload = vi.fn()
    const check = createDocsBuildUpdate({ buildId: 'current', fetchLatest, reload })
    expect(await check('/guide')).toBe(false)
    expect(reload).not.toHaveBeenCalled()
    expect(await check('/next', true)).toBe(true)
    expect(reload).toHaveBeenCalledExactlyOnceWith('/next')
  })

  it('deduplicates overlapping checks and reloads only once', async () => {
    let resolve!: (value: unknown) => void
    const fetchLatest = vi.fn(() => new Promise<unknown>((done) => {
      resolve = done
    }))
    const reload = vi.fn()
    const check = createDocsBuildUpdate({ buildId: 'old', fetchLatest, reload })
    const first = check('/guide')
    const second = check('/next', true)
    resolve({ id: 'new' })
    expect(await Promise.all([first, second])).toEqual([true, true])
    expect(fetchLatest).toHaveBeenCalledTimes(1)
    expect(reload).toHaveBeenCalledOnce()
  })
})
