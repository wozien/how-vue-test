/* eslint-disable no-console */

const path = require('path')
const express = require('express')
const { createBundleRenderer } = require('vue-server-renderer')

const app = express()
const resolve = (dir) => path.resolve(__dirname, dir)
const templatePath = resolve('./index.template.html')
const bundle = require('./dist/vue-ssr-server-bundle.json')
const template = require('fs').readFileSync(templatePath, 'utf-8')
const clientManifest = require('./dist/vue-ssr-client-manifest.json')

const renderer = createBundleRenderer(bundle, {
  runInNewContext: false,
  template,
  clientManifest
})

app.use(express.static('./dist'))

app.get('*', (req, res) => {
  const context = {
    title: 'Vue HN SSR',
    url: req.url
  }

  renderer.renderToString(context, (err, html) => {
    if(err) {
      if (err.code === 404) {
        res.status(404).end('Page not found');
      } else {
        res.status(500).end('Internal Server Error');
        console.error(err);
      }
    } else {
      res.end(html);
    }
  })
})

const port = process.env.PORT || 8080
app.listen(port, () => console.log(`Server listening at ${port}`))