#!/usr/bin/env node

const whereami = require('./')
const minimist = require('minimist')
const Loading = require('loading-indicator')
const options = {
  boolean: ['help', 'version', 'raw'],
  alias: {
    h: 'help',
    v: 'version',
    f: 'format',
    r: 'raw',
    n: 'noanim'
  },
  default: {
    raw: false,
    format: 'sexagesimal',
    noanim: false
  }
}

const argv = minimist(process.argv.slice(2), options)
const [ipOrHostname] = argv._

const help = `
Usage: whereami [OPTIONS]

  Get your geolocation information using freegeoip.net from the CLI

Example:
  $ whereami
  -23.4733,-46.6658

  $ whereami -f human
  San Francisco, CA, United States

  $ whereami 2.151.255.255 -f human
  Stabekk, Akershus, Norway

Options:
  -v --version              Display current software version
  -h --help                 Display help and usage details
  -f --format               Output format (either human, json or sexagesimal)
  -r --raw                  Output raw data from freegeoip.net
`

function exitWithSuccess (message) {
  process.stdout.write(`${message}\n`)
  process.exit(0)
}

function exitWithError (message, code = 1) {
  process.stderr.write(`${message}\n`)
  process.exit(code)
}

if (argv.help) exitWithSuccess(help)
if (argv.version) exitWithSuccess(require('./package.json').version)

const isValidFormat = ['human', 'json', 'sexagesimal'].includes(argv.format)

if (!isValidFormat) exitWithError(`Format "${argv.format}" is not supported`)

async function run () {
  const loading = argv.noanim ? null : Loading.start()

  try {
    const output = await whereami({ ...argv, ipOrHostname })
    if (loading) 
      Loading.stop(loading)
    exitWithSuccess(output)
  } catch (error) {
    if (loading)
      Loading.stop(loading)
    exitWithError(error.message)
  }
}

run()
