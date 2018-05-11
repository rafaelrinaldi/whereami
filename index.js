'use strict';

const Promise = require('pinkie-promise');
const loading = require('loading-indicator');
const got = require('got');
const sexagesimal = require('sexagesimal');
const headers = {
  'user-agent': 'https://github.com/rafaelrinaldi/whereami'
};

const formatToDefault = data => `${data.loc}`;

const formatToJson = data => {
  var latlong = data.loc.split(',');
  return JSON.stringify({
    latitude: latlong[0],
    longitude: latlong[1]
  });
};

const formatToSexagesimal = data => {
  var latlong = data.loc.split(',');
  const latitude = sexagesimal.format(latlong[0], 'lat');
  const longitude = sexagesimal.format(latlong[1], 'lon');

  return `${latitude},${longitude}`;
};

const formatToHuman = data => {
  if (!data.country && !data.region && !data.city) {
    return Promise.reject(new Error('unable to retrieve region'));
  }

  return [data.city, data.region, data.country]
    .filter(field => field && field.trim().length)
    .map(output => output)
    .join(', ');
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

  return got('ipinfo.io/json', {headers})
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
