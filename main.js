"use strict";

// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, shell} = require('electron');
const fs = require('fs')
const config = require('./config');
const server = require('./server');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;


function createRootDir() {
  if (!fs.existsSync(config.STORAGE_ROOT)) {
      fs.mkdirSync(config.STORAGE_ROOT);
  }
  if (!fs.existsSync(config.IMAGES_PATH)) {
      fs.mkdirSync(config.IMAGES_PATH);
  }
  if (!fs.existsSync(config.VIDEOS_PATH)) {
      fs.mkdirSync(config.VIDEOS_PATH);
  }
}

function createWindow () {

  let url;

  if (process.env.NODE_ENV === 'DEV') {
    url = 'http://localhost:8080/';
  } else {
    url = `file://${process.cwd()}/dist/index.html`
  }

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    acceptFirstMouse: true,
    center: true,
    fullscreenable: false,
    resizable: false,
    show: true,
    autoHideMenuBar: true
  })

  // and load the index.html of the app.
  mainWindow.loadURL(url);

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  server.createServer();

  loadMainMenu();
}



app.on('ready', createWindow);


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
});


function loadMainMenu() {
  let template = [{
    label: config.APP_NAME,
    submenu: [
      { label: "About Application", click: () => { shell.openExternal(config.HOME_PAGE_URL) } },
      { label: "Support", click: () => { shell.openExternal(config.GITHUB_URL_ISSUES) } },
      { label: `Check for updates (current: v${config.APP_VERSION})`, click: () => { shell.openExternal(config.UPDATES_URL) } },
      { type: "separator" },
      { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
    ]
  }];

  if (process.platform === 'darwin') {
    template = [{
        label: config.APP_NAME,
        submenu: [
            { label: "About " +  config.APP_NAME, click: () => { shell.openExternal(config.HOME_PAGE_URL) } },
            { label: "Support", click: () => { shell.openExternal(config.GITHUB_URL_ISSUES) } },
            { label: `Check for updates (current: v${config.APP_VERSION})`, click: () => { shell.openExternal(config.UPDATES_URL) } },
            { type: "separator" },
            { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
        ]}, {
        label: "Edit",
        submenu: [
            { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
            { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
            { type: "separator" },
            { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
            { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
            { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
            { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
        ]}
    ];
  }


  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
