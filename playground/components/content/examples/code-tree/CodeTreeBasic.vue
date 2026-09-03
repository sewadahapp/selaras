<script setup lang="ts">
const items = [
  {
    name: 'src',
    children: [
      { name: 'index.ts', code: 'export { useCommandPalette } from \'./composables/use-command-palette\'\n' },
      { name: 'App.vue', code: '<template>\n  <SApp>\n    <NuxtPage />\n  </SApp>\n</template>\n' },
    ],
  },
  { name: 'package.json', code: '{\n  "name": "my-app",\n  "dependencies": {\n    "selaras": "^1.0.0"\n  }\n}\n' },
]
</script>

<template>
  <SCodeTree :items="items" class="h-64 w-full" />
</template>
