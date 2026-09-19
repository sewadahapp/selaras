import { resolve } from 'node:path'
import { defineCollection, defineContentConfig, z } from '@nuxt/content'
import { useNuxt } from '@nuxt/kit'

const { options } = useNuxt()

export default defineContentConfig({
  collections: {
    docs: defineCollection({
      type: 'page',
      source: {
        cwd: resolve(options.rootDir, 'content'),
        include: '**/*.md',
      },
      schema: z.object({
        order: z.number().optional(),
      }),
    }),
  },
})
