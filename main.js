"use strict";

// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, shell} = require('electron');
const config = require('./config');
const server = require('./src/server');
const crashReporter = require('./crash-reporter');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;


function createWindow () {

  let url;
  let showWindow;

  if (process.env.NODE_ENV === 'DEV') {
    url = 'http://localhost:8080/';
    showWindow = true;
  } else {
    url = `${process.__static}/dist/index.html`;
    showWindow = false;
  }

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    acceptFirstMouse: true,
    center: true,
    fullscreenable: false,
    resizable: false,
    show: showWindow,
    autoHideMenuBar: true,
    backgroundColor: '#303030'
  })

  // and load the index.html of the app.
  mainWindow.loadURL(url);

  if (process.env.NODE_ENV === 'DEV') {
    // Open the DevTools.
    mainWindow.webContents.openDevTools()
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  if (!showWindow) {
    mainWindow.once('ready-to-show', () => {
      mainWindow.show()
    });
  }

  server.createServer();

  loadMainMenu();
  
}



app.on('ready', createWindow);


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});


app.once('will-finish-launching', function () {
  crashReporter.init();
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
