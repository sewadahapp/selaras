import { resolve } from 'node:path'
import { defineCollection, defineContentConfig, z } from '@nuxt/content'
import { useNuxt } from '@nuxt/kit'

const { options } = useNuxt()

export default defineContentConfig({
  collections: {
    docs: defineCollection({
      type: 'page',
      source: [
        {
          cwd: resolve(options.rootDir, 'content'),
          include: '**/*.md',
        },
        {
          cwd: resolve(options.rootDir, 'content'),
          // Nuxt Content reads this metadata into the navigation tree.
          include: '**/.navigation.yml',
        },
      ],
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
        toc: z.boolean().optional(),
        aside: z.boolean().optional(),
        editLink: z.boolean().optional(),
        prevNext: z.boolean().optional(),
      }),
    }),
  },
})
