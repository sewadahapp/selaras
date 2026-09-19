<script setup lang="ts">
const items = [
  {
    label: 'Documents',
    value: 'documents',
    children: [
      { label: 'Resume.pdf', value: 'resume' },
      { label: 'Cover Letter.docx', value: 'cover-letter' },
    ],
  },
  {
    label: 'Photos',
    value: 'photos',
    children: [
      { label: 'Vacation', value: 'vacation', children: [
        { label: 'Beach.jpg', value: 'beach' },
        { label: 'Sunset.jpg', value: 'sunset' },
      ] },
      { label: 'Family.jpg', value: 'family' },
    ],
  },
  { label: 'Notes.txt', value: 'notes' },
]
</script>

<template>
  <STree :items="items" class="w-full max-w-xs" />
</template>
