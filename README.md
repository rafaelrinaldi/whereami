# whereami [![Build Status](https://semaphoreci.com/api/v1/projects/a5332a07-61aa-49f9-90e6-49844c5e2231/665179/badge.svg)](https://semaphoreci.com/rafaelrinaldi/whereami)

> Get your geolocation information using [freegeoip.net](http://freegeoip.net) from the CLI

## Install

```sh
$ npm install -g @rafaelrinaldi/whereami
```

## Usage

```sh
Usage: whereami [OPTIONS]

  Get your geolocation information using freegeoip.net from the CLI

Example:
  $ whereami
  -23.4733,-46.6658

  $ whereami --f human
  San Francisco, CA, United States

Options:
  -v --version              Display current software version
  -h --help                 Display help and usage details
  -f --format               Output format (either human, json or sexagesimal)
  -r --raw                  Output raw data from freegeoip.net
```

## License

MIT © [Rafael Rinaldi](rinaldi.io)
