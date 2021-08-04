import { expect, test } from '@jest/globals'
import { shallowMount } from '@vue/test-utils'
import Form from '../Form.vue'

describe('Form.vue', () => {
  test('emit form-submitted when button is clicked', () => {
    const wrapper = shallowMount(Form)
    wrapper.find('button').trigger('submit')
    expect(wrapper.emitted('form-submitted')).toHaveLength(1)
  })
})