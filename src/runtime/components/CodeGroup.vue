<script setup lang="ts">
import type { VNode } from 'vue'
import { cloneVNode, Comment, computed, Fragment, ref, Text, useSlots } from 'vue'
import { useMessages } from '../composables/use-messages'
import Tabs from './Tabs.vue'

const slots = useSlots()
const messages = useMessages()

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
  return props.filename || props.language || messages.value.codeTabFallback(index + 1)
}

const tabItems = computed(() => children.value.map((child, index) => ({
  label: labelFor(child, index),
  value: String(index),
})))

const activeTab = ref('0')
</script>

<template>
  <Tabs v-model="activeTab" :items="tabItems">
    <template v-for="(child, index) in children" :key="index" #[String(index)]>
      <!--
        cloneVNode is required, not optional: this vnode was captured from
        CodeGroup's own default slot and is being re-inserted several levels
        deeper (inside Tabs/TabsContent/Presence) - rendering the raw,
        already-positioned vnode object there directly causes a Vue
        hydration-shape mismatch (Fragment vs text) the first time this
        panel mounts. Cloning gives it a fresh identity for its new spot.
      -->
      <component :is="() => cloneVNode(child)" />
    </template>
  </Tabs>
</template>
