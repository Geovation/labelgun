
    
    var vectorPoints = new ol.layer.Vector({
        source: new ol.source.Vector({
            url: "https://openlayers.org/en/v4.3.3/examples/data/geojson/point-samples.geojson",
            format: new ol.format.GeoJSON()
        }),
        style: pointStyleFunction
    });

// Create the map 
    var map = new ol.Map({
        layers: [
            new ol.layer.Tile({
            source: new ol.source.OSM()
            }),
            vectorPoints
        ],
        target: "map",
        view: new ol.View({
            center: [-8351939, 6100000],
            zoom: 6
        })
    });

    var labelEngine = new labelgun["default"](
        function(label){
            label.labelObject.hide = true;
        }, 
        function(label){
            label.labelObject.hide = false;
        }
    );


    var createTextStyle = function(feature, resolution) {
        console.log(feature.hide);

        if (feature.hide) {
            return new ol.style.Text(); 
        } 

        var font = "normal 12px Arial";

        var textStyle = new ol.style.Text({
            textAlign: "center",
            textBaseline: "middle",
            font: font,
            text: feature.get("name"),
            fill: new ol.style.Fill({color: "#aa3300"}),
            stroke: new ol.style.Stroke({color: "#ffffff", width: 3}),
            offsetX: 0,
            offsetY: 0,
            rotation: 0
        });

        return textStyle;
    };

    // Points
    function pointStyleFunction(feature, resolution) {
        return new ol.style.Style({
            image: new ol.style.Circle({
            radius: 10,
            fill: new ol.style.Fill({color: "rgba(255, 0, 0, 0.1)"}),
            stroke: new ol.style.Stroke({color: "red", width: 1})
            }),
            text: createTextStyle(feature, resolution)
        });
    }

    function update() {
        
        var features = vectorPoints.getSource().getFeatures();
        features.forEach(function(feature){

            // Get the label text as a string
            var text = feature.get("name");

            // Get the center point in pixel space
            var center = ol.extent.getCenter(feature.getGeometry().getExtent());
            var pixelCenter = map.getPixelFromCoordinate(center);

            var size = 12;
            var halfText = (size + 1) * (text.length / 4);

            // Create a bounding box for the label using known pixel heights
            var minx = parseInt(pixelCenter[0] - halfText);
            var maxx = parseInt(pixelCenter[0] + halfText);
            
            var maxy = parseInt(pixelCenter[1] - (size / 2));
            var miny = parseInt(pixelCenter[1] + (size / 2));

            // Get bounding box points back into coordinate space
            var min = map.getCoordinateFromPixel([minx, miny]);
            var max = map.getCoordinateFromPixel([maxx, maxy]);
            
            // Create the bounds
            var bounds = {
                bottomLeft: min,
                topRight: max
            };
            // Weight longer labels higher, use their name as the ID
            labelEngine.ingestLabel(bounds, text, text.length, feature)

        });

        // Call the label callbacks for showing and hiding
        labelEngine.update();

    }

    // On end of zoom handle all the labels
    vectorPoints.on("postcompose", update);

    // Update on the first load
    var listenerKey = vectorPoints.on('change', function(e) {
        update();
        ol.Observable.unByKey(listenerKey);   
    });