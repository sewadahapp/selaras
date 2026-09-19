<script setup lang="ts">
import ProseH1 from '@sewadah/selaras/components/ProseH1.vue'
import ProseH2 from '@sewadah/selaras/components/ProseH2.vue'
import ProseH3 from '@sewadah/selaras/components/ProseH3.vue'
import ProseH4 from '@sewadah/selaras/components/ProseH4.vue'
import ProseH5 from '@sewadah/selaras/components/ProseH5.vue'
import ProseH6 from '@sewadah/selaras/components/ProseH6.vue'
import ProsePre from '@sewadah/selaras/components/ProsePre.vue'

const route = useRoute()
const appConfig = useAppConfig()
const { data: page } = await useAsyncData(`selaras-docs:${route.path}`, () => queryCollection('docs').path(route.path).first())

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Documentation page not found', fatal: true })
}

definePageMeta({ layout: 'selaras-docs' })
useSeoMeta({ title: page.value.title, description: page.value.description ?? appConfig.selarasDocs?.site?.description })

const proseComponents = {
  h1: ProseH1,
  h2: ProseH2,
  h3: ProseH3,
  h4: ProseH4,
  h5: ProseH5,
  h6: ProseH6,
  pre: ProsePre,
}
</script>

<template>
  <SContainer size="full">
    <SPageHeader :description="page!.description" />
    <ContentRenderer :value="page!" :components="proseComponents" class="selaras-docs-content" />
  </SContainer>
</template>
