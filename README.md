![labelgun](logo.png)

</br>
Labelgun is a mapping library agnostic labelling engine. It allows you to avoid cluttering in mapping popups and labels, providing precedence to labels of your choice.

The library makes three assumptions:

* Each label has a bounding rectangle (Min X, Min Y, Max X, Max Y)
* Each label has a weight
* You can provide a function that will hide and show a label (e.g. through CSS class or JavaScript function)

## Using Labelgun

### Use

You can use labelgun in your project via npm such as:

`npm install labelgun --save`

You can also use a auto-generated CDN thanks to unpkg :

`https://unpkg.com/labelgun@0.1.1/lib/labelgun.js`

### Demo

A nice interactive way to play with the demos is to use a hot reloading web server such as live-server:

`npm install -g live-server`

`live-server`

## Develop

### Building

We can install all the required dependencies using node+npm:

`npm install`

Labelgun is transpiled from ES6 using babel presets for Webpack 2. You can build the source using:

`webpack`

or:

`webpack --env.minified`

For the minified version.

### Test

Labelgun uses Jasmine for testing. You can do an npm install and then use:

`jasmine`

at the command line. Tests are found in the `spec` folder  

### GitHub Pages & NPM

GitHub pages deployment:

`git subtree push --prefix examples origin gh-pages`

NPM updating:

`npm publish`

## Acknowledgements
Labelgun as an open source project was made possible thanks to [Podaris](http://www.podaris.com).

## License
MIT
