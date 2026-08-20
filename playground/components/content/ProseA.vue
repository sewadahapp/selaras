<script setup lang="ts">
defineProps<{
  href?: string
  target?: string
}>()
</script>

<template>
  <SProseA :href="href" :target="target">
    <slot />
  </SProseA>
</template>
