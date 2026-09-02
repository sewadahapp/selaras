import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import FileUpload from '../../src/runtime/components/FileUpload.vue'

function makeFile(name: string, size: number, type = 'text/plain') {
  const file = new File([new Uint8Array(size)], name, { type })
  return file
}

function setInputFiles(input: HTMLInputElement, files: File[]) {
  const dataTransfer = new DataTransfer()
  files.forEach(file => dataTransfer.items.add(file))
  Object.defineProperty(input, 'files', { value: dataTransfer.files, configurable: true })
}

describe('fileUpload', () => {
  it('shows a dropped file in the list even with no v-model bound (uncontrolled)', async () => {
    // Unlike every Reka-primitive-based component, FileUpload has no
    // primitive underneath to fall back to its own internal state when
    // unbound - a real bug once shipped without its own internalFiles
    // ref: dropping a file with no v-model emitted into the void and
    // the list never visibly updated.
    const wrapper = await mountSuspended(FileUpload)
    const dropzone = wrapper.find('button')
    const file = makeFile('a.txt', 10)

    await dropzone.trigger('drop', { dataTransfer: { files: [file] } })
    await nextTick()

    expect(wrapper.find('li').text()).toContain('a.txt')
  })

  it('selecting a file via the native input emits update:modelValue', async () => {
    const wrapper = await mountSuspended(FileUpload)
    const input = wrapper.find('input[type="file"]')
    const file = makeFile('a.txt', 100)

    setInputFiles(input.element as HTMLInputElement, [file])
    await input.trigger('change')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[file]])
  })

  it('dropping a file emits update:modelValue', async () => {
    const wrapper = await mountSuspended(FileUpload)
    const dropzone = wrapper.find('button')
    const file = makeFile('a.txt', 100)

    await dropzone.trigger('drop', { dataTransfer: { files: [file] } })
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[file]])
  })

  it('replaces the current file (not appends) when multiple is false', async () => {
    const first = makeFile('a.txt', 10)
    const second = makeFile('b.txt', 10)
    const wrapper = await mountSuspended(FileUpload, { props: { modelValue: [first] } })
    const dropzone = wrapper.find('button')

    await dropzone.trigger('drop', { dataTransfer: { files: [second] } })
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[second]])
  })

  it('appends to the existing files when multiple is true', async () => {
    const first = makeFile('a.txt', 10)
    const second = makeFile('b.txt', 10)
    const wrapper = await mountSuspended(FileUpload, { props: { multiple: true, modelValue: [first] } })
    const dropzone = wrapper.find('button')

    await dropzone.trigger('drop', { dataTransfer: { files: [second] } })
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[first, second]])
  })

  it('rejects a file that fails accept and does not add it to modelValue', async () => {
    const wrapper = await mountSuspended(FileUpload, { props: { accept: 'image/*' } })
    const dropzone = wrapper.find('button')
    const file = makeFile('a.txt', 10, 'text/plain')

    await dropzone.trigger('drop', { dataTransfer: { files: [file] } })
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('error')?.[0]?.[0]).toEqual([{ file, reason: expect.stringContaining('a.txt') }])
  })

  it('rejects a file exceeding maxSize', async () => {
    const wrapper = await mountSuspended(FileUpload, { props: { maxSize: 50 } })
    const dropzone = wrapper.find('button')
    const file = makeFile('big.txt', 100)

    await dropzone.trigger('drop', { dataTransfer: { files: [file] } })
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('error')).toBeDefined()
  })

  it('accepts what fits under maxFiles and rejects only the overflow', async () => {
    const existing = makeFile('a.txt', 10)
    const wrapper = await mountSuspended(FileUpload, {
      props: { multiple: true, maxFiles: 2, modelValue: [existing] },
    })
    const dropzone = wrapper.find('button')
    const second = makeFile('b.txt', 10)
    const third = makeFile('c.txt', 10)

    await dropzone.trigger('drop', { dataTransfer: { files: [second, third] } })
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[existing, second]])
    expect(wrapper.emitted('error')?.[0]?.[0]).toEqual([{ file: third, reason: expect.any(String) }])
  })

  it('removing a file via its row button updates modelValue', async () => {
    const file = makeFile('a.txt', 10)
    const wrapper = await mountSuspended(FileUpload, { props: { modelValue: [file] } })

    await wrapper.find('li button').trigger('click')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[]])
  })

  it('blocks the dialog and drops while disabled', async () => {
    const wrapper = await mountSuspended(FileUpload, { props: { disabled: true } })
    const dropzone = wrapper.find('button')
    const file = makeFile('a.txt', 10)

    await dropzone.trigger('drop', { dataTransfer: { files: [file] } })
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.find('input[type="file"]').attributes('disabled')).toBeDefined()
  })

  it('sets a dragging state on dragenter and clears it on drop', async () => {
    const wrapper = await mountSuspended(FileUpload)
    const dropzone = wrapper.find('button')

    await dropzone.trigger('dragenter')
    expect(dropzone.attributes('data-dragging')).toBe('')

    await dropzone.trigger('drop', { dataTransfer: { files: [] } })
    expect(dropzone.attributes('data-dragging')).toBeUndefined()
  })

  it('clears the dragging state on dragleave to outside the dropzone, not onto a child', async () => {
    const wrapper = await mountSuspended(FileUpload)
    const dropzone = wrapper.find('button')
    const child = wrapper.find('span')

    await dropzone.trigger('dragenter')
    expect(dropzone.attributes('data-dragging')).toBe('')

    // Leaving onto a child of the dropzone should NOT clear it.
    await dropzone.trigger('dragleave', { relatedTarget: child.element })
    expect(dropzone.attributes('data-dragging')).toBe('')

    // Leaving to something outside the dropzone entirely should clear it.
    await dropzone.trigger('dragleave', { relatedTarget: document.body })
    expect(dropzone.attributes('data-dragging')).toBeUndefined()
  })

  it('merges a string :ui.dropzone override with the theme classes', async () => {
    const wrapper = await mountSuspended(FileUpload, { props: { ui: { dropzone: 'custom-class' } } })
    expect(wrapper.find('button').classes()).toContain('custom-class')
  })
})
