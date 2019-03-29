"use strict";

const Monitor = require('ping-monitor');
const DB = require('./database');
const loggger = require('electron-log');


Monitor.prototype.save = function (res, oldState) {

  const self = this;

  let state = Object.assign(self.getState(), oldState || {});

  let opts = {
    response: res || {},
    state: state
  };

  if (!self.id && !state.id) {
    return DB.monitors.create(opts)
    .then(function (dbMonitor) {

      self.id = dbMonitor._id;

      return self;
    })
    .catch(function (error) {
      loggger.error(error);
    });
  }
  else {
    return DB.monitors.update(self.id || state.id, opts)
    .then(function () {
      return self;
    })
    .catch(function (error) {
      loggger.error(error);
    });
  }
};


Monitor.prototype.remove = function () {
  return DB.monitors.remove(this.id)
  .then(function () {
    return true;
  })
  .catch(function (error) {
    loggger.error(error);
  });
};




module.exports = Monitor;
