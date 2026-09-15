<script setup lang="ts">
const route = useRoute()
const { data: navigation } = useDocsNavigation()
const navigationOpen = ref(false)

watch(() => route.path, () => {
  navigationOpen.value = false
})
</script>

<template>
  <SHeader>
    <NuxtLink to="/" aria-label="Documentation home">
      Documentation
    </NuxtLink>
    <template #right>
      <SButton
        icon="hugeicons:sidebar-left-01"
        variant="ghost"
        color="neutral"
        aria-label="Open documentation navigation"
        @click="navigationOpen = true"
      />
    </template>
  </SHeader>
  <SDrawer v-model:open="navigationOpen" side="left" title="Documentation navigation" :handle="false">
    <template #body>
      <SContentNavigation :navigation="navigation ?? []" />
    </template>
  </SDrawer>
</template>
