// Shared between layouts/default.vue and layouts/landing.vue - both render
// the same top-level docs nav in their header.
export const docsNavItems = [
  {
    label: 'Overview',
    children: [
      { label: 'Introduction', to: '/overview/introduction' },
      { label: 'Installation', to: '/overview/installation' },
      { label: 'Theming', to: '/overview/theming' },
      { label: 'TypeScript', to: '/overview/typescript' },
    ],
  },
  { label: 'Components', to: '/components/elements/button' },
  {
    label: 'Utilities',
    children: [
      { label: 'useModal', to: '/utilities/composables/use-modal' },
      { label: 'useSlideover', to: '/utilities/composables/use-slideover' },
      { label: 'v-ripple', to: '/utilities/directives/ripple' },
    ],
  },
]
