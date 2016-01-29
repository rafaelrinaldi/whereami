'use strict';

const got = require('got');
const logUpdate = require('log-update');
const sexagesimal = require('sexagesimal');
const headers = {
  'user-agent': 'https://github.com/rafaelrinaldi/whereami'
};

const loading = () => {
  const frames = ['-', '\\', '|', '/'];
  let frame = 0;

  return setInterval(() => {
    logUpdate(frames[frame = ++frame % frames.length]);
  }, 100);
};

const loaded = interval => {
  logUpdate.clear();
  clearInterval(interval);
};

const formatOutput = data => `${data.latitude},${data.longitude}`;

const formatToJson = data => {
  return JSON.stringify({
    latitude: data.latitude,
    longitude: data.longitude
  });
};

const formatToSexagesimal = data => {
  const latitude = sexagesimal.format(data.latitude, 'lat');
  const longitude = sexagesimal.format(data.longitude, 'lon');

  return `${latitude},${longitude}`;
};

const handleResponseBody = (body, options) => {
  let output = '';

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
};

const whereami = options => {
  const interval = loading();

  return got('freegeoip.net/json/', {headers}).then(response => {
    loaded(interval);
    handleResponseBody(JSON.parse(response.body), options);
  });
};

module.exports = whereami;
