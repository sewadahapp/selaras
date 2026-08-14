<script setup lang="ts">
const activeTab = ref('one')
const modalOpen = ref(false)
const selectValue = ref('apple')
const { add: addToast } = useToast()

function showToast() {
  addToast({ title: 'Saved', description: 'Your changes have been saved.' })
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center gap-8 p-10">
    <div class="flex flex-wrap items-center justify-center gap-3">
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
      <SButton color="danger">
        Danger
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

    <div class="flex flex-wrap items-center justify-center gap-3">
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

    <SToaster />
  </div>
</template>
