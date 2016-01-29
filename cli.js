'use strict';

const whereami = require('./');
const minimist = require('minimist');
const version = require('./package.json').version;
const multiline = require('multiline');
const defaults = {
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

/* eslint-disable */
const help = multiline(function() {/*

Usage: whereami [OPTIONS]

  Get your geolocation information using freegeoip.net from the CLI

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

const logError = error => {
  const message = typeof error === 'string' ? error : error.message;

  exports.exitCode = 1;

  exports.stderr.write(`${message}\n`);
};

const run = argv => whereami(argv).catch(logError);

// Must be ≠ 0 if any errors occur during execution
exports.exitCode = 0;

// Allow mocking the stdout/stderr
exports.stdout = process.stdout;
exports.stderr = process.stderr;

exports.parse = options => minimist(options, defaults);

exports.run = argv => {
  // Reset status code at each run
  exports.exitCode = 0;

  if (argv.help) {
    exports.stderr.write(help);
    return;
  }

  if (argv.version) {
    exports.stderr.write(`whereami v${version}\n`);
    return;
  }

  if (argv.format && 'json sexagesimal'.split(/\s/).indexOf(argv.format) < 0) {
    exports.stderr.write(`Format ${argv.format} is not supported`);
    return;
  }

  run(argv);
};
