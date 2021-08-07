测试 `vuex` 可以有两种方法， 一种是颗粒度较小的单独测试 `actions`, `mutations`, `getters`, 这种方法好处是更加具体，但是会花费较多的时间精力。另外一种是测试一个`store` 实例子，这种方式会更加简便，但是测试失败无法快速定位是 `store` 那一部分出错。

## 独立测试

### 测试 Mutations

主要调用 `mutations` 函数并且断言结果即可

```js
// mutations.js
export default {
  setItems(state, { items }) {
    state.items = items
  }
}
```

```js
// mutations.spec.js
test('setItems set state.items to items', () => {
  const state = {
    items: []
  }
  const items = [{id:1}, {id:2}]
  mutations.setItems(state, { items })
  expect(state.items).toBe(items)
})
```

### 测试 Getters

和 `mutations` 测试方法相同

```js
// getters.js
export default {
  displayItems(state) {
    return state.items.slice(0, 20)
  }
}
```

```js
// getters.spec.js
test('displayItems return the first 20 items from state.items', () => {
  const items = Array(21).fill().map((v,i) => i)
  const state = { items }
  const displayItems = getters.displayItems(state)
  expect(displayItems).toEqual(items.slice(0, 20))
})
```

### 测试 actions

测试 `actions` 比较麻烦， 需要模拟异步函数的实现，并且断言模拟的 `context` 的 `commit` 函数是否传入的正确的异步结果进行调用 

```js
// actions.js
export default {
  fetchListData({ commit }, { type }) {
    fetchListData(type).then(items => {
      commit('setItems', { items })
    })
  }
}
```

```js
// actions.spec.js
import actions from "../actions";
import { fetchListData } from '../../api/api'
import flushPromise from 'flush-promises'

jest.mock('../../api/api.js')

describe('actions', () => {
  test('fetchList calls commit with the result', async () => {
    const items = [{}, {}]
    fetchListData.mockImplementationOnce(type => {
      return Promise.resolve(type === 'top' ? items : [])
    })
    const context = { commit: jest.fn() }
    actions.fetchListData(context, { type: 'top' })
    await flushPromise()
    
    expect(context.commit).toHaveBeenCalledWith('setItems', { items })
  })
})
```

## 测试 store 实例

```js
import { createLocalVue } from '@vue/test-utils'
import storeConfig from '../index'
import cloneDeep from 'lodash.clonedeep'
import { fetchListData } from '../../api/api'
import flushPromise from 'flush-promises'

jest.mock('../../api/api.js')

const localVue = createLocalVue()
localVue.use(Vuex)

describe('store', () => {
  test('dispatch fetchListData update displayItems', async () => {
    const items = Array(21).fill().map((v,i) => i)
    const store = new Vuex.Store(cloneDeep(storeConfig))
    fetchListData.mockImplementationOnce(type => {
      return Promise.resolve(type === 'top' ? items : [])
    })
    store.dispatch('fetchListData', { type: 'top' })
    await flushPromise()

    expect(store.getters.displayItems).toEqual(items.slice(0, 20))
  })
})
```

其实 `localVue` 和 `store` 配置的深拷贝都是为了防止全局 `Vue` 和 `state` 的污染

## 测试 Vuex 组件

```js
// ItemList.spec.js
describe('ItemList.vue', () => {)
  // ..
  let storeConfig
  let store

  // 前置钩子创建store
  beforeEach(() => {
    storeConfig = {
      getters: {
        displayItems: jest.fn()
      },
      actions: {
        fetchListData: jest.fn(() => Promise.resolve([]))
      }
    }
    store = new Vuex.Store(storeConfig)
  })

  test('renders Item with data in store.getters.displayItem', () => {
    expect.assertions(4)
    const $bar = {
      start: () => {},
      finish: () => {}
    }
    const items = [{id:1}, {id:2}, {id:3}]
    storeConfig.getters.displayItems.mockReturnValue(items)
    const wrapper = shallowMount(ItemList, {
      mocks: { $bar },
      localVue,  // 使用 localVue 构造函数挂载
      store  // this.$store
    })
    const Items = wrapper.findAllComponents(Item)
    expect(Items).toHaveLength(items.length)
    Items.wrappers.forEach((wrapper, i) => {
      expect(wrapper.props().item).toBe(items[i])
    })
  })
})
```