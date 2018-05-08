# liwo-static
Static frontend for LIWO (https://www.basisinformatie-overstromingen.nl/liwo/)

# Info
[![Build Status](https://travis-ci.org/Deltares/liwo-static.svg?branch=master)](https://travis-ci.org/Deltares/liwo-static)

## Build Setup

See the [docs](https://github.com/vuejs/vue-cli/blob/dev/docs/README.md) of the build environment for further details.

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run serve

# run unit tests
npm run test

# run e2e tests
npm run e2e

# security audit
npm audit

# outdated check
npm outdated

# build using a different url
BASE_URL=/liwo-static npm run build

# deploy to github (note that travis does this automatically)
gh-pages -d dist

# build for production with minification
npm run build

# deploy to surge (for comparisons)
surge dist liwo-test.surge.sh
```
## API

The api that is used to get map information can be found at [swagger](https://app.swaggerhub.com/apis/openearth/basisinformatie-overstromingen.nl).

## Deployment

Deployment is done through travis based on the gh-pages branch. See the [test server](http://deltares.github.io/liwo-static)
