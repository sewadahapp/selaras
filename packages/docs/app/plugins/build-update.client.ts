import { appManifest } from '#build/nuxt.config.mjs'
import { createDocsBuildUpdate } from '../utils/build-update'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const router = useRouter()
  const check = import.meta.dev || !appManifest || !config.app.buildId
    ? async () => false
    : createDocsBuildUpdate({
        buildId: config.app.buildId,
        fetchLatest: () => $fetch(`${(config.app.cdnURL || config.app.baseURL).replace(/\/$/, '')}/${config.app.buildAssetsDir.replace(/^\/|\/$/g, '')}/builds/latest.json`, {
          cache: 'no-store',
          query: { t: Date.now() },
          timeout: 3000,
          retry: 0,
        }),
        reload: (path) => {
          const target = new URL(`${config.app.baseURL.replace(/\/$/, '')}${path}`, window.location.href)
          const sameDocument = target.pathname === window.location.pathname && target.search === window.location.search
          if (sameDocument && target.hash !== window.location.hash)
            window.history.replaceState(window.history.state, '', target.href)
          nuxtApp.runWithContext(() => reloadNuxtApp({
            // Omitting path reloads the document and retains its query/hash.
            // Assigning an existing URL with a fragment only navigates within it.
            path: sameDocument ? undefined : `${target.pathname}${target.search}${target.hash}`,
            persistState: true,
            ttl: 60_000,
          }))
        },
      })

  if (import.meta.client && !import.meta.dev && appManifest) {
    router.beforeEach(async (to) => {
      if (!nuxtApp.isHydrating && await check(to.fullPath))
        return false
    })
    nuxtApp.hook('app:error', () => {
      void check(router.currentRoute.value.fullPath, true)
    })
    onNuxtReady(() => {
      const onVisible = () => {
        if (document.visibilityState === 'visible')
          void check(router.currentRoute.value.fullPath, true)
      }
      const onPageShow = (event: PageTransitionEvent) => {
        if (event.persisted)
          onVisible()
      }
      document.addEventListener('visibilitychange', onVisible)
      window.addEventListener('pageshow', onPageShow)
      nuxtApp.vueApp.onUnmount(() => {
        document.removeEventListener('visibilitychange', onVisible)
        window.removeEventListener('pageshow', onPageShow)
      })
      void check(router.currentRoute.value.fullPath)
    })
  }

  return { provide: { docsCheckBuild: check } }
})
