<script setup lang="ts">
import { ref } from 'vue'

const formats = ref<string[]>(['bold'])
const alignment = ref('left')
const saved = ref(false)
</script>

<template>
  <div class="space-y-3">
    <SToolbar aria-label="Document tools">
      <SToolbarToggleGroup v-model="formats" type="multiple" icon-only :items="[{ value: 'bold', label: 'Bold', icon: 'hugeicons:text-bold' }, { value: 'italic', label: 'Italic', icon: 'hugeicons:text-italic' }, { value: 'underline', label: 'Underline', icon: 'hugeicons:text-underline' }]" aria-label="Text style" />
      <SToolbarSeparator />
      <SToolbarToggleGroup v-model="alignment" icon-only :items="[{ value: 'left', label: 'Align left', icon: 'hugeicons:text-align-left' }, { value: 'center', label: 'Align center', icon: 'hugeicons:text-align-center' }, { value: 'right', label: 'Align right', icon: 'hugeicons:text-align-right' }]" aria-label="Alignment" />
      <SToolbarSeparator />
      <SToolbarButton icon="hugeicons:floppy-disk" @click="saved = true">
        Save
      </SToolbarButton>
    </SToolbar>
    <p class="text-sm text-[var(--selaras-resolved-text-muted)]" role="status">
      {{ saved ? 'Example saved locally.' : 'Use arrow keys to move through the controls.' }}
    </p>
  </div>
</template>
