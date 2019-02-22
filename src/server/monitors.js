"use strict";

const Monitor = require('./Monitor');
const Database = require('./database');
const loggger = require('electron-log');

let Monitors = [];
let initCalled = false;


function createMonitor (opts, oldState) {

  const newMonitor = new Monitor(opts, oldState);

  newMonitor.on('up', function (res, state) {
    process.nextTick(() => {
      loggger.info(`${state.website || state.address} is up`);

      this.save(res, state)
    });
  });


  newMonitor.on('down', function (res, state) {
    process.nextTick(() => {
      loggger.info(`${state.website || state.address} is down`);

      this.save(res, state);
    });
  });


  newMonitor.on('error', function (error, res, state) {
    process.nextTick(() => {
      loggger.error(error);
      this.save(res, state);
    });
  });


  newMonitor.on('stop', function (res, state) {
    process.nextTick(() => {
      this.active = false;
      state.active = false;

      this.save(res, state);

      loggger.info(state.title + ' monitor stopped');
    });
  });

  return newMonitor
}


function removeOne (index) {
  delete Monitors[index];

  Monitors =  Monitors.filter((monitor) => monitor);
}


module.exports.create = function (opts) {
  let existingMonitor = Monitors.find(function (monitor) {
      return monitor.website && opts.website && monitor.website === opts.website || monitor.address && opts.address && monitor.address === opts.address;
  });

  let newMonitor = existingMonitor ? existingMonitor : createMonitor(opts);

  return newMonitor.save(newMonitor.getState(), opts)
  .then(function (newMonitor) {
    Monitors.push(newMonitor);

    return newMonitor;
  })
  .catch(function (error) {
    loggger.info(error);
  });
};


module.exports.getAll = function () {
  return Monitors.map(function (monitor) {
    return monitor.getState();
  });
};


module.exports.getOne = function (id) {
  let monitor = Monitors.find(monitor => monitor && monitor.id === id);

  return monitor;
};


module.exports.stop = function (id) {
  let monitor = Monitors.find(monitor => monitor.id === id);

  monitor.stop();

  return monitor;
};

/*
module.exports.pause = function (id) {
  let monitor = Monitors.find(monitor => monitor.id === id);

  Monitors.forEach(function (monitor) {
    monitor.stop();
  });
};*/


module.exports.remove = function (monitorId) {
  Monitors.forEach(async function (monitor, index) {
    if (monitor.id === monitorId) {
      loggger.info('removing ', monitor.title)
      await monitor.remove();
      removeOne(index)
    }
  });
};


module.exports.pause = function () {
  Monitors.filter(function (monitor) {
    return monitor.handle;
  })
  .forEach(function (monitor) {
    monitor.pause();
  });
};


module.exports.restartAll = function () {
  Monitors.filter(function (monitor) {
    return monitor.onpause;
  })
  .forEach(function (monitor) {
    monitor.unpause();
  });
};


module.exports.init = async () => {

  if (initCalled) return false;

  initCalled = true;

  let all = await Database.getAll();

  Monitors = [];

  if (all.length) {
    all.forEach(function (monitor) {
      let state = Object.assign(monitor.state, monitor.response, {id: monitor._id });

      let newMonitor = createMonitor({}, state);

      Monitors.push(newMonitor);
    });
  }
};
