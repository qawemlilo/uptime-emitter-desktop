"use strict";

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
const loggger = require('electron-log');
const monitors = require('./monitors')
const config = require('../../config')
const utils = require('./utils')
const app = express()
const port = config.SERVER_PORT;
let runningServer = null;

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/monitors', (req, res) => {
  res.json({
    monitors: monitors.getAll()
  });
});

app.get('/monitors/:monitorId', (req, res) => {
  let monitor = monitors.getOne(req.params.monitorId);

  if (monitor) {
    res.json({
      monitor: monitor.getState()
    });
  }
  else {
    res.status(500).json({
      message: 'Monitor not found'
    });
  }

});

app.get('/monitors/:monitorId/toggle', (req, res) => {
  let monitor = monitors.getOne(req.params.monitorId);

  if (monitor) {
    if (monitor.active) {
      monitor.stop();

      res.json({
        monitor: monitor.getState()
      });
    }
    else {
      monitor.restart();

      res.json({
        monitor: monitor.getState()
      });
    }
  }
  else {
    res.status(500).json({
      message: 'Monitor not found'
    });
  }
});


app.get('/monitors/:monitorId/remove', (req, res) => {
  let monitor = monitors.getOne(req.params.monitorId);

  if (monitor) {
    monitors.remove(req.params.monitorId);
  }

  res.json({
    success: true
  });
});

app.post('/monitors', (req, res) => {

  monitors.create({
    title: req.body.title,
    website: req.body.website,
    address: req.body.address,
    interval: req.body.interval,
    port: req.body.port
  })
  .then(function (newMonitor) {
    res.json({
      monitor: newMonitor.getState()
    });
  })
  .catch(function () {
    res.status(500).json({
      message: 'Monitor not saved'
    });
  });
});


app.get('/pause', (req, res) => {
  monitors.pause();
  res.json({
    message: 'Monitors paused'
  });
});


app.get('/restart', (req, res) => {
  monitors.restartAll();

  res.json({
    message: 'Monitors restarted'
  });
});

app.get('/requests/:monitorId', async (req, res) => {
  try {
    let requests = await monitors.getRequests(req.params.monitorId, req.query);
    let stats = utils.groupCollection(requests)

    res.json({
      requests: requests,
      stats: stats
    });
  }
  catch (e) {
    res.status(500).json({
      message: e.message
    });
  }
});




module.exports.createServer = function () {
  if (runningServer) {
    return false;
  }
  else {
    /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
    app.listen(port, () => loggger.info(`Example app listening on port ${port}!`));

    runningServer = app;

    monitors.init();

    return app;
  }
};
