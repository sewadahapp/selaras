<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from '#imports'
import Lexical from '../../../docs/components/content/examples/blocks/BlockEditorLexical.vue'
import Quill from '../../../docs/components/content/examples/blocks/BlockEditorQuill.vue'
import Tiptap from '../../../docs/components/content/examples/blocks/BlockEditorTiptap.vue'

const route = useRoute()
const components = { tiptap: Tiptap, lexical: Lexical, quill: Quill }
const engine = ref((route.query.engine as keyof typeof components) || 'tiptap')
const component = computed(() => components[engine.value])
const content = ref('<p>Editable sample</p>')
const formats = ref<string[]>([])
const disabled = ref(false)
const submits = ref(0)
const actions = ref(0)
</script>

<template>
  <SApp :dir="route.query.rtl ? 'rtl' : 'ltr'">
    <form data-toolbar-contract @submit.prevent="submits++">
      <button id="before" type="button">
        Before toolbar
      </button>
      <SToolbar aria-label="Fixture actions" :orientation="route.query.vertical ? 'vertical' : 'horizontal'" :disabled="disabled">
        <SToolbarButton @click="actions++">
          First
        </SToolbarButton>
        <SToolbarToggleGroup v-model="formats" type="multiple" :items="['Bold', 'Italic', { value: 'disabled', label: 'Unavailable', disabled: true }]" />
        <SToolbarSeparator :decorative="false" />
        <SToolbarButton @click="actions++">
          Last
        </SToolbarButton>
      </SToolbar>
      <button id="after" type="button">
        After toolbar
      </button>
      <output id="submits">{{ submits }}</output>
      <output id="actions">{{ actions }}</output>
    </form>
    <button id="external" @click="content = '<p>External replacement</p>'">
      Replace externally
    </button>
    <button id="empty" @click="content = ''">
      Empty externally
    </button>
    <button id="disable" @click="disabled = !disabled">
      Toggle disabled
    </button>
    <button v-for="name in ['tiptap', 'lexical', 'quill'] as const" :id="`mount-${name}`" :key="name" @click="engine = name">
      Mount {{ name }}
    </button>
    <component :is="component" :key="engine" v-model="content" :disabled="disabled" />
    <output id="model">{{ content }}</output>
  </SApp>
</template>
