<script setup>
const mode = useColorMode()
const mounted = ref(false)
onMounted(() => mounted.value = true)
</script>

<template>
  <section :data-mounted="mounted">
    <SColorModeToggle id="toggle" />
    <SColorModeSwitch id="switch" />
    <output id="mode">{{ mounted ? mode.value : '' }}</output>
    <output id="preference">{{ mounted ? mode.preference : '' }}</output>
  </section>
</template>
