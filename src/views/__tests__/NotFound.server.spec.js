/**
 * @jest-environment node
 */
import { renderToString, render } from '@vue/server-test-utils'
import NotFound from '../NotFound.vue'

describe('NotFound.vue', () => {
  test('renders correctly on server', async () => {
    const html = await renderToString(NotFound)
    expect(html).toMatchSnapshot()
  })

  test('renders 404 inside <h1>', async () => {
    const wrapper = await render(NotFound)
    expect(wrapper.find('h1').text()).toBe('404')
  })
})