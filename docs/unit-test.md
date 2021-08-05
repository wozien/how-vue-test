# 单元测试 (Unit Test)

在vue项目中，不局限于测试函数功能，测试一个组件的功能也称为单元测试

## 测试渲染文本

### 一个简单的例子

测试一个 Item 组件的内容

```xml
<template>
  <div>item</div>
</template>
```

测试代码：

```js
// import Vue from 'vue'
import { shallowMount } from '@vue/test-utils'
import Item from '../Item.vue'

describe('Item.vue', () => {
  test('render "item"', () => {
    // 不用 vue-test-utils 方式
    // const Ctor = Vue.extend(Item)
    // const vm = new Ctor().$mount()
    // expect(vm.$el.textContent).toContain('item')

    const wrapper = shallowMount(Item)
    expect(wrapper.text()).toContain('item')
  })
})
```

`shallowMount` 表示组件浅挂载，只挂在当前组件，而不会挂在子组件树

### 渲染文本测试
```xml
<!-- Item.vue -->
<template>
  <li>
    <a :href="item.url">{{ item.title }}</a>
    {{ item.url }}
  </li>
</template>

<script>
export default {
  props: ['item']
}
</script>
```

`toContain` 表示是否包含一个目标文本，`find` 方法可以根据选择器找到对应元素的包装器, `attributes` 方法用户获取 DOM 属性对象

```js
describe('Item.vue', () => {
  test('renders item.url', () => {
    const item = {
      url: 'http://baidu.com'
    }

    const wrapper = shallowMount(Item, {
      propsData: { item }
    })
    expect(wrapper.text()).toContain(item.url)
  })

  test('renders a link to the item.url with item.title as test', () => {
    const item = {
      rl: 'http://some-url.com',
      title: 'some-title'
    }

    const wrapper =  shallowMount(Item, {
      propsData: { item }
    })
    // find 返回的也是包装器对象
    expect(wrapper.find('a').text()).toBe(item.title)
    expect(a.attributes().href).toBe(item.url)
  })
})
```

### 测试渲染组件的数量

可以利用 `findAll` 方法获取对应选择器的DOM属性， 利用 `findAllComponents` 方法获取选择的子组件的数量

```xml
<!-- ItemList.vue -->
<template>
  <div class="item-list">
    <Item v-for="item in items" :key="item.id" :item="item"/>
  </div>
</template>

<script>
import Item from '../components/Item.vue'

export default {
  components: {
    Item
  },
  data() {
    return {
      items: window.items
    }
  }
}
</script>
```

`ItemList.spec.js`

```js
test('renders an Item for each item in window.items', () => {
  window.items = [{}, {}, {}]

  const wrapper = shallowMount(ItemList)

  // toHaveLength 是为了更好的语义化，等于.length 和 toBe
  expect(wrapper.findAllComponents(Item)).toHaveLength(window.items.length)
})
```

### 测试Prop

要测试一个组件是否接受一个正确的prop, 可以调用 `props` 方法

```js
test('renders an Item with data for each item in window.items', () => {
  window.items = [{}, {}, {}]
  const wrapper = shallowMount(ItemList)
  const items = wrapper.findAllComponents(Item)
  items.wrappers.forEach((wrapper, i) => {
    expect(wrapper.props().item).toBe(window.items[i])
  })
})
```

### 测试样式

```xml
<!-- ProgressBar.vue -->
<template>
  <div class="hidden" :style="{width: '0%'}"></div>
</template>
```

```js
// ProgressBar.spec.js
describe('ProgressBar.vue', () => {
  test('is hidden on initial render', () => {
    const wrapper = shallowMount(ProgressBar)
    expect(wrapper.classes()).toContain('hidden')
  })

  test('initial width with 0%', () => {
    const wrapper = shallowMount(ProgressBar)
    // element 表示包装器对应的dom元素
    expect(wrapper.element.style.width).toBe('0%')
  })
})
```

## 测试组件方法

### 测试公开方法

通过 `wrapper.vm` 访问组件实例方法， 由于异步更新，需要在 `nextTick` 访问DOM属性

