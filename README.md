![labelgun](logo.png)

</br>

## What is Labelgun?
Labelgun is a mapping library agnostic labelling engine. It allows you to avoid cluttering in mapping popups and labels, providing precedence to labels of your choice.

The library makes three assumptions:

* Each label has a bounding rectangle (Min X, Min Y, Max X, Max Y)
* Each label has a weight
* You can provide a function that will hide and show a label (e.g. changing a CSS class or calling a mapping library method)

<p align="center">
    <img alt="Labelgun example in leaflet" src="labelgun.gif">
</p>
<br>

## Using Labelgun

### Use

You can use labelgun in your project via npm such as:

`npm install labelgun --save`

Or if you're using `yarn`:

`yarn add labelgun`

You can also use a auto-generated **CDN** thanks to unpkg :

`https://unpkg.com/labelgun@6.0.0/lib/labelgun.js`

### Docs and Demos

Check out the [docs and demos live here](http://geovation.github.io/labelgun/)

A nice interactive way to play with the demos locally is to use a hot reloading web server such as live-server:

`npm install -g live-server`

`live-server`

## Developing

For instructions please see the [DEVELOPING](https://github.com/geovation/labelgun/blob/master/DEVELOPING.md) document.

## Users

- [Vroom](http://vroom-project.org/) - Vehicle routing optimisation software
- [OL Mapbox Style](https://github.com/boundlessgeo/ol-mapbox-style) - Use Mapbox Style objects with OpenLayers
- [qgis2web](https://github.com/tomchadwin/qgis2web) - A QGIS plugin to export a map to an OpenLayers/Leaflet webmap

Using Labelgun? Open a pull request and let us know!

## Acknowledgements
Labelgun as an open source project was made possible thanks to [Podaris](http://www.podaris.com).

## License
MIT
