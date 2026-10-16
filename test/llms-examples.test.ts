import { describe, expect, it } from 'vitest'
import { expandLlmsExamples } from '../docs/utils/llms-examples'

describe('agent documentation examples', () => {
  const examples = { 'button-basic': '<template>\n  <SButton>Save</SButton>\n</template>' }

  it.each([
    '::component-example{name="button-basic"}\n::',
    ':component-example{name="button-basic"}',
    '<component-example name="button-basic"></component-example>',
    '<component-example name="button-basic" />',
    '::block-preview{name="button-basic"}\n::',
    ':block-preview{name="button-basic"}',
    '<block-preview name="button-basic"></block-preview>',
    '<block-preview name="button-basic" />',
  ])('expands %s into a complete Vue code block', (embed) => {
    const markdown = expandLlmsExamples(`Before\n${embed}\nAfter`, examples)
    expect(markdown).toContain(`\n\`\`\`vue\n${examples['button-basic']}\n\`\`\`\n`)
    expect(markdown).toContain('Before')
    expect(markdown).toContain('After')
    expect(markdown).not.toContain('component-example')
    expect(markdown).not.toContain('block-preview')
  })

  it('uses a longer fence when example source contains Markdown fences', () => {
    expect(expandLlmsExamples('::component-example{name="code"}\n::', { code: '<template>```</template>' }))
      .toContain('````vue\n<template>```</template>\n````')
  })

  it('fails on unresolved examples rather than publishing incomplete guidance', () => {
    expect(() => expandLlmsExamples('::component-example{name="missing"}\n::', examples))
      .toThrow('Missing documentation example: missing')
  })

  it('includes the installation command with a copyable editor block', () => {
    const markdown = expandLlmsExamples('::block-preview{name="block-editor-quill"}\n::', { 'block-editor-quill': '<template>Editor</template>' })
    expect(markdown).toContain('```sh\nbun add quill@2\n```')
    expect(markdown).toContain('```vue\n<template>Editor</template>\n```')
  })
})
