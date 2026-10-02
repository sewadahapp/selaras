import examples from '#selaras-llms-examples'
import { expandLlmsExamples } from '../../utils/llms-examples'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('beforeResponse', (event, response) => {
    const path = event.path.split('?')[0]!
    if ((path.includes('/raw/') || path.endsWith('/llms-full.txt')) && typeof response.body === 'string')
      response.body = expandLlmsExamples(response.body, examples)
  })
})
