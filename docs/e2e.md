端到端测试是通过自动运行浏览器与正在运行的应用程序交互来检查应用程序的行为是否正确

## 安装和配置

安装依赖包

```bash
yarn add nightwatch selenium-server chromedriver -D
```

配置文件 `nightwatch.conf.js`

```js
module.exports = {
  src_folders: ['e2e/specs'], 
  output_folder: 'e2e/reports', 

  selenium: {
    start_process: true,
    server_path: require('selenium-server').path, 
    host: '127.0.0.1',
    port: 4444, 
    cli_args: {
      'WebDriver.chrome.driver': require('chromedriver').path
    }
  },

  test_settings: {
    chrome: { 
      desiredCapabilities: {
        browserName: 'chrome'
      }
    }

  }
}
```

添加测试命令

```json
"test:e2e": "nightwatch --config e2e/nightwatch.conf.js --env chrome"
```

> `selenium-server` 依赖 java 环境，需要提前安装 jdk 7.0+

## 原理

要运行端到端测试， 需要启动 `Selenium Server` 来监听传入的 HTTP 请求，然后调用 `WebDriver` 来控制浏览器。但是直接发请求很麻烦， 所以 `Nightwatch` 提供了JS接口来调用 `Selenium`

## 测试

### 测试路由
通过 `click` 点击网页元素，然后断言url是否跳转正确

```js
module.exports = {
  // 点击列表项进入列表详情
  'takes user to the item page': function(browser) {
    browser
      .url('http://localhost:8080')
      .waitForElementVisible('.news-item', 15000)
      .click('.comments-link > a')
      .assert.urlContains('/item')
      .waitForElementVisible('.item-view', 15000)
      .end()
  },
}
```

### 测试动态数据

主要通过获取并比较跳转前后文本来进行断言

```js
module.exports = {
  // 切换分页 检查列表内容是否发生变化
  'paginates items correctly': function(browser) {
    let originListText

    browser
      .url('http://localhost:8080')
      .waitForElementVisible('.news-item', 15000)
      .getText('.item-list', result => {
        originListText = result.value
      })
      .click('.item-list-nav a:nth-of-type(2)')
      .waitForElementNotVisible('.progress', 15000)
      .perform(() => {
        browser.expect.element('.item-list').text.to.not.equal(originListText)
      })
  }
}
```

[更多 Nightwatch API](https://nightwatchjs.org/api/)