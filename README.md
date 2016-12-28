![labelgun](logo.png)

</br>
Labelgun is a mapping library agnostic labelling engine. The library only makes two assumptions:

* Each label has a bounding rectangle (Min X, Min Y, Max X, Max Y)
* Each label has a weight


### Install
You can install all the necessary dependencies with npm

`npm install`

### Develop

Labelgun is transpiled from ES6 using babel presets for Webpack 2. You can build the source using

`webpack`

or

`webpack --env.minified`

For the minified version.

### Demo

A nice way interactive way to play with the demos is to use the a hot reloading web server such as live-server:

`npm install -g live-server`

`live-server`

## Acknowledgements
Labelgun as an open source project was made possible thanks to [Podaris](http://www.podaris.com).

## License
MIT
