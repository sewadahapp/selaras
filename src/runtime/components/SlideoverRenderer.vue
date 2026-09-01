<script setup lang="ts">
import { useSlideover } from '../composables/use-slideover'
import Slideover from './Slideover.vue'

const { slideovers, close, remove } = useSlideover()
</script>

<template>
  <Slideover
    v-for="instance in slideovers"
    :key="instance.id"
    :open="instance.isOpen"
    :side="instance.side"
    :inset="instance.inset"
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
  </Slideover>
</template>
