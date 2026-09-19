import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import FileUpload from '../../src/runtime/components/FileUpload.vue'

function makeFile(name: string, size: number, type = 'text/plain') {
  const file = new File([new Uint8Array(size)], name, { type })
  return file
}

function setInputFiles(input: HTMLInputElement, files: File[]) {
  const dataTransfer = new DataTransfer()
  files.forEach(file => dataTransfer.items.add(file))
  Object.defineProperty(input, 'files', { value: dataTransfer.files, configurable: true, writable: true })
}

describe('fileUpload', () => {
  it('restores controlled files when the parent ignores native form reset', async () => {
    const file = makeFile('keep.txt', 10)
    const wrapper = await mountSuspended(defineComponent({
      render: () => h('form', {}, [h(FileUpload, { modelValue: [file] })]),
    }))
    wrapper.find('form').element.reset()
    await nextTick()
    expect(wrapper.find('li').text()).toContain('keep.txt')
    expect(Array.from((wrapper.find('input').element as HTMLInputElement).files!, file => file.name)).toEqual(['keep.txt'])
    wrapper.unmount()
  })

  it('restores native submission when a controlled parent vetoes selection', async () => {
    const wrapper = await mountSuspended(FileUpload, { props: { modelValue: [] } })
    const input = wrapper.find('input[type="file"]')
    setInputFiles(input.element as HTMLInputElement, [makeFile('veto.txt', 10)])
    await input.trigger('change')
    expect((input.element as HTMLInputElement).files).toHaveLength(0)
    wrapper.unmount()
  })

  it('synchronizes native files when the controlled parent replaces its model', async () => {
    const wrapper = await mountSuspended(FileUpload, { props: { modelValue: [makeFile('first.txt', 10)] } })
    await wrapper.setProps({ modelValue: [makeFile('second.txt', 10)] })
    const files = (wrapper.find('input').element as HTMLInputElement).files!
    expect(Array.from(files, file => file.name)).toEqual(['second.txt'])
    wrapper.unmount()
  })

  it('preserves files when native form reset is canceled', async () => {
    const wrapper = await mountSuspended(defineComponent({
      render: () => h('form', { onReset: (event: Event) => event.preventDefault() }, [h(FileUpload)]),
    }))
    await wrapper.find('button').trigger('drop', { dataTransfer: { files: [makeFile('keep.txt', 10)] } })
    wrapper.find('form').element.reset()
    await nextTick()
    expect(wrapper.find('li').text()).toContain('keep.txt')
    expect((wrapper.find('input').element as HTMLInputElement).files).toHaveLength(1)
    wrapper.unmount()
  })

  it('keeps template-style controlled files when the parent ignores a drop', async () => {
    const wrapper = await mountSuspended(defineComponent({
      render: () => h(FileUpload, { 'model-value': [] }),
    }))
    await wrapper.find('button').trigger('drop', { dataTransfer: { files: [makeFile('a.txt', 10)] } })
    expect(wrapper.find('li').exists()).toBe(false)
    wrapper.unmount()
  })

  it('binds a custom semantic role to semantic color variables', async () => {
    const wrapper = await mountSuspended(FileUpload, { props: { color: 'premium' as any } })
    expect(wrapper.attributes('data-selaras-color')).toBe('premium')
    expect(wrapper.attributes('style') ?? '').not.toContain('--_selaras-color-fill')
    expect(wrapper.find('button').classes()).toContain('focus-visible:ring-[var(--_selaras-color-focus)]')
  })

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
    expect((input.element as HTMLInputElement).files).toHaveLength(1)
  })

  it('clears uncontrolled files when the containing form resets', async () => {
    const wrapper = await mountSuspended(defineComponent({
      render: () => h('form', {}, [h(FileUpload)]),
    }))
    const file = makeFile('a.txt', 100)

    await wrapper.find('button').trigger('drop', { dataTransfer: { files: [file] } })
    await nextTick()
    expect(wrapper.find('li').exists()).toBe(true)

    wrapper.find('form').element.reset()
    await nextTick()
    await nextTick()

    expect(wrapper.find('li').exists()).toBe(false)
    wrapper.unmount()
  })

  it('forwards native file input attributes to the actual file control', async () => {
    const wrapper = await mountSuspended(FileUpload, {
      attrs: { capture: 'environment', form: 'upload-form' },
    })
    const input = wrapper.find('input[type="file"]')

    expect(input.attributes('capture')).toBe('environment')
    expect(input.attributes('form')).toBe('upload-form')
    expect(wrapper.find('div').attributes('capture')).toBeUndefined()
    expect(wrapper.find('div').attributes('form')).toBeUndefined()
  })

  it('dropping a file emits update:modelValue', async () => {
    const wrapper = await mountSuspended(FileUpload)
    const dropzone = wrapper.find('button')
    const file = makeFile('a.txt', 100)

    await dropzone.trigger('drop', { dataTransfer: { files: [file] } })
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[file]])
  })

  it('keeps a controlled empty file list when the parent ignores selection', async () => {
    const wrapper = await mountSuspended(FileUpload, { props: { modelValue: [] } })
    const file = makeFile('a.txt', 100)

    await wrapper.find('button').trigger('drop', { dataTransfer: { files: [file] } })
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[file]])
    expect(wrapper.find('li').exists()).toBe(false)
  })

  it('keeps a controlled file list when the parent ignores removal', async () => {
    const file = makeFile('a.txt', 100)
    const wrapper = await mountSuspended(FileUpload, { props: { modelValue: [file] } })

    await wrapper.find('li button').trigger('click')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[]])
    expect(wrapper.find('li').text()).toContain('a.txt')
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

  it('uses semantic border and focus colors for invalid dropzones', async () => {
    const wrapper = await mountSuspended(FileUpload, { props: { invalid: true } })
    expect(wrapper.find('button').classes()).toContain('border-[var(--_selaras-color-border)]')
    expect(wrapper.find('button').classes()).toContain('focus-visible:ring-[var(--_selaras-color-focus)]')
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
