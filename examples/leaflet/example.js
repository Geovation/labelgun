      console.log("Leaflet Exampe");

      var BENCHMARKING = true;
      var totalTime = 0;
      var totalMarkers;

      // Confiure location of necessary modules
      SystemJS.config({
        map : {
          rbush : "/../../node_modules/rbush/rbush.js",
          fetch : "/../../node_modules/whatwg-fetch/fetch.js",
          labelgun : "/../../lib/labelgun.js"
        }
      });

      SystemJS.import('fetch');
      SystemJS.import('labelgun').then(function(labelgun) {

        // Leaflet map
        var map = L.map('map').setView([0, 0], 6);
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Labelgun!
        var hideLabel = function(label){ label.labelObject.style.opacity = 0;};
        var showLabel = function(label){ label.labelObject.style.opacity = 1;};
        var labelEngine = new labelgun.default(hideLabel, showLabel);

        var id = 0;
        fetch("../geojson/cupcakes.geojson")
          .then(function(response){ return response.json()})
          .then(function(geojson){
            var labels = [];
            var markers = L.geoJSON(geojson, {
              onEachFeature : function(feature, label) {
                label.bindTooltip("Test ", {permanent: true});
                labels.push(label);
              }
            })
            var totalMarkers = 0;

            markers.eachLayer(function(label){
              label.added = true;
              addLabel(label);
              totalMarkers += 1;
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

        });

        function resetLabels(markers) {
    
          labelEngine.destroy();
          markers.eachLayer(function(label){
            addLabel(label)
          ;});
          labelEngine.update();

        }


        function addLabel(layer) {
            
          var label = layer.getTooltip()._source._tooltip._container;
          if (label) {
          
            var rect = label.getBoundingClientRect();

            var bottomLeft = map.containerPointToLatLng([rect.left, rect.bottom]);
            var topRight = map.containerPointToLatLng([rect.right, rect.top]);
            var boundingBox = {
                bottomLeft : [bottomLeft.lng, bottomLeft.lat],
                topRight   : [topRight.lng, topRight.lat]
            };

            id++;

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
          markers.eachLayer(function(label){
            addLabel(label)
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


      });
