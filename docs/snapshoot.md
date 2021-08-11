快照测试简单的说就是获取代码的快照(序列化结果)，并将其和以前保存的快照进行对比，如果新的快照与前一个不匹配，则测试就会失败。 `jest` 中的快照测试会对比序列化值。

## 简单例子

可以使用 `toMatchSnapShot` 添加和匹配快照：

```js
expect('value').toMatchSnapShot()
```

也可以把 DOM 节点传递给快照：

```js
expect(document.querySelector('div')).toMatchSnapShot()
```

## 测试静态组件

静态组件是指输出的内容永远不变的组件，比如

```xml
<template>
  <transition>
    <svg class="spinner" width="44px" height="44px" viewBox="0 0 44 44">
      <circle class="path" fill="none" stroke-width="4" stroke-linecap="round" cx="22" cy="22" r="20"></circle>
    </svg>
  </transition>
</template>
```

添加快照：

```js
// Spinner.spec.js
describe('Spinner', () => {
  test('render correctly', () => {
    expect(shallowMount(Spinner).element).toMatchSnapshot()
  })
})
```

生成的快照 `Spinner.spec.js.snap`

```js
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`Spinner render correctly 1`] = `
<transition-stub>
  <svg
    class="spinner"
    height="44px"
    viewBox="0 0 44 44"
    width="44px"
  >
    <circle
      class="path"
      cx="22"
      cy="22"
      fill="none"
      r="20"
      stroke-linecap="round"
      stroke-width="4"
    />
  </svg>
</transition-stub>
`;
```

## 测试动态组件

对于有状态的逻辑的组件，可以模拟 `props` 变量或者输出的可变因素， 比如 `Date.now` 动态显示时间等：

```js
// Item.spec.js
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
```

## 经验总结

对于一个组件， 可以先编写单元测试来覆盖核心功能。在进行单元测试后，在浏览器手动测试样式，最后再为它添加一个快照测试，锁定一个输出的版本。在后续的代码重构中，就可以根据快照测试判断你的组件是否正确输出。如果真的需要更改就通过命令行参数`-u` 进行覆盖。