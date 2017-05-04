      console.log("Leaflet Example");

      var BENCHMARKING = true;
      var totalTime = 0;
      var totalMarkers;
      var labelEngine;

      // Leaflet map
      var map = L.map('map').setView([0, 0], 6);
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Labelgun!
      var hideLabel = function(label){ label.labelObject.style.opacity = 0;};
      var showLabel = function(label){ label.labelObject.style.opacity = 1;};
      labelEngine = new labelgun.default(hideLabel, showLabel);

      var id = 0;
      var labels = [];
      var totalMarkers = 0;

      var markers = L.geoJSON(geojson, {
        onEachFeature : function(feature, label) {
          label.bindTooltip("Test " + totalMarkers, {permanent: true});
          labels.push(label);
          totalMarkers += 1;
        }
      });

      var i = 0;
      markers.eachLayer(function(label){
        label.added = true;
        addLabel(label, i);
        i++;
      });

      markers.addTo(map);

      map.on("zoomend", function(){
        if (BENCHMARKING) benchmarkResetLabels(markers);
        else resetLabels(markers);
      });
      map.fitBounds(markers.getBounds());

      if(BENCHMARKING) benchmark();

      var cover = document.getElementById("cover");
      cover.parentNode.removeChild(cover);
      resetLabels(markers);

      function resetLabels(markers) {

        labelEngine.destroy();
        var i = 0;
        markers.eachLayer(function(label){
          addLabel(label, i);
          i++;
        });
        labelEngine.update();

      }


      function addLabel(layer, id) {

        var label = layer.getTooltip()._source._tooltip._container;
        if (label) {

          var rect = label.getBoundingClientRect();

          var bottomLeft = map.containerPointToLatLng([rect.left, rect.bottom]);
          var topRight = map.containerPointToLatLng([rect.right, rect.top]);
          var boundingBox = {
              bottomLeft : [bottomLeft.lng, bottomLeft.lat],
              topRight   : [topRight.lng, topRight.lat]
          };

          labelEngine.ingestLabel(
            boundingBox,
            id,
            parseInt(Math.random() * (5 - 1) + 1), // Weight
            label,
            "Test " + id,
            false
          )

          if (!layer.added) {
            layer.addTo(map);
            layer.added = true;
          }

        }

      }


      // BENCHMARK FUNCTIONS:

      function benchmarkResetLabels(markers) {

        var start = performance.now();
        labelEngine.destroy();
        var i = 0;
        markers.eachLayer(function(label){
          addLabel(label, i);
          i++;
        ;});
        labelEngine.update();
        var fin = performance.now();
        totalTime += fin - start;

      }

      function benchmark() {
        var n = 100;
        for (var i=0; i <= n; i++) {
          if (i % 2 === 0) map.zoomIn()
          else map.zoomOut();
        }
        console.log("Average time to hide/show " + totalMarkers + " labels : ", (100 * totalTime/n).toFixed(2) + "ms");
      }
