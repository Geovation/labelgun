
/* eslint-disable */

console.log("Openlayers4 Example");

var labelCache = {}; // We can save cycles by caching the labels!
var labelHeight = 22;
var labelFontSize = 14;
var labelFontStyle = "Normal "+labelFontSize+"px Arial";
var labelEngine = new labelgun.default(hideLabel, showLabel);

var formatGeojson = new ol.format.GeoJSON();
var featuresGeojson = formatGeojson.readFeatures(geojson, {
  dataProjection: "EPSG:4326", featureProjection: "EPSG:3857"
}); 
var sourceGeojson = new ol.source.Vector();
sourceGeojson.addFeatures(featuresGeojson);

var cupcakesLayer = new ol.layer.Vector({
  title: "added Layer",
  source: sourceGeojson,
  style: createLabel
});

var map = new ol.Map({
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    }),
    cupcakesLayer
  ],
  target: "map",
  view: new ol.View({
    center: ol.proj.transform([-122.676201, 45.523375], "EPSG:4326", "EPSG:3857"),
    zoom: 9
  })
});

var marker = new ol.style.Style({
  image: new ol.style.Icon({
    anchor: [0.5, 0.5],
    opacity: 0.9,
    src: "marker.png"
  })
});

// I wish there was a cleaner way to do this, and it still isn't perfect?
var styleFunction = cupcakesLayer.getStyle();
cupcakesLayer.on("postcompose", function() {
  var labels = [];
  sourceGeojson.forEachFeature(function(feature){
    var label = getLabel(feature);
    label.iconStyle = styleFunction(feature)[1]; // Not marker, the actual style!
    labels.push(label);
  });

  updateLabels(labels);
});

function hideLabel(label) {
  console.log("hideLabel", label);
  label.labelObject.getImage().setOpacity(0.0);
}

function showLabel(label) {
  console.log("showLabel", label);
  label.labelObject.getImage().setOpacity(1);
}

function updateLabels(labels) {

  if (Object.keys(labelEngine.allLabels).length > 0) {
    labelEngine.destroy();
  }
  labels.forEach(function(label, i) {
    var boundingBox = getBoundingBox(label.center, label.width);
    labelEngine.ingestLabel(
      boundingBox,
      i,
      1, // Weight
      label.iconStyle, // LabelObject
      label.text,
      false
    );
  });

  labelEngine.update();

}

function getTextWidth (text, fontStyle) {

  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  context.font = fontStyle;
  var metrics = context.measureText(text);

  return metrics.width;

}

function createLabel(geojsonFeature){

  var text = geojsonFeature.get("name");
  var id = geojsonFeature.ol_uid; // Something unique!

  var center = geojsonFeature.getGeometry().getCoordinates();
  var xPadding = 10;
  var labelWidth = getTextWidth(text, labelFontStyle) + xPadding;
  var fillColor = "rgba(255, 255, 255, 0.85)";
  var iconSVG = "<svg " +
                        "version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" " +
                        "x=\"0px\" y=\"0px\" width=\"" + labelWidth + "px\" height=\""+labelHeight+"px\" " +
                        "viewBox=\"0 0 " + labelWidth + " "+labelHeight+"\" " +
                        "enable-background=\"new 0 0 " + labelWidth + " "+labelHeight+"\" >"+
                        "<g>" +
                        "<rect x=\"0\" y=\"0\" width=\"" + labelWidth + "\" height=\""+labelHeight+"\" stroke=\"#000000\" fill=\"" + fillColor + "\" stroke-width=\"2\"></rect>" +
                        "<text x=\"5\" y=\"14\" fill=\"#000000\" font-family=\"Arial\" font-size=\""+labelFontSize+"\" font-weight=\"normal\">" +
                            _.escape(text) +  // We need to escape all the special characters like & etc
                        "</text>" +
                        "</g>" +
                    "</svg>";

  var svgURI = encodeURIComponent(iconSVG);
  var src = "data:image/svg+xml;charset=utf-8," + svgURI;
  var iconStyle;

  // Use the label cache if we can
  if (labelCache[id]) {
    iconStyle = labelCache[id];
  } else {
    iconStyle = new ol.style.Style({
      "image": new ol.style.Icon({
        src : src,
        "imgSize":[labelWidth, 16],
        "anchor": [0.5, 0.5],
        "offset": [0, 0]
      }),
      "zIndex": 1000
    });

    labelCache[id] = iconStyle;
  }

  return [marker, iconStyle];

}

function getLabel(geojsonFeature) {
  var text = geojsonFeature.get("name");
  var center = geojsonFeature.getGeometry().getCoordinates();
  var xPadding = 10;
  var labelWidth = getTextWidth(text, labelFontStyle) + xPadding;
  var label = {center: center, width: labelWidth, iconStyle: null, text: text};
  return label;
}

function getBoundingBox(center, labelWidth) {

  var pixelCenter = map.getPixelFromCoordinate(center);
  //console.log(pixelCenter);
  var buffer = 1;
  // XY starts from the top right corner of the screen
  var bl = [pixelCenter[0] - labelWidth + buffer, pixelCenter[1] + labelHeight + buffer] ;
  var tr = [pixelCenter[0] + labelWidth + buffer, pixelCenter[1] - labelHeight + buffer];

  var bottomLeft =  map.getCoordinateFromPixel(bl);
  var topRight =  map.getCoordinateFromPixel(tr);
  //console.log(bottomLeft, topRight);

  return {
    bottomLeft :  bottomLeft,
    topRight : topRight
  };
}