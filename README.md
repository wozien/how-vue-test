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
  "jest": true  
}
```

## 测试方法

- [单元测试](./docs/unit-test.md)

- [快照测试](./docs/snapshoot.md)

- [端到端测试](./docs/e2e.md)

- [Vuex 测试](./docs/vuex.md)

- [Router 测试](./docs/vue-router.md)