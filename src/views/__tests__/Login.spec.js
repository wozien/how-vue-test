import { expect } from '@jest/globals'
import { shallowMount } from '@vue/test-utils'
import Modal from '../../components/Modal.vue'
import Login from '../Login.vue'

describe('Login.vue', () => {
  test('hide Modal when Modal emit close-modal', async () => {
    const wrapper = shallowMount(Login)
    wrapper.findComponent(Modal).vm.$emit('close-modal')
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(Modal).exists()).toBeFalsy()
  })
})