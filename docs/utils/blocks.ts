export interface DocumentationBlock {
  name: string
  slug: string
  file: string
  title: string
  height: number
  install?: string
}

export const documentationBlocks: readonly DocumentationBlock[] = [
  { name: 'block-sign-in', slug: 'sign-in', file: 'BlockSignIn.vue', title: 'Sign in', height: 760 },
  { name: 'block-dashboard-overview', slug: 'dashboard-overview', file: 'BlockDashboardOverview.vue', title: 'Dashboard overview', height: 740 },
  { name: 'block-profile-settings', slug: 'profile-settings', file: 'BlockProfileSettings.vue', title: 'Profile settings', height: 880 },
  { name: 'block-data-management', slug: 'data-management', file: 'BlockDataManagement.vue', title: 'Data management', height: 760 },
  { name: 'block-editor-tiptap', slug: 'editor-tiptap', file: 'BlockEditorTiptap.vue', title: 'Tiptap editor', height: 740, install: 'bun add @tiptap/vue-3@3 @tiptap/pm@3 @tiptap/starter-kit@3 @tiptap/extension-placeholder@3' },
  { name: 'block-editor-lexical', slug: 'editor-lexical', file: 'BlockEditorLexical.vue', title: 'Lexical editor', height: 740, install: 'bun add lexical@0.52 @lexical/rich-text@0.52 @lexical/list@0.52 @lexical/link@0.52 @lexical/history@0.52 @lexical/html@0.52 @lexical/selection@0.52 @lexical/utils@0.52' },
  { name: 'block-editor-quill', slug: 'editor-quill', file: 'BlockEditorQuill.vue', title: 'Quill editor', height: 740, install: 'bun add quill@2' },
]
