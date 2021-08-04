import { expect } from '@jest/globals'
import { shallowMount } from '@vue/test-utils'
import Modal from '../Modal.vue'

describe('Modal.vue', () => {
  // test('call onClose when button is clicked', () => {
  //   const onClose = jest.fn()
  //   const wrapper = shallowMount(Modal, {
  //     propsData: {
  //       onClose
  //     }
  //   })
  //   wrapper.find('button').trigger('click')
  //   expect(onClose).toHaveBeenCalled()
  // })

  test('emit close-modal when button is clicked', () => {
    const wrapper = shallowMount(Modal)
    wrapper.find('button').trigger('click')
    expect(wrapper.emitted('close-modal')).toHaveLength(1)
  })
})