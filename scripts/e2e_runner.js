const app = require('../server')
const spawn = require('cross-spawn')

const PORT = process.env.PORT || 8080

const server = app.listen(PORT, () => {
  const opts = [
    '--config',
    'e2e/nightwatch.conf.js',
    '--env',
    'chrome'
  ]
  const runner = spawn('./node_modules/.bin/nightwatch', opts, { stdio: 'inherit' })

  runner.on('exit', code => {
    server.close()
    process.exit(code)
  })

  runner.on('error', err => {
    server.close()
    throw err
  })
})