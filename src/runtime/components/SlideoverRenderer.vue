<script setup lang="ts">
import { onUnmounted } from 'vue'
import { useSlideover } from '../composables/use-slideover'
import ProgrammaticTheme from '../internal/ProgrammaticTheme.vue'
import Slideover from './Slideover.vue'

const { slideovers, close, remove } = useSlideover()
onUnmounted(() => {
  for (const instance of slideovers.value)
    instance.resolve(undefined)
  slideovers.value = []
})
</script>

<template>
  <ProgrammaticTheme
    v-for="instance in slideovers"
    :key="instance.id"
    :snapshot="instance._theme"
  >
    <Slideover
      :open="instance.isOpen"
      :title="instance.title"
      :description="instance.description"
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
  </ProgrammaticTheme>
</template>
