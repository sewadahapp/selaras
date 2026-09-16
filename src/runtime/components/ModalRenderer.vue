<script setup lang="ts">
import { onUnmounted } from 'vue'
import { useModalService } from '../internal/programmatic-services'
import ProgrammaticTheme from '../internal/ProgrammaticTheme.vue'
import Modal from './Modal.vue'

const { instances: modals, close, remove, dispose } = useModalService()
onUnmounted(dispose)
</script>

<template>
  <ProgrammaticTheme
    v-for="instance in modals"
    :key="instance.id"
    :snapshot="instance._theme"
  >
    <Modal
      :open="instance.isOpen"
      :title="instance.title"
      :description="instance.description"
      :dismissible="instance.dismissible"
      :modal="instance.modal"
      :overlay="instance.overlay"
      :transition="instance.transition"
      @update:open="(open) => !open && close(instance.id)"
      @after-leave="remove(instance.id)"
    >
      <template #content>
        <component :is="instance.component" v-bind="instance.props" @close="(value: unknown) => close(instance.id, value)" />
      </template>
    </Modal>
  </ProgrammaticTheme>
</template>
