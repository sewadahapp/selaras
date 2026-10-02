<script setup lang="ts">
import { onUnmounted } from 'vue'
import { useConfirmService } from '../internal/programmatic-services'
import ProgrammaticTheme from '../internal/ProgrammaticTheme.vue'
import AlertDialog from './AlertDialog.vue'

const { instances, close, remove, dispose } = useConfirmService()
onUnmounted(dispose)

function onUpdateOpen(id: number, open: boolean) {
  if (open)
    return
  // Reka may emit update:open before AlertDialog's semantic action event.
  // Defer the fallback so confirm/cancel can settle with their exact result.
  queueMicrotask(() => {
    const instance = instances.value.find(item => item.id === id)
    if (instance && !instance._settled)
      close(id, false)
  })
}
</script>

<template>
  <ProgrammaticTheme
    v-for="instance in instances"
    :key="instance.id"
    :snapshot="instance._theme"
  >
    <AlertDialog
      :open="instance.isOpen"
      :title="instance.title"
      :description="instance.description"
      :action-label="instance.confirmLabel"
      :cancel-label="instance.cancelLabel"
      :action-color="instance.confirmColor"
      :icon="instance.icon"
      @update:open="(open) => onUpdateOpen(instance.id, open)"
      @cancel="close(instance.id, false)"
      @confirm="close(instance.id, true)"
      @after-leave="remove(instance.id)"
    />
  </ProgrammaticTheme>
</template>
