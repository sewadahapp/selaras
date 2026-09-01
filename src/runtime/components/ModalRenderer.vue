<script setup lang="ts">
import { useModal } from '../composables/use-modal'
import Modal from './Modal.vue'

const { modals, close, remove } = useModal()
</script>

<template>
  <Modal
    v-for="instance in modals"
    :key="instance.id"
    :open="instance.isOpen"
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
</template>
