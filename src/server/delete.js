"use strict";


const config = require('../../config');
const path = require('path');
const fs = require('fs');

const files = ['monitors.db'];

files.forEach(function (file) {
  let fpath = path.join(config.STORAGE_ROOT, file);

   fs.unlinkSync(fpath)
});
