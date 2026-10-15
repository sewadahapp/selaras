<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'

const title = ref('Original title')
const editing = ref(false)
const external = useTemplateRef('external')
const submits = ref(0)
const saves = ref(0)
const busy = ref(false)
</script>

<template>
  <SApp>
    <main style="max-width: 600px; padding: 24px">
      <button id="before" type="button">
        Before
      </button>
      <form id="editable-form" @submit.prevent="submits++">
        <SFormField label="Basic title" name="title" description="A saved title">
          <SEditable id="basic" v-model="title" @submit="saves++" />
        </SFormField>
        <output id="saved">{{ title }}</output>
        <output id="saves">{{ saves }}</output>
        <SEditable id="multiline" name="description" default-value="First line" multiline aria-label="Description" />
        <SEditable id="enter-only" default-value="Enter original" submit-mode="enter" aria-label="Enter title" />
        <SEditable id="blur-only" default-value="Blur original" submit-mode="blur" aria-label="Blur title" />
        <SEditable id="required" default-value="Required title" required aria-label="Required title" />
        <SEditable id="disabled" default-value="Disabled title" disabled aria-label="Disabled title" />
        <SEditable id="readonly" default-value="Read only title" readonly aria-label="Read only title" />
        <SEditable id="loading" default-value="Busy title" :loading="busy" aria-label="Busy title" />
        <button id="busy" type="button" @click="busy = !busy">
          Toggle busy
        </button>
        <button id="form-submit" type="submit">
          Submit form
        </button>
      </form>
      <section>
        <button v-if="!editing" id="rename" @click="editing = true">
          Rename
        </button>
        <template v-else>
          <button id="external-save" @click="external?.submit()">
            External save
          </button>
          <button id="external-cancel" @click="external?.cancel()">
            External cancel
          </button>
          <button id="parent-cancel" @click="editing = false">
            Parent cancel
          </button>
        </template>
        <SEditable id="external" ref="external" v-model:editing="editing" default-value="External original" activation-mode="none" submit-mode="none" :controls="false" aria-label="External title" />
      </section>
      <form id="required-form" @submit.prevent="submits++">
        <SEditable id="empty-required" name="requiredTitle" required aria-label="Empty required title" />
        <button type="submit">
          Submit required form
        </button>
      </form>
      <button id="outside" type="button">
        Outside
      </button>
      <output id="form-submits">{{ submits }}</output>
    </main>
  </SApp>
</template>
