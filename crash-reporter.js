"use strict";

const config = require('./config');
const electron = require('electron');


module.exports.init = function () {
  electron.crashReporter.start({
    companyName: config.APP_NAME,
    productName: config.APP_NAME,
    submitURL: config.CRASH_REPORT_URL,
    uploadToServer: true
  });
};
