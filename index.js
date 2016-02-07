'use strict';

const Promise = require('pinkie-promise');
const loading = require('loading-indicator');
const got = require('got');
const logUpdate = require('log-update');
const sexagesimal = require('sexagesimal');
const headers = {
  'user-agent': 'https://github.com/rafaelrinaldi/whereami'
};

const formatToDefault = data => `${data.latitude},${data.longitude}`;

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

const formatToHuman = data => {
  if (!data.region_name || !data.region_name.trim().length) {
    return Promise.reject(new Error('unable to retrieve region'));
  }

  return `${data.region_name}`;
};

const formatOutput = (data, options) => {
  if (options.raw) {
    return JSON.stringify(data);
  }

  if (options.format === 'sexagesimal') {
    return formatToSexagesimal(data);
  } else if (options.format === 'json') {
    return formatToJson(data);
  } else if (options.format === 'human') {
    return formatToHuman(data);
  }

  return formatToDefault(data);
};

const whereami = options => {
  const interval = loading.start();

  return got('freegeoip.net/json/', {headers})
    .then(response => {
      return formatOutput(JSON.parse(response.body), options);
    })
    // Actually logs the output
    .then((response => {
      loading.stop(interval);
      console.log(response);
      return response;
    }))
    .catch(error => {
      loading.stop(interval);
      // The standard for error messages is lowercase, minor tweak to improve output
      const message = error.message.replace(/^\w/, string => string.toUpperCase());
      console.log(message);
      return error;
    });
};

module.exports = whereami;
