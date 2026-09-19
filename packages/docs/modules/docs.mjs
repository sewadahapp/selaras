import { resolve } from 'node:path'
import { addTemplate, createResolver, defineNuxtModule } from '@nuxt/kit'

function cssPath(path) {
  return path.replaceAll('\\', '/')
}

export default defineNuxtModule({
  meta: {
    name: '@sewadah/selaras-docs',
    configKey: 'selarasDocs',
  },
  defaults: {
    css: true,
  },
  setup(options, nuxt) {
    if (!options.css)
      return

    const { resolve: resolveLayer } = createResolver(import.meta.url)
    const layerApp = cssPath(resolveLayer('../app'))
    const consumerContent = cssPath(resolve(nuxt.options.rootDir, 'content'))
    const consumerComponents = cssPath(resolve(nuxt.options.rootDir, 'components'))
    const stylesheet = addTemplate({
      filename: 'selaras-docs.css',
      write: true,
      getContents: () => `@import "tailwindcss";
@import "@sewadah/selaras/theme.css";
@import "#selaras/tailwind.css";
@import "@sewadah/selaras/prose.css";
@import "@sewadah/selaras-docs/style.css";

@source "${layerApp}/**/*";
@source "${consumerContent}/**/*";
@source "${consumerComponents}/**/*";
`,
    })

    nuxt.options.css.unshift(stylesheet.dst)
  },
})
