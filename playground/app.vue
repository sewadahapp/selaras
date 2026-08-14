<script setup lang="ts">
const activeTab = ref('one')
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

    <SInput placeholder="Search..." icon="lucide:search" class="max-w-48" />

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
  </div>
</template>
