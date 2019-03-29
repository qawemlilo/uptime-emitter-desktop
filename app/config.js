"use strict";

const path = require('path');
const packageJSON = require('./package.json');
const APP_VERSION = packageJSON.version;

module.exports = {
  STORAGE_ROOT: getRootDir(),


  APP_VERSION:  APP_VERSION,
  APP_NAME:  packageJSON.productName,
  PRODUCT_NAME:  packageJSON.productName,
  APP_COPYRIGHT: 'Copyright © 2019 Raging Flame Solutions',

  IS_PRODUCTION: isProduction(),

  ANNOUNCEMENT_URL: '',
  AUTO_UPDATE_URL: '',

  APP_FILE_ICON: '',
  APP_ICON: '',

  GITHUB_URL: 'https://github.com/qawemlilo/uptime-emitter',
  GITHUB_URL_ISSUES: 'https://github.com/qawemlilo/uptime-emitter/issues',
  HOME_PAGE_URL: 'https://github.com/qawemlilo/uptime-emitter',
  UPDATES_URL: 'https://github.com/qawemlilo/uptime-emitter/releases',
  UPDATES_API: 'https://video-download.herokuapp.com/updates/latest',
  CRASH_REPORT_URL: 'https://video-download.herokuapp.com/crash-report',

  SERVER_PORT: 3160
};



function getRootDir() {
  let home = (process.platform === 'win32') ? 'USERPROFILE' : 'HOME';
  let rootDir = process.env[home];
  let homeDir = '';

  if (isProduction()) {
    homeDir = '.uptimeemitter';
  }
  else {
    homeDir = '.uptimeemitter';
  }

  return path.join(rootDir, homeDir);
}



function isProduction () {
  if (!process.versions.electron) {
    // Node.js process
    return false
  }
  if (process.platform === 'darwin') {
    return !/\/Electron\.app\//.test(process.execPath)
  }
  if (process.platform === 'win32') {
    return !/\\electron\.exe$/.test(process.execPath)
  }
  if (process.platform === 'linux') {
    return !/\/electron$/.test(process.execPath)
  }
}
