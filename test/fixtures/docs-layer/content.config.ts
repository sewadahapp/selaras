import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    docs: defineCollection({
      type: 'page',
      source: '**/*.md',
      schema: z.object({
        order: z.number().optional(),
        icon: z.union([z.string(), z.literal(false)]).optional(),
        collapse: z.boolean().optional(),
        navBadges: z.array(z.union([
          z.string(),
          z.object({ text: z.string() }),
        ])).optional(),
        navigation: z.union([
          z.boolean(),
          z.object({
            title: z.string().optional(),
            icon: z.union([z.string(), z.literal(false)]).optional(),
            order: z.number().optional(),
            navBadges: z.array(z.union([
              z.string(),
              z.object({ text: z.string() }),
            ])).optional(),
          }),
        ]).optional(),
      }),
    }),
  },
})
