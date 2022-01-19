# liwo-static
Static frontend for LIWO ([basisinformatie-overstromingen.nl](https://basisinformatie-overstromingen.nl))

# Info
[![Build status](https://github.com/Deltares/liwo-static/actions/workflows/node.js.yml/badge.svg)](https://github.com/Deltares/liwo-static/actions/workflows/node.js.yml)

[![BCH compliance](https://bettercodehub.com/edge/badge/Deltares/liwo-static?branch=master)](https://bettercodehub.com/)

![Docker Cloud Build Status](https://img.shields.io/docker/cloud/build/deltares/liwo-static)

![Website](https://img.shields.io/website?url=https%3A%2F%2Fbasisinformatie-overstromingen.nl)

## Build Setup
See the [docs](https://github.com/vuejs/vue-cli/blob/dev/docs/README.md) of the build environment for further details.

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run serve

# run unit tests
npm run test:unit

# run e2e tests
npm run test:e2e

# security audit
npm audit

# update the version number (displayed in the about page)
npm version patch -m "Upgrade to %s for because ..."

# outdated check
npm outdated

# build using a different url
# Note that this should include a slash at the end
BASE_URL=/ npm run build

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

## Options
The application has an option to overwrite the BASE_URL. This was mainly needed when the application was deployed at [a /liwo](https://basisinformatie-overstromingen.nl/liwo) url. This is not in use at the moment. Old url's that refer to /liwo will get a 301 permanently moved http response to the appropriate url. This is implemented into the nginx configuration.


## Semantic releases
If you specify fixes and features in your commit messages a new [semantic release](https://github.com/semantic-release/semantic-release) will be created, after a merge with master.

## Design
Icon designs are stored under the folder src/img/design. They are stored in svg which can be  edited using illustrator.

## Deployment
Deployment is done through travis based on the gh-pages branch. See the [test server](http://deltares.github.io/liwo-static).
A version per branch is available through [netlify](https://liwo-static.netlify.com)

## Changing the default servers
If you want to change the servers that are used you can adapt the `public/config/webconfig.json` file, this replaces the old `src/webconfig.js`. This file is not minified during build and can be adapted after deployment. This can be done by for example puppet scripts. Note that each release can add or remove servers from the file so the best approach is to alter the file rather than to overwrite it (think `awk` or `file_line` in puppet).  Note that the `LEGEND_URL` should refer to the same server as the `STATIC_GEOSERVER_URL`. The geoserver is expected to be reachable at http://localhost:8080/geoserver/wms to generate legend images.

## Deploy under a different url
If you want to deploy under a different url you can use the environment variable `BASE_URL`, for example by building `BASE_URL=/liwo npm run build`. That is also the default build. You can change the default build in .travis.yml.

## E2E testing
We perform a [set of E2E tests](https://github.com/Deltares/liwo-static/tree/master/tests/e2e/specs) to verify that specific functionality of the application is working correctly. We make a distinction between the following types:
- Long running tests (run once every day)
- UI tests (run on every PR/merge)

The tests are conducted using [Cypress](https://www.cypress.io/) in the following browsers:
- Chrome
- Firefox (some tests are specifically disabled for Firefox, since they do not work in the headless environment)

## Deploy using docker
If you want to deploy the docker version, you can use the Dockerfile in the main directory. It will build the website and add it to a container with an nginx webserver. Make sure you check the nginx.conf settings for details about the security settings.

## Sig review
Create a release with `npm run release` and then run `./sig-deploy.sh` to download the latest zip file to the format liwo-static-yyyymmdd.zip. Upload that file to sig.
