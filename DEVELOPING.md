# Developing

This document explains how to build and test Labelgun locally.

### Building

We can install all the required dependencies using node and npm:

`npm install`

Labelgun is transpiled from ES6 using babel presets for Webpack 2. You can build the source using:

`npm run build`

or:

`npm run build-prod`

For the minified version. You can also watch the file with:

`npm run watch`


### Tests

Labelgun uses Jasmine for testing. You can do an npm install and then use:

`npm run test`

at the command line. Tests are found in the `spec` folder. We can also run test coverage as so:

`npm run coverage`

### GitHub Pages & NPM

GitHub pages documentation deployment:

`npm deploy-doc`

NPM updating:

`npm publish`
