'use strict';

var got = require('got');
var logUpdate = require('log-update');
var sexagesimal = require('sexagesimal');
var headers = {
  'user-agent': 'https://github.com/rafaelrinaldi/whereami'
};

function whereami(options) {
  var interval = loading();

  return got('freegeoip.net/json/', {headers: headers}).then(function(response) {
    loaded(interval);
    handleResponseBody(JSON.parse(response.body), options);
  });
}

function loading() {
  var frames = ['-', '\\', '|', '/'];
  var frame = 0;

  return setInterval(function() {
    logUpdate(frames[frame = ++frame % frames.length]);
  }, 100);
}

function loaded(interval) {
  logUpdate.clear();
  clearInterval(interval);
}

function handleResponseBody(body, options) {
  var output = '';

  if (options.raw) {
    console.log(JSON.stringify(body));
    return;
  }

  if (options.format === 'sexagesimal') {
    output = formatToSexagesimal(body);
  } else if (options.format === 'json') {
    output = formatToJson(body);
  } else {
    output = formatOutput(body);
  }

  console.log(output);
}

function formatOutput(data) {
  return data.latitude + ',' + data.longitude;
}

function formatToJson(data) {
  return {latitude: data.latitude, longitude: data.longitude};
}

function formatToSexagesimal(data) {
  var latitude = sexagesimal.format(data.latitude, 'lat');
  var longitude = sexagesimal.format(data.longitude, 'lon');

  return latitude + ',' + longitude;
}

module.exports = whereami;
