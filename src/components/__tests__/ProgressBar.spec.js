import { shallowMount } from '@vue/test-utils'
import ProgressBar from '../ProgressBar.vue'

describe('ProgressBar.vue', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  test('initial width with 0%', () => {
    const wrapper = shallowMount(ProgressBar)
    expect(wrapper.element.style.width).toBe('0%')
  })

  test('display the bar when start is called', async () => {
    const wrapper = shallowMount(ProgressBar)
    expect(wrapper.classes()).toContain('hidden')

    wrapper.vm.start()
    await wrapper.vm.$nextTick()
    expect(wrapper.classes()).not.toContain('hidden')
  })

  test('call finish method', async () => {
    const wrapper = shallowMount(ProgressBar)
    wrapper.vm.start()
    wrapper.vm.finish()
    await wrapper.vm.$nextTick()
    expect(wrapper.element.style.width).toBe('100%')
    expect(wrapper.classes()).toContain('hidden')
  })

  test('increase width by 1% every 100ms after start call', async () => {
    const wrapper = shallowMount(ProgressBar)

    wrapper.vm.start()
    await jest.advanceTimersByTime(100)
    expect(wrapper.element.style.width).toBe('1%')

    await jest.advanceTimersByTime(900)
    expect(wrapper.element.style.width).toBe('10%')

    await jest.advanceTimersByTime(4000)
    expect(wrapper.element.style.width).toBe('50%')
  })

  test('clear timer when finish is called', () => {
    const spy = jest.spyOn(window, 'clearInterval')
    const wrapper = shallowMount(ProgressBar)
    wrapper.vm.start()
    wrapper.vm.finish()
    expect(spy).toHaveBeenCalled()
  })
})