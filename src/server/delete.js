"use strict";


const config = require('../../config');
const path = require('path');
const fs = require('fs');

const files = ['monitors.db','requests.db'];

files.forEach(function (file) {
  try {
    let fpath = path.join(config.STORAGE_ROOT, file);

     fs.unlinkSync(fpath);

     console.log('db deleted ', file)
  } catch (e) {
    console.error(e);
  }
});
