测试 `vue-router` 主要的方法是模拟 `$route` 和 `$router` 实例的属性，然后进行相关断言

## 测试 $route

```js
// ItemList.sepc.js
test('dispatch fetchListData with $route.params.type', async () => {
  const store = createStore()
  store.dispatch = jest.fn(() => Promise.resolve())
  const type = 'a type'
  const mocks = {
    $route: {
      params: { type }
    }
  }
  createWrapper({ mocks, store })

  expect(store.dispatch).toHaveBeenCalledWith('fetchListData', { type })
})
```

## 测试 $router

```js
// ItemList.sepc.js
test('call $router.replace when page is greater than maxPage', async () => {
  const store = createStore({
    getters: {
      maxPage: () => 5
    }
  })
  const mocks = {
    $route: {
      params: { page: 100 }
    },
    $router: {
      replace: jest.fn()
    }
  }
  createWrapper({ mocks, store })
  await flushPromises()
  expect(mocks.$router.replace).toHaveBeenCalledWith('/top/1')
})
```

## 测试 RouterLink 组件

由于 `vue-router` 没有导出相关组件， 所以需要通过 `stubs` 属性进行存根处理， 值设置为 `RouterLinkStub`

```js
import { shallowMount, RouterLinkStub } from '@vue/test-utils'

shallowMount(TestComponent, {
  stubs: {
    RouterLink: RouterLinkStub
  }
})
```

然后通过 `findComponent(RouterLinkStub)` 找到组件的包装器

```js
// ItemList.sepc.js
test('renders a RouterLink with the previous page if one exists', () => {
  const mocks = {
    $route: {
      params: { page: 2 }
    }
  }
  const wrapper = createWrapper({ mocks })
  expect(wrapper.findComponent(RouterLinkStub).props().to).toBe('/top/1')
  expect(wrapper.findComponent(RouterLinkStub).text()).toBe('< prev')
})
```