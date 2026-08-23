<!-- <script setup lang="ts">
const activeTab = ref('one')
const modalOpen = ref(false)
const selectValue = ref('apple')
const checkboxValue = ref(true)
const radioValue = ref('one')
const switchValue = ref(true)
const { add: addToast } = useToast()

function showToast() {
  addToast({ title: 'Saved', description: 'Your changes have been saved.' })
}

const fruitItems = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry', disabled: true },
  { label: 'Date', value: 'date' },
  { label: 'Elderberry', value: 'elderberry' },
]

const multiCommaValue = ref(['apple', 'banana'])
const multiChipValue = ref(['apple', 'banana', 'cherry', 'date', 'elderberry'])
const searchableValue = ref('')
const autocompleteValue = ref('')
const autocompleteMultiValue = ref<string[]>([])

const manyItems = Array.from({ length: 5000 }, (_, i) => ({ label: `Item ${i + 1}`, value: `item-${i + 1}` }))
const virtualizedValue = ref('')

const emailValue = ref('')
const nameValue = ref('')
const planValue = ref('')
const termsValue = ref(false)
</script>

<template>
  <div class="flex flex-col gap-8">
    <div>
      <h1 class="text-2xl font-semibold text-[var(--ui-text)]">
        Selaras
      </h1>
      <p class="mt-1 text-[var(--ui-text-muted)]">
        A UI component library for Nuxt. Browse components in the sidebar, or try them below.
      </p>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <SButton>Solid</SButton>
      <SButton variant="soft">
        Soft
      </SButton>
      <SButton variant="outline">
        Outline
      </SButton>
      <SButton variant="ghost">
        Ghost
      </SButton>
      <SButton color="secondary">
        Secondary
      </SButton>
      <SButton color="success">
        Success
      </SButton>
      <SButton color="danger">
        Danger
      </SButton>
      <SButton color="info">
        Info
      </SButton>
      <SButton color="warning">
        Warning
      </SButton>
      <SButton disabled>
        Disabled
      </SButton>
      <SButton :ui="{ base: 'rounded-full' }">
        Custom ui
      </SButton>
      <STooltip text="I'm a tooltip">
        <SButton variant="outline">
          Hover me
        </SButton>
      </STooltip>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <SInput placeholder="Search..." icon="lucide:search" class="max-w-48" />

      <SSelect
        v-model="selectValue"
        class="w-40"
        placeholder="Pick a fruit"
        :items="[{ label: 'Apple', value: 'apple' }, { label: 'Banana', value: 'banana' }, { label: 'Cherry', value: 'cherry', disabled: true }]"
      />

      <SDropdown
        :items="[
          [{ label: 'Edit', icon: 'lucide:pencil' }, { label: 'Duplicate', icon: 'lucide:copy' }],
          [{ label: 'Delete', icon: 'lucide:trash-2' }],
        ]"
      >
        <SButton variant="outline">
          Open dropdown
        </SButton>
      </SDropdown>

      <SButton variant="outline" @click="modalOpen = true">
        Open modal
      </SButton>
      <SModal v-model="modalOpen" title="Delete item" description="This action cannot be undone.">
        <template #body>
          Are you sure you want to delete this item?
        </template>
        <template #footer>
          <SButton variant="ghost" @click="modalOpen = false">
            Cancel
          </SButton>
          <SButton color="danger" @click="modalOpen = false">
            Delete
          </SButton>
        </template>
      </SModal>

      <SButton variant="outline" @click="showToast">
        Show toast
      </SButton>
    </div>

    <STabs
      v-model="activeTab"
      class="w-full max-w-md"
      :items="[{ label: 'One', value: 'one' }, { label: 'Two', value: 'two' }]"
    >
      <template #one>
        Tab one content
      </template>
      <template #two>
        Tab two content
      </template>
    </STabs>

    <div class="flex flex-wrap items-start gap-8">
      <SCheckbox v-model="checkboxValue" label="Accept terms" />

      <SRadioGroup
        v-model="radioValue"
        :items="[{ label: 'One', value: 'one' }, { label: 'Two', value: 'two' }]"
      />

      <SSwitch v-model="switchValue" label="Notifications" />

      <STextarea placeholder="Write something..." class="max-w-sm" />
    </div>

    <div class="flex flex-wrap items-start gap-4">
      <SSelect
        v-model="multiCommaValue"
        multiple
        class="w-48"
        placeholder="Comma multi"
        :items="fruitItems"
      />

      <SSelect
        v-model="multiChipValue"
        multiple
        display-mode="chip"
        :max-chips="2"
        class="w-64"
        placeholder="Chip multi"
        :items="fruitItems"
      />

      <SSelect
        v-model="searchableValue"
        searchable
        class="w-48"
        placeholder="Searchable"
        :items="fruitItems"
      />

      <SAutocomplete
        v-model="autocompleteValue"
        class="w-48"
        placeholder="Type anything"
        :items="fruitItems"
      />

      <SAutocomplete
        v-model="autocompleteMultiValue"
        multiple
        display-mode="chip"
        class="w-64"
        placeholder="Multi + new tags"
        :items="fruitItems"
      />

      <SSelect
        v-model="virtualizedValue"
        searchable
        virtualize
        class="w-48"
        placeholder="5000 items"
        :items="manyItems"
      />
    </div>

    <div class="flex flex-wrap items-start gap-6">
      <SFormField label="Email" name="email" hint="We'll never share this." class="w-56">
        <SInput v-model="emailValue" type="email" placeholder="you@example.com" />
      </SFormField>

      <SFormField label="Name" required error="Name is required" class="w-56">
        <SInput v-model="nameValue" placeholder="Jane Doe" />
      </SFormField>

      <SFormField label="Plan" name="plan" class="w-48">
        <SSelect v-model="planValue" placeholder="Pick a plan" :items="fruitItems" />
      </SFormField>

      <SFormField error="You must accept the terms">
        <SCheckbox v-model="termsValue" label="Accept terms" />
      </SFormField>
    </div>
  </div>
</template> -->

<template>
  <div>hello world</div>
</template>
