![labelgun](logo.png)

</br>
Labelgun is a mapping library agnostic labelling engine. It allows you to avoid cluttering in mapping popups and labels, providing precedence to labels of your choice.

The library makes three assumptions:

* Each label has a bounding rectangle (Min X, Min Y, Max X, Max Y)
* Each label has a weight
* You can provide a function that will hide and show a label (e.g. through CSS class or JavaScript function)

<br><br>
![Labelgun example in leaflet](labelgun.gif)

## Using Labelgun

### Use

You can use labelgun in your project via npm such as:

`npm install labelgun --save`

Or if you're using `yarn`:

`yarn add labelgun`

You can also use a auto-generated CDN thanks to unpkg :

`https://unpkg.com/labelgun@5.0.1/lib/labelgun.js`

### Docs and Demos

Check out the [docs and demos live here](http://tech.geovation.uk/labelgun/)

A nice interactive way to play with the demos locally is to use a hot reloading web server such as live-server:

`npm install -g live-server`

`live-server`

## Develop

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

## Users

- [Vroom](http://vroom-project.org/) - Vehicle routing optimisation software
- [OL Mapbox Style](https://github.com/boundlessgeo/ol-mapbox-style) - Use Mapbox Style objects with OpenLayers

Using Labelgun? Open a pull request and let us know!

## Acknowledgements
Labelgun as an open source project was made possible thanks to [Podaris](http://www.podaris.com).

## License
MIT
