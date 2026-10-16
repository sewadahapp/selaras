<script setup>
import { reactive, ref } from 'vue'
import Autocomplete from '../../../src/runtime/components/Autocomplete.vue'
import Input from '../../../src/runtime/components/Input.vue'
import Select from '../../../src/runtime/components/Select.vue'
import Textarea from '../../../src/runtime/components/Textarea.vue'

const route = useRoute()
const disabled = ref(false)
const readonly = ref(false)
const expanded = ref(false)
const actions = ref(0)
const submits = ref(0)
const visible = ref(false)
const components = { input: Input, textarea: Textarea, select: Select, autocomplete: Autocomplete }
const cases = reactive(['sm', 'md', 'lg'].flatMap(size => Object.entries(components).map(([name, component]) => ({ size, name, component: markRaw(component), value: name === 'input' ? 'secret' : 'One' }))))
const parts = { leading: { 'data-test': 'leading' }, trailing: { 'data-test': 'trailing' } }
</script>

<template>
  <SApp :dir="route.query.rtl ? 'rtl' : 'ltr'">
    <main class="tw:space-y-5 tw:p-4">
      <button id="disable" @click="disabled = !disabled">
        Toggle disabled
      </button>
      <button id="expand" @click="expanded = !expanded">
        Change suffix width
      </button>
      <button id="readonly" @click="readonly = !readonly">
        Toggle readonly
      </button>
      <form id="fields-form" class="tw:grid tw:grid-cols-1 tw:gap-4 tw:sm:grid-cols-2" @submit.prevent="submits++">
        <div v-for="field in cases" :key="`${field.name}-${field.size}`" :data-case="`${field.name}-${field.size}`" class="tw:min-w-0 tw:space-y-2">
          <label :for="`${field.name}-${field.size}`">{{ field.name }} {{ field.size }}</label>
          <component
            :is="field.component" :id="`${field.name}-${field.size}`" v-model="field.value"
            :name="`${field.name}-${field.size}`" :size="field.size" :disabled="disabled" :readonly="readonly" :ui="parts" clearable
            :items="field.name === 'select' || field.name === 'autocomplete' ? ['One', 'Two'] : undefined"
            :type="field.name === 'input' ? (visible ? 'text' : 'password') : undefined"
            :dropdown="field.name === 'autocomplete' || undefined" :adaptive="field.name === 'select' || field.name === 'autocomplete' || undefined"
          >
            <template #leading>
              <span>Rp</span>
            </template>
            <template #trailing="{ disabled: slotDisabled, buttonSize }">
              <span data-test="suffix">{{ expanded ? 'per month' : 'kg' }}</span>
              <SButton :size="buttonSize" :disabled="slotDisabled" type="button" variant="text" color="neutral" @click="actions++; visible = !visible">
                Info
              </SButton>
            </template>
          </component>
          <output :id="`value-${field.name}-${field.size}`">{{ field.value }}</output>
        </div>
        <button id="submit" type="submit">
          Submit
        </button>
      </form>
      <output id="actions">{{ actions }}</output>
      <output id="submits">{{ submits }}</output>
    </main>
  </SApp>
</template>
