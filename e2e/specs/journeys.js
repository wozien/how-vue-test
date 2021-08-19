
module.exports = {
  'sanity test': function(browser) {
    browser
      .url('http://localhost:8080')
      .waitForElementVisible('.item-list', 2000)
      .end()
  }
}