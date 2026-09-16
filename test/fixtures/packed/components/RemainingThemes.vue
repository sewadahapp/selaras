<script setup lang="ts">
const leaf = { name: 'example.ts', code: 'export {}' }
const files = [{ name: 'src', children: [leaf] }]
const groups = [{ label: 'Actions', items: [{ label: 'Example action' }] }]
const paletteOpen = ref(false)
const alertOpen = ref(false)
</script>

<template>
  <div id="remaining-themes">
    <SCodeButton id="remaining-code-button" code="bun install" />
    <SCodeTree id="remaining-code-tree" :items="files" />
    <SFileTree id="remaining-file-tree" :items="files" :selected="leaf" color="published" />
    <SProseH2 id="remaining-prose-heading" color="published">
      Heading
    </SProseH2>
    <SProsePre id="remaining-prose-pre">
      export {}
    </SProsePre>
    <SSplitter data-testid="remaining-splitter" direction="vertical" class="h-48">
      <SSplitterPanel data-testid="remaining-panel" :default-size="50">
        First
      </SSplitterPanel>
      <SSplitterResizeHandle data-testid="remaining-handle" direction="vertical" color="published" />
      <SSplitterPanel :default-size="50">
        Second
      </SSplitterPanel>
    </SSplitter>
    <STable
      id="remaining-table"
      :data="[{ id: 'row' }]" :columns="[{ accessorKey: 'id', header: 'ID' }]"
      color="published" size="sm" striped gridlines expandable scroll-height="10rem"
    />
    <STree id="remaining-tree" :items="[{ label: 'Leaf', value: 'leaf' }]" size="sm" color="published" />
    <SDatePicker
      size="sm" color="published" active-color="published" adaptive
      aria-label="Remaining calendar"
      :ui="{ field: { 'data-testid': 'remaining-date-field' }, mobileContent: { 'data-testid': 'remaining-date-mobile' }, heading: { 'data-testid': 'remaining-date-heading' } }"
    />
    <button id="remaining-open-alert" @click="alertOpen = true">
      Open alert
    </button>
    <SAlertDialog
      v-model:open="alertOpen" title="Remaining alert" description="Confirm the example" :transition="false"
      :ui="{ content: { 'data-testid': 'remaining-alert' } }"
    />
    <button id="remaining-open-palette" @click="paletteOpen = true">
      Open palette
    </button>
    <SCommandPalette
      v-model:open="paletteOpen" :groups="groups" :shortcut="false"
      :ui="{ content: { 'data-testid': 'remaining-palette' } }"
    />
  </div>
</template>
