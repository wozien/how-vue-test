import { expect } from '@jest/globals'
import { mount } from '@vue/test-utils'
import { titleMixin } from '../mixins'

describe('titleMixin', () => {
  test('set document title using component title property', () => {
    const component = {
      render() {},
      title: 'a title',
      mixins: [titleMixin]
    }
    mount(component)
    expect(document.title).toBe('a title')
  })

  test('does not set title if title option is not exists', () => {
    document.title = 'old title'
    const component = {
      render() {},
      mixins: [titleMixin]
    }
    mount(component)
    expect(document.title).toBe('old title')
  })

  test('using this.title rather than this.$options.title', () => {
    const component = {
      render() {},
      title: 'option title',
      data() {
        return {
          title: 'my title'
        }
      },
      mixins: [titleMixin]
    }
    mount(component)
    expect(document.title).toBe('my title')
  })
})