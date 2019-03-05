"use strict";

const Monitor = require('ping-monitor');
const DB = require('./database');
const loggger = require('electron-log');

// add pause prop
Monitor.prototype.onpause = false;

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


Monitor.prototype.pause = function () {
  if (this.handle) {
    clearInterval(this.handle);
    this.handle = null;
    this.onpause = true;

    loggger.info('%s has paused', this.title || this.host);
  }
};


Monitor.prototype.unpause = function () {
  if (this.website && this.active) {
    this.start('http');
    this.onpause = false;
    loggger.info('%s has unpaused', this.title || this.host);
  }
  else if (this.address && this.active) {
    this.start('tcp');
    this.onpause = false;
    loggger.info('%s has unpaused', this.title || this.host);
  }
};




module.exports = Monitor;
