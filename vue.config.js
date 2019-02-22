module.exports = {
  publicPath: './',

  pluginOptions: {
    electronBuilder: {
      // List native deps here if they don't work
      externals: ['electron','fs'],
      // If you are using Yarn Workspaces, you may have multiple node_modules folders
      // List them all here so that VCP Electron Builder can find them
      nodeModulesPath: ['./node_modules']
    }
  },

  pages: {
    index: {
      // entry for the page
      entry: 'src/client/main.js',
      // the source template
      template: 'public/index.html',
      // output as dist/index.html
      filename: 'index.html',
    }
  }
}
