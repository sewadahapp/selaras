import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    docs: defineCollection({
      type: 'page',
      source: 'components/**/*.md',
      schema: z.object({
        order: z.number(),
      }),
    }),
  },
})
