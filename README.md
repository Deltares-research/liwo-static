# liwo-static
Static frontend for LIWO (https://www.basisinformatie-overstromingen.nl/liwo/)

# Info
[![Build Status](https://travis-ci.org/Deltares/liwo-static.svg?branch=master)](https://travis-ci.org/Deltares/liwo-static)

[![BCH compliance](https://bettercodehub.com/edge/badge/Deltares/liwo-static?branch=master)](https://bettercodehub.com/)

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

# update the version number (displayed in the about page)
npm version patch -m "Upgrade to %s for because ..."

# outdated check
npm outdated

# build using a different url
BASE_URL=/liwo npm run build

# deploy to github (note that travis does this automatically)
gh-pages -d dist

# build for production with minification
npm run build

# deploy to surge (for comparisons)
surge dist liwo-test.surge.sh

# create a release
npm run release

# create a sig review file after a release (requires jq and wget)
./sig-deploy.sh
# follow the instruction to upload the file


```
## API

The api that is used to get map information can be found at [swagger](https://app.swaggerhub.com/apis/openearth/basisinformatie-overstromingen.nl).

## Deployment

Deployment is done through travis based on the gh-pages branch. See the [test server](http://deltares.github.io/liwo-static)

## Sig review
Create a release with `npm run release` and then run `./sig-deploy.sh` to download the latest zip file to the format liwo-static-yyyymmdd.zip. Upload that file to sig.
