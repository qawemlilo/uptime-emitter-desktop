module.exports = {
  publicPath: './',

  pages: {
    index: {
      // entry for the page
      entry: 'app/src/client/main.js',
      // the source template
      template: 'public/index.html',
      // output as dist/index.html
      filename: 'index.html'
    }
  }
}
