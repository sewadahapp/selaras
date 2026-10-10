<script setup>
const people = ref(['A', 'B', 'C'])
const max = ref(2)
const ui = { item: { 'data-avatar-item': '' }, count: { 'data-overflow': '' } }
</script>

<template>
  <SApp>
    <SAvatarGroup id="static" :max="2" size="lg" :ui="ui">
      <SAvatar text="A" />
      <SAvatar text="B" />
      <SAvatar text="C" />
    </SAvatarGroup>
    <SAvatarGroup id="direct" :max="max" size="lg" :ui="ui">
      <SAvatar v-for="person in people" :key="person" :text="person" />
      <SAvatar v-if="false" text="Hidden" />
    </SAvatarGroup>
    <SAvatarGroup id="nested" :max="max" size="lg" :ui="ui">
      <template v-for="person in people" :key="person">
        <SAvatar :text="person" />
      </template>
    </SAvatarGroup>
    <button id="reorder" @click="people = ['C', 'A', 'D', 'E']">
      Reorder
    </button>
    <button id="increase-max" @click="max = 3">
      Show three
    </button>
    <button id="clear" @click="people = []">
      Clear
    </button>
  </SApp>
</template>