```js
test('display the bar when start is called', async () => {
  const wrapper = shallowMount(ProgressBar)
  expect(wrapper.classes()).toContain('hidden')

  wrapper.vm.start()
  await wrapper.vm.$nextTick()
  expect(wrapper.classes()).not.toContain('hidden')
})
```

### 测试定时器

jest 提供一系列的方法去拦截模拟原生的定时方法

```js
beforeEach(() => {
  jest.useFakeTimers()
})

test('increase width by 1% every 100ms after start call', async () => {
  const wrapper = shallowMount(ProgressBar)

  wrapper.vm.start()
  await jest.advanceTimersByTime(100)
  expect(wrapper.element.style.width).toBe('1%')

  await jest.advanceTimersByTime(900)
  expect(wrapper.element.style.width).toBe('10%')

  await jest.advanceTimersByTime(4000)
  expect(wrapper.element.style.width).toBe('50%')
})
```

通过 `jest.spies` 监听函数是否被调用:

```js
test('clear timer when finish is called', () => {
  const spy = jest.spyOn(window, 'clearInterval')
  const wrapper = shallowMount(ProgressBar)
  wrapper.vm.start()
  wrapper.vm.finish()
  expect(spy).toHaveBeenCalled()
})
```

### 模拟全局属性

在挂在组件可以通过 `mocks` 选择模拟全局属性和方法 `Vue.prototype.xx`

```js
test('call $bar start on load', () => {
  const $bar = {
    start: () => {}
    finish: () => {}
  }
  shallowMount(ItemList, { mocks: { $bar }})
  expect($bar.start).toHaveBeenCalled()
})
```

### Jest Mock 函数

通过 `jest.fn` 创建一个模拟函数，从而可以断言方法是否被调用, [更多api文档](https://jestjs.io/docs/mock-function-api)

```js
test('call $bar finish when load is successful', async () => {
  const $bar = {
    start: () => {},
    finish: jest.fn()
  }
  shallowMount(ItemList, { mocks: { $bar }})
  await flushPromises()

  expect($bar.finish).toHaveBeenCalled()
})
```

### 模拟方法副作用

常用于模拟包含 http 请求方法，一般还是用 `jest.fn` 去拦截原来的请求数据方法，可以在api目录创建对应的mock文件 **(放在同级的__mocks__下，文件名必须一致)**

```js
// __mocks__/api.js
export const fetchListData = jest.fn(() => Promise.resolve([]))

```

```js
// ItemList.spec.js

jest.mock('../../api/api.js')

// ..
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
```

## 测试事件

### 测试原生事件

使用包装器上的 `trigger` 出发DOM元素事件

`Modal.vue`

```xml
<template>
  <div>
    <button @click="onClose"></button>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: ['onClose']
}
</script>
```

```js
test('call onClose when button is clicked', () => {
  const onClose = jest.fn()
  const wrapper = shallowMount(Modal, {
    propsData: {
      onClose
    }
  })
  wrapper.find('button').trigger('click')
  expect(onClose).toHaveBeenCalled()
})
```

### 测试vue事件

测试子组件，通过`trigger`触发事件， 通过包装器方法`emitted`判断事件是否触发

```js
test('emit close-modal when button is clicked', () => {
  const wrapper = shallowMount(Modal)
  wrapper.find('button').trigger('click')
  expect(wrapper.emitted('close-modal')).toHaveLength(1)
})
```

在父组件中， 通过 `vm.$emit` 触发子组件事件，从而进行断言, [组件代码](../src/views/Login.vue)

```js
test('hide Modal when Modal emit close-modal', async () => {
  const wrapper = shallowMount(Login)
  wrapper.findComponent(Modal).vm.$emit('close-modal')
  await wrapper.vm.$nextTick()
  expect(wrapper.findComponent(Modal).exists()).toBeFalsy()
})
```

### 测试表单输入

可以使用 `wrapper.setValue` 来设置文本框的值，并且改方法也会更新 `v-model` 绑定的状态

组件代码： [Form.vue](../src/components/Form.vue)

```js
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
```

向单选框和复选框必须要用 `setChecked` 来设置值