<script setup lang="ts">
const disabledOff = ref(false)
const disabledOn = ref(true)
const invalidChoice = ref(false)
</script>

<template>
  <div class="flex flex-col gap-4">
    <SSwitch v-model="disabledOff" disabled label="Disabled" />
    <SSwitch v-model="disabledOn" disabled label="Disabled, on" />
    <SSwitch v-model="invalidChoice" invalid label="You must enable this to continue" />
  </div>
</template>
