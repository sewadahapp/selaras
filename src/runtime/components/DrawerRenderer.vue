<script setup lang="ts">
import { useDrawer } from '../composables/use-drawer'
import Drawer from './Drawer.vue'

const { drawers, close, remove } = useDrawer()
</script>

<template>
  <Drawer
    v-for="instance in drawers"
    :key="instance.id"
    :open="instance.isOpen"
    :side="instance.side"
    :handle="instance.handle"
    :snap-points="instance.snapPoints"
    :snap-point="instance.snapPoint"
    :snap-to-sequential-points="instance.snapToSequentialPoints"
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
  </Drawer>
</template>
