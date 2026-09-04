// layouts/default.vue's own sidebar nav, useDocsSearchGroups, and
// useDocsSurround all need the same docs nav tree - shared here as one
// composable (not three separately-defined `useAsyncData('docs-navigation',
// ...)` calls with identical bodies) since useAsyncData dedupes by key but
// compares handler *identity*, not matching output - three distinct
// closures under the same key, even textually identical ones, trip Nuxt's
// own "Incompatible options... different handler" warning.
export function useDocsNavigation() {
  return useAsyncData('docs-navigation', () =>
    queryCollectionNavigation('docs').order('order', 'ASC'))
}
