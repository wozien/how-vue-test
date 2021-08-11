import { shallowMount } from '@vue/test-utils'
import Spinner from '../Spinner.vue'

describe('Spinner', () => {
  test('render correctly', () => {
    expect(shallowMount(Spinner).element).toMatchSnapshot()
  })
})