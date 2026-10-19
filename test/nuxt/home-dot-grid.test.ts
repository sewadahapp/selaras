import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import HomeDotGrid from '../../docs/components/HomeDotGrid.vue'

const arc = vi.fn()
let callbacks: Map<number, FrameRequestCallback>
let motion: EventTarget & { matches: boolean }
let wrapper: ReturnType<typeof mount>

function drawFrame(now = performance.now() + 100_000) {
  const pending = [...callbacks.values()]
  callbacks.clear()
  arc.mockClear()
  pending.forEach(callback => callback(now))
}

function move(target: EventTarget, x = 220, y = 100, pointerType = 'mouse') {
  target.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX: x, clientY: y, pointerType }))
  drawFrame()
}

function expectIdle() {
  expect(arc).toHaveBeenCalled()
  expect(arc.mock.calls.every(args => args[2] === 1.1)).toBe(true)
}

beforeEach(() => {
  callbacks = new Map()
  let frame = 0
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    callbacks.set(++frame, callback)
    return frame
  })
  vi.stubGlobal('cancelAnimationFrame', (id: number) => callbacks.delete(id))
  motion = Object.assign(new EventTarget(), { matches: false })
  vi.spyOn(window, 'matchMedia').mockReturnValue(motion as MediaQueryList)
  vi.stubGlobal('ResizeObserver', class {
    observe() {}
    disconnect() {}
  })
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
    arc,
    setTransform: vi.fn(),
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    fill: vi.fn(),
  } as unknown as CanvasRenderingContext2D)
  vi.spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 440, 220))
  vi.spyOn(HTMLCanvasElement.prototype, 'clientWidth', 'get').mockReturnValue(440)
  vi.spyOn(HTMLCanvasElement.prototype, 'clientHeight', 'get').mockReturnValue(220)
  wrapper = mount(defineComponent({
    setup: () => () => h('section', [
      h('div', { class: 'background' }, h(HomeDotGrid)),
      h('button', 'Foreground control'),
    ]),
  }), { attachTo: document.body })
  drawFrame()
})

afterEach(() => {
  wrapper.unmount()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('homepage dot grid pointer interaction', () => {
  it('responds over foreground content and clears outside the canvas', () => {
    move(wrapper.get('button').element)
    expect(arc.mock.calls.some(args => args[2] > 1.1)).toBe(true)
    move(window, 500, 300)
    expectIdle()
  })

  it.each(['blur', 'scroll', 'pointerleave'])('clears the hover on %s', (type) => {
    move(wrapper.get('button').element)
    const target = type === 'pointerleave' ? document.documentElement : window
    target.dispatchEvent(new Event(type))
    drawFrame()
    expectIdle()
  })

  it('stops the entrance and pointer effects when reduced motion is enabled', () => {
    wrapper.unmount()
    wrapper = mount(HomeDotGrid, { attachTo: document.body })
    motion.matches = true
    motion.dispatchEvent(Object.assign(new Event('change'), { matches: true }))
    drawFrame(performance.now() + 100)
    expectIdle()
    move(window)
    expect(arc).not.toHaveBeenCalled()
    expect(callbacks.size).toBe(0)
  })

  it('clears a mouse hover when touch input takes over', () => {
    move(wrapper.get('button').element)
    move(wrapper.get('button').element, 220, 100, 'touch')
    expectIdle()
  })
})
