// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;


console.log('Renderer loaded');
