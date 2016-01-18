'use strict';

var whereami = require('./');
var minimist = require('minimist');
var multiline = require('multiline');
var defaults = {
  boolean: [
    'help',
    'version',
    'raw'
  ],
  alias: {
    h: 'help',
    v: 'version',
    f: 'format',
    r: 'raw'
  },
  default: {
    raw: false
  }
};
var version = require('./package.json').version;

/* eslint-disable */
var help = multiline(function() {/*

Usage: whereami [OPTIONS]

  Get geolocation information based on your host's IP address.

Example:
  $ whereami
  -23.4733,-46.6658

Options:
  -v --version              Display current software version.
  -h --help                 Display help and usage details.
  -f --format               Output format (either json or sexagesimal).
  -r --raw                  Output raw data from freegeoip.net.

*/});
/* eslint-enable */

// Must be ≠ 0 if any errors occur during execution
exports.exitCode = 0;

// Allow mocking the stdout/stderr
exports.stdout = process.stdout;
exports.stderr = process.stderr;

exports.parse = function(options) {
  return minimist(options, defaults);
};

exports.run = function(argv) {
  // Reset status code at each run
  exports.exitCode = 0;

  if (argv.help) {
    exports.stderr.write(help);
    return;
  }

  if (argv.version) {
    exports.stderr.write('whereami v' + version + '\n');
    return;
  }

  if (argv.format && 'json sexagesimal'.split(/\s/).indexOf(argv.format) < 0) {
    exports.stderr.write('format "' + argv.format + '" is not supported');
    return;
  }

  run(argv);
};

function run(argv) {
  whereami(argv).catch(logError);
}

function logError(error) {
  var message = typeof error === 'string' ? error : error.message;

  exports.exitCode = 1;

  exports.stderr.write(message + '\n');
}
