/* eslint-disable */

console.log("Leaflet Example");

var totalTime = 0;
var totalMarkers;
var labelEngine;

// Leaflet map
var map = L.map("map").setView([0, 0], 6);
L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
  attribution: "&copy; <a href=\"http://osm.org/copyright\">OpenStreetMap</a> contributors"
}).addTo(map);

// Labelgun!

// This is core of how Labelgun works. We must provide two functions, one
// that hides our labels, another that shows the labels. These are essentially
// callbacks that labelgun uses to actually show and hide our labels
// In this instance we set the labels opacity to 0 and 1 respectively. 
var hideLabel = function(label){ label.labelObject.style.opacity = 0;};
var showLabel = function(label){ label.labelObject.style.opacity = 1;};
labelEngine = new labelgun.default(hideLabel, showLabel);

var id = 0;
var labels = [];
var totalMarkers = 0;

// Add the markers to the map
var markers = L.geoJSON(geojson, {
  onEachFeature : function(feature, label) {
    label.bindTooltip("Test " + totalMarkers, {permanent: true});
    labels.push(label);
    totalMarkers += 1;
  }
});

// For each marker lets add a label
var i = 0;
markers.eachLayer(function(label){
  label.added = true;
  addLabel(label, i);
  i++;
});

markers.addTo(map);

map.on("zoomend", function(){
  resetLabels(markers);
});
map.fitBounds(markers.getBounds());

var cover = document.getElementById("cover");
cover.parentNode.removeChild(cover);
resetLabels(markers);

function resetLabels(markers) {

  labelEngine.destroy();
  var i = 0;
  markers.eachLayer(function(label){
    addLabel(label, ++i);
  });
  labelEngine.update();

}

function addLabel(layer, id) {

  // This is ugly but there is no getContainer method on the tooltip :(
  var label = layer.getTooltip()._source._tooltip._container;
  if (label) {

    // We need the bounding rectangle of the label itself
    var rect = label.getBoundingClientRect();

    // We convert teh container coordinates (screen space) to Lat/lng
    var bottomLeft = map.containerPointToLatLng([rect.left, rect.bottom]);
    var topRight = map.containerPointToLatLng([rect.right, rect.top]);
    var boundingBox = {
      bottomLeft : [bottomLeft.lng, bottomLeft.lat],
      topRight   : [topRight.lng, topRight.lat]
    };

    // Ingest the label into labelgun itself
    labelEngine.ingestLabel(
      boundingBox,
      id,
      parseInt(Math.random() * (5 - 1) + 1), // Weight
      label,
      "Test " + id,
      false
    );

    // If the label hasn't been added to the map already
    // add it and set the added flag to true
    if (!layer.added) {
      layer.addTo(map);
      layer.added = true;
    }

  }

}
