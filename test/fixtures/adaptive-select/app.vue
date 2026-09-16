<script setup>
import { computed, ref } from 'vue'

const route = useRoute()
const prefixed = useRuntimeConfig().public.adaptivePrefix !== false
const multiple = route.query.multiple === 'true'
const controlledOpen = route.query.ownership === 'controlled'
const controlledModel = route.query.model === 'controlled'
const initialOpen = route.query.initial === 'true'
const parentOpen = ref(initialOpen)
const parentValue = ref()
const acceptClose = ref(route.query.veto !== 'true')
const requests = ref([])
const proposals = ref([])
const items = Object.freeze([
  { label: 'Numbers', items: [{ label: 'One', value: 1 }, { label: 'Two', value: 2 }] },
  { label: 'Other', items: [{ label: 'Three', value: 3, disabled: true }] },
])
const bindings = computed(() => ({
  ...(controlledOpen ? { open: parentOpen.value } : { defaultOpen: initialOpen }),
  ...(controlledModel ? { modelValue: parentValue.value } : { defaultValue: multiple ? [] : undefined }),
}))
function requestOpen(value) {
  requests.value.push(value)
  if (controlledOpen && (value || acceptClose.value))
    parentOpen.value = value
}
function proposeValue(value) {
  proposals.value.push(value)
  if (controlledModel && route.query.reject !== 'true')
    parentValue.value = value
}
</script>

<template>
  <SApp>
    <span id="responsive-breakpoint" :class="prefixed ? 'tw:hidden tw:md:block' : 'hidden tablet:block'">
      Wide viewport
    </span>
    <form id="selection-form">
      <button id="reset-selection" type="reset">
        Reset selection
      </button>
    </form>
    <STheme as="section" :tokens="{ light: { colors: { enterprise: { fill: 'rgb(11 34 51)' } } } }">
      <button id="before">
        Before
      </button>
      <SSelect
        id="select-trigger" aria-label="Choose a number" name="choice" form="selection-form"
        :items="items" :multiple="multiple" :searchable="route.query.searchable !== 'false'"
        :virtualize="route.query.virtual === 'true'" color="enterprise" adaptive
        :ui="{ itemIndicator: { 'data-test': 'selection-indicator' } }"
        placeholder="Choose a number" v-bind="bindings"
        @update:open="requestOpen" @update:model-value="proposeValue"
      />
      <button id="after">
        After
      </button>
    </STheme>
    <button id="allow-close" @click="acceptClose = true">
      Allow close
    </button>
    <output id="open-requests">{{ JSON.stringify(requests) }}</output>
    <output id="value-proposals">{{ JSON.stringify(proposals) }}</output>
  </SApp>
</template>
