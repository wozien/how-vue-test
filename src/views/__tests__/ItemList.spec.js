import { shallowMount } from '@vue/test-utils'
import ItemList from '../ItemList.vue'
import flushPromises from 'flush-promises'
import { fetchListData } from '../../api/api'
import Item from '../../components/Item.vue'

jest.mock('../../api/api.js')

describe('ItemList.vue', () => {
  test('renders an Item with data for each item', async () => {
    expect.assertions(4)
    const $bar = {
      start: () => {},
      finish: () => {}
    }
    const items = [{id:1}, {id:2}, {id:3}]
    fetchListData.mockResolvedValueOnce(items)

    const wrapper = shallowMount(ItemList, { mocks: { $bar }})
    await flushPromises()
    const Items = wrapper.findAllComponents(Item)
    expect(Items).toHaveLength(items.length)
    Items.wrappers.forEach((wrapper, i) => {
      expect(wrapper.props().item).toBe(items[i])
    })
  })

  test('call $bar start on load', () => {
    const $bar = {
      start: jest.fn(),
      finish: () => {}
    }
    shallowMount(ItemList, {
      mocks: {
        $bar
      }
    })
    expect($bar.start).toHaveBeenCalled()
  })

  test('call $bar finish when load is successful', async () => {
    const $bar = {
      start: () => {},
      finish: jest.fn()
    }
    shallowMount(ItemList, { mocks: { $bar }})
    await flushPromises()

    expect($bar.finish).toHaveBeenCalled()
  })

  test('call $bar fail when load is unsuccessful', async () => {
    const $bar = {
      start: () => {},
      fail: jest.fn()
    }
    fetchListData.mockRejectedValueOnce()
    shallowMount(ItemList, { mocks: { $bar }})
    await flushPromises()

    expect($bar.fail).toHaveBeenCalled()
  })
})