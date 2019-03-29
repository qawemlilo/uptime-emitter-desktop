"use strict";


const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);

function translateTime(timeAgo) {
  let timeArray = timeAgo.split(" ");

  let label = ""

  if (timeArray[1].indexOf('minute') > -1) {
    if (parseInt(timeArray[0], 10) < 6) {
      label = "5m";
    }

    else if (parseInt(timeArray[0], 10) < 11) {
      label = "10m";
    }

    else if (parseInt(timeArray[0], 10) < 16) {
      label = "15m";
    }

    else if (parseInt(timeArray[0], 10) < 21) {
      label = "20m";
    }

    else if (parseInt(timeArray[0], 10) < 26) {
      label = "25m";
    }

    else if (parseInt(timeArray[0], 10) < 31) {
      label = "30m";
    }

    else if (parseInt(timeArray[0], 10) < 36) {
      label = "35m";
    }

    else if (parseInt(timeArray[0], 10) < 41) {
      label = "40m";
    }

    else if (parseInt(timeArray[0], 10) < 46) {
      label = "45m";
    }

    else if (parseInt(timeArray[0], 10) < 51) {
      label = "50m";
    }

    else if (parseInt(timeArray[0], 10) < 56) {
      label = "55m";
    }
  }

  else if (timeArray[1].indexOf('hour') > -1) {
    if (timeArray[0] == 'an') {
      timeArray[0] = 1;
    }

    label = timeArray[0] + "h";
  }

  else if (timeArray[1] == 'day') {
    if (timeArray[0] == 'a') {
      timeArray[0] = 1;
    }

    label = timeArray[0] + "d";
  }

  return label;
}



module.exports.groupCollection = function (collection) {
  let results = {};

  collection.forEach(function (request) {
    let ago = dayjs(request.createdAt).from(dayjs());
    let label = translateTime(ago);

    if (!results[label]) {
      results[label] = [];
    }

    results[label].push(request.responseTime);
  });

  let stats = {};

  for (let key in results) {
    if(key && results[key]) {
      stats[key] = results[key].reduce(function (accumilator, item) {
        return accumilator + item;
      }) / results[key].length;
    }
  }


  return stats;
};
