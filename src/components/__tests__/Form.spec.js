import { expect, test } from '@jest/globals'
import { shallowMount } from '@vue/test-utils'
import Form from '../Form.vue'
import axios from 'axios'

jest.mock('axios')

describe('Form.vue', () => {
  test('emit form-submitted when button is clicked', () => {
    // axios.post.mockResolvedValueOnce(true)
    const wrapper = shallowMount(Form)
    wrapper.find('button').trigger('submit')
    expect(axios.post).toHaveBeenCalled()
    expect(wrapper.emitted('form-submitted')).toHaveLength(1)
  })

  test('send post request with email on submit', () => {
    const wrapper = shallowMount(Form)
    const input = wrapper.find('input[type="email"]')
    input.setValue('email@gmail.com') // v-model update
    wrapper.find('button').trigger('submit')
    
    const url ='http://demo7437963.mockable.io/validate'
    const expectData = expect.objectContaining({
      email: 'email@gmail.com'
    })
    expect(axios.post).toHaveBeenCalledWith(url, expectData)
  })

  test('send post request with entercompetition checkbox value on submit', () => {
    const wrapper = shallowMount(Form)
    wrapper.find('input[value=no').setChecked()
    wrapper.find('button').trigger('submit')

    const url ='http://demo7437963.mockable.io/validate'
    expect(axios.post).toHaveBeenLastCalledWith(url, expect.objectContaining({
      enterCompetition: false
    }))
  })
})