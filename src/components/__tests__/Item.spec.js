import { shallowMount, RouterLinkStub } from '@vue/test-utils'
import Item from '../Item.vue'
import merge from 'lodash.merge'


function createWrapper(mountConfig) {
  const config = {
    stubs: {
      RouterLink: RouterLinkStub
    },
    propsData: {
      item: {}
    }
  }
  return shallowMount(Item, merge(config, mountConfig))
}

describe('Item.vue', () => {
  test('renders item.url', () => {
    const item = {
      url: 'http://some-url.com',
    }

    const wrapper = createWrapper({
      propsData: {item}
    })
    expect(wrapper.text()).toContain('(some-url.com)')
  })

  test('renders item.url', () => {
    const item = {
      score: 10
    }

    const wrapper = createWrapper({
      propsData: {item}
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

    const wrapper = createWrapper({
      propsData: {item}
    })
    const a = wrapper.find('a')
    expect(a.text()).toBe(item.title)
    expect(a.attributes().href).toBe(item.url)
  })

  test('renders the time since the last post', () => {
    const dateNow = jest.spyOn(Date, 'now')
    const dateNowTime = new Date('2021')

    dateNow.mockImplementation(() => dateNowTime)

    const item = {
      time: (dateNowTime / 1000) - 600
    }
    const wrapper = createWrapper({
      propsData: {item}
    })
    dateNow.mockRestore()
    expect(wrapper.text()).toContain('10 minutes ago')
  })

  // snapshot
  test('renders correctly', () => {
    const dateNow = jest.spyOn(Date, 'now')
    const dateNowTime = new Date('2021')

    dateNow.mockImplementation(() => dateNowTime)
    const item = {
      by: 'aaa',
      id: 1234,
      score: 10,
      time: (dateNowTime/1000) - 600,
      title: 'vue-test-utils',
      type: 'story',
      url: 'https://www.baidu.com'
    }
    const wrapper = createWrapper({
      propsData: { item }
    })
    expect(wrapper.element).toMatchSnapshot();
  })
})