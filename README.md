Vue 项目中的常用测试方法和模式，包括单元测试、快照测试和端到端测试

## 安装

```bash
yarn add jest vue-jest babel-jest babel-core@bridge @vue/test-utils -D
```

## 配置

`package.json` 增加 `jest` 配置， 或者在根目录新建 `jest.config.js` 配置文件

```JSON
"jest": {
  "transform": {
    "^.+\\.js$": "babel-jest",
    "^.+\\.vue$": "vue-jest"
  },
  "testEnvironment": "jsdom"
}
```

修改 `eslint` 配置

```json
"env": {
  "jest": true  // 不然test会校验报错
}
```

## 单元测试 (Unit Test)

在vue项目中，不局限于测试函数功能，测试一个组件的功能也称为单元测试

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