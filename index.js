const got = require('got')
const sexagesimal = require('@mapbox/sexagesimal')
const headers = {
  'user-agent': 'https://github.com/rafaelrinaldi/whereami'
}

const formatToJson = ({ latitude, longitude }) =>
  JSON.stringify({
    latitude,
    longitude
  })

const formatToSexagesimal = data => {
  const latitude = sexagesimal.format(data.latitude, 'lat')
  const longitude = sexagesimal.format(data.longitude, 'lon')

  return `${latitude},${longitude}`
}

const formatToHuman = data => {
  if (!data.country_name && !data.region_name && !data.city) { throw new Error('Unable to retrieve region') }

  return [data.city, data.region_name, data.country_name]
    .filter(Boolean)
    .join(', ')
}

const formatOutput = (data, options) => {
  if (options.raw) return JSON.stringify(data, null, 2)

  const mapFormatToFormatter = {
    sexagesimal: formatToSexagesimal,
    json: formatToJson,
    human: formatToHuman
  }

  return mapFormatToFormatter[options.format](data)
}

const whereami = ({ ipOrHostname = '', ...options }) =>
  got(`freegeoip.app/json/${ipOrHostname}`, { headers }).then(({ body }) =>
    formatOutput(JSON.parse(body), options)
  )

module.exports = whereami
