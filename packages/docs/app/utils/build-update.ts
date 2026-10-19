interface BuildUpdateOptions {
  buildId: string
  fetchLatest: () => Promise<unknown>
  reload: (path: string) => void
  now?: () => number
  interval?: number
}

/** Reload only after the server confirms this tab belongs to an older build. */
export function createDocsBuildUpdate({ buildId, fetchLatest, reload, now = Date.now, interval = 60_000 }: BuildUpdateOptions) {
  let lastCheck = -Infinity
  let pending: Promise<boolean> | undefined
  let outdated = false
  let reloading = false

  return async (path: string, force = false): Promise<boolean> => {
    if (!outdated && !pending && (force || now() - lastCheck >= interval)) {
      lastCheck = now()
      pending = fetchLatest().then(latest => !!latest && typeof latest === 'object'
        && 'id' in latest && typeof latest.id === 'string' && latest.id.length > 0 && latest.id !== buildId).catch(() => false)
    }
    if (pending) {
      const request = pending
      outdated = await request
      if (pending === request)
        pending = undefined
    }
    if (!outdated)
      return false
    if (!reloading) {
      reloading = true
      reload(path)
    }
    return true
  }
}
