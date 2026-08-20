<script setup lang="ts">
import type { VNode } from 'vue'
import { Comment, computed, Fragment, ref, Text, useSlots } from 'vue'

const slots = useSlots()

function flatten(vnodes: VNode[]): VNode[] {
  const result: VNode[] = []
  for (const vnode of vnodes) {
    if (vnode.type === Comment || vnode.type === Text)
      continue
    if (vnode.type === Fragment && Array.isArray(vnode.children)) {
      result.push(...flatten(vnode.children as VNode[]))
      continue
    }
    result.push(vnode)
  }
  return result
}

const children = computed(() => flatten(slots.default?.() ?? []))

function labelFor(child: VNode, index: number) {
  const props = (child.props ?? {}) as { filename?: string, language?: string }
  return props.filename || props.language || `Tab ${index + 1}`
}

const tabItems = computed(() => children.value.map((child, index) => ({
  label: labelFor(child, index),
  value: String(index),
})))

const activeTab = ref('0')
</script>

<template>
  <STabs v-model="activeTab" :items="tabItems">
    <template v-for="(child, index) in children" :key="index" #[String(index)]>
      <component :is="() => child" />
    </template>
  </STabs>
</template>
