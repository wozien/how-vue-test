/**
 * @see https://nightwatchjs.org/api/
 */
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