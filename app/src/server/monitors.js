"use strict";

const Monitor = require('./Monitor');
const DB = require('./database');
const loggger = require('electron-log');
const settings = require('electron-settings');
const notifier = require('node-notifier');
const path = require('path');


let Monitors = [];
let initCalled = false;


function createMonitor (opts, oldState) {

  const newMonitor = new Monitor(opts, oldState);

  newMonitor.on('up', function (res, state) {
    process.nextTick(() => {
      loggger.info(`${state.website || state.address} is up`);

      this.save(res, state);
    });
  });


  newMonitor.on('down', function (res, state) {
    process.nextTick(() => {
      loggger.info(`${state.website || state.address} is down`);

      this.save(res, state);

      if (settings.get('settings.notifications')) {
        notifier.notify({
          icon: path.resolve(__dirname, '..', '..', 'public/icons/png/128x128.png'),
          title: state.title + ' is down',
          message: res.responseMessage,
          timeout: 20,
          wait: true
        });
      }
    });
  });


  newMonitor.on('error', function (error, res, state) {
    process.nextTick(() => {
      loggger.error(error);
      this.save(res, state);

      if (settings.get('settings.notifications')) {
        notifier.notify({
          icon: path.resolve(__dirname, '..', '..', 'public/icons/png/128x128.png'),
          title: state.title + ' is down',
          message: error.message,
          sound: !!settings.get('settings.sound'),
          timeout: 20,
          wait: true
        });
      }
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


module.exports.update = function (id, props) {

  let monitor = Monitors.find(monitor => monitor.id === id);

  monitor.pause();
  monitor.setProperties(props);
  monitor.unpause();

  return monitor;
};


module.exports.remove = async (monitorId) => {
  let monitor = Monitors.find(monitor => monitor.id === monitorId);

  monitor.stop();

  await monitor.remove();

  Monitors = Monitors.filter((monitor) => monitor.id != monitorId);

  loggger.info(`Monitor removed`);
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
    return monitor.paused;
  })
  .forEach(function (monitor) {
    monitor.unpause();
  });
};



module.exports.getRequests = function (monitorId, query) {
  return DB.requests.get(Object.assign({monitorId: monitorId}, query || {}));
};


module.exports.init = async () => {

  if (initCalled) return false;

  initCalled = true;

  let all = await DB.monitors.getAll();

  Monitors = [];

  if (all.length) {
    all.forEach(function (monitor) {
      let state = Object.assign(monitor.state, monitor.response, {id: monitor._id });

      let newMonitor = createMonitor({}, state);

      Monitors.push(newMonitor);
    });
  }
};
