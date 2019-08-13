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
# Note that this should include a slash at the end
BASE_URL=/liwo/ npm run build

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

## Semantic releases
If you specify fixes and features in your commit messages a new [semantic release](https://github.com/semantic-release/semantic-release) will be created, after a merge with master.

## Deployment

Deployment is done through travis based on the gh-pages branch. See the [test server](http://deltares.github.io/liwo-static).
A version per branch is available through [netlify](https://liwo-static.netlify.com)

## Changing the default servers
If you want to change the servers that are used you can adapt the `public/config/webconfig.json` file, this replaces the old `src/webconfig.js`. This file is not minified during build and can be adapted after deployment. This can be done by for example puppet scripts. Note that each release can add or remove servers from the file so the best approach is to alter the file rather than to overwrite it (think `awk` or `file_line` in puppet).  Note that the `LEGEND_URL` should refer to the same server as the `STATIC_GEOSERVER_URL`.

## Deploy under a different url
If you want to deploy under a different url you can use the environment variable `BASE_URL`, for example by building `BASE_URL=/liwo npm run build`. That is also the default build. You can change the default build in .travis.yml.

## Sig review
Create a release with `npm run release` and then run `./sig-deploy.sh` to download the latest zip file to the format liwo-static-yyyymmdd.zip. Upload that file to sig.
