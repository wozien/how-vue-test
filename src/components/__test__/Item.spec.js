// import Vue from 'vue'
import { shallowMount } from '@vue/test-utils'
import Item from '../Item.vue'

describe('Item.vue', () => {
  test('renders item.url', () => {
    const item = {
      url: 'http://some-url.com',
    }

    const wrapper = shallowMount(Item, {
      propsData: { item }
    })
    expect(wrapper.text()).toContain(item.url)
  })

  test('renders item.url', () => {
    const item = {
      score: 10
    }

    const wrapper = shallowMount(Item, {
      propsData: { item }
    })
    expect(wrapper.text()).toContain('' + item.score)
  })

  test('renders item.by', () => {
    const item = {
      by: 10
    }

    const wrapper = shallowMount(Item, {
      propsData: { item }
    })
    expect(wrapper.text()).toContain('' + item.by)
  })

  test('renders a link to the item.url with item.title as test', () => {
    const item = {
      url: 'http://some-url.com',
      title: 'some-title'
    }

    const wrapper =  shallowMount(Item, {
      propsData: { item }
    })
    const a = wrapper.find('a')
    expect(a.text()).toBe(item.title)
    expect(a.attributes().href).toBe(item.url)
  })
})