console.log("Openlayers3 Example");

SystemJS.config({
    map : {
        rbush : "/../../node_modules/rbush/rbush.js",
        labelgun : "/../../lib/labelgun.js"
    }
});

SystemJS.import('labelgun').then(function(labelgun) {

    var map = new ol.Map({
        layers: [
            new ol.layer.Tile({
                    source: new ol.source.OSM()
            }),
            new ol.layer.Vector({
                title: 'added Layer',
                source: new ol.source.Vector({
                    url: '/examples/geojson/cupcakes.geojson',
                    format: new ol.format.GeoJSON()
                }),
                style: createLabel
            })
        ],
        target: 'map',
        view: new ol.View({
            center: [0, 0],
            zoom: 4
        })
    });


    var hideLabel = function(label){ console.log("hide"); label.labelObject.getImage().setOpacity(0);} 
    var showLabel = function(label){ console.log("show");  label.labelObject.getImage().setOpacity(1);}
    labelEngine = new labelgun.default(hideLabel, showLabel);

    var ghostZoom = map.getView().getZoom();

    map.getView().on('change:resolution',function(){
        console.log("moveend")
        if (ghostZoom != map.getView().getZoom()) {
            ghostZoom = map.getView().getZoom();

            console.log("end of zoom")
            labels.forEach(function(label, i){
                //console.log(label.iconStyle);
                var boundingBox = getBoundingBox(label.center, label.width);
                console.log(boundingBox);
                labelEngine.ingestLabel(
                    boundingBox,
                    i,
                    parseInt(Math.random() * (5 - 1) + 1), // Weight
                    label.iconStyle,
                    label.text,
                    false
                );

            });
            labelEngine.update();
            labels = [];
        }
    });

    var labels = [];

    function getTextWidth (text, fontStyle) {

        var canvas = undefined,
            context = undefined,
            metrics = undefined;

        canvas = document.createElement( "canvas" )

        context = canvas.getContext( "2d" );

        context.font = fontStyle;
        metrics = context.measureText( text );

        return metrics.width;

    }

    function createLabel(geojsonFeature){

        var text = geojsonFeature.get("name");
        var center = geojsonFeature.getGeometry().getCoordinates();
        var labelFontStyle = "Normal 12px Arial";
        var labelWidth = getTextWidth(text, labelFontStyle);
        labelWidth = labelWidth + 10;

        var iconSVG = '<svg ' +
                    'version="1.1" xmlns="http://www.w3.org/2000/svg" ' +
                    'x="0px" y="0px" width="' + labelWidth + 'px" height="16px" ' +
                    'viewBox="0 0 ' + labelWidth + ' 16" enable-background="new 0 0 ' + labelWidth + ' 16" >'+
                        '<g>' +
                        '<rect x="0" y="0" width="' + labelWidth + '" height="16" stroke="#000000" fill="#DEEFAE" stroke-width="2"></rect>' +
                        '<text x="5" y="13" fill="#000000" font-family="Arial" font-size="12" font-weight="normal">' + text + '</text>' +
                        '</g>' +
                    '</svg>';
                    
       var src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent( iconSVG );

        var iconStyle = new ol.style.Style({
            "image": new ol.style.Icon({
                src : src,
                "imgSize":[labelWidth, 66],
                "anchor": [0.5, 0.5],
                "offset": [0, -50]
            })
        });

        labels.push({center: center, width: labelWidth, iconStyle: iconStyle, text: text});


        return iconStyle

    };

    function getBoundingBox(center, labelWidth) {

        var halfLabelWidth = labelWidth / 2;
        var halfFontSize = 12 / 2;
        var pixelCenter = map.getPixelFromCoordinate(center);

        var bottomLeft =  map.getCoordinateFromPixel([pixelCenter[0] - halfLabelWidth, pixelCenter[1] - halfFontSize]);
        var topRight =  map.getCoordinateFromPixel([pixelCenter[0] + halfLabelWidth, pixelCenter[1] + halfFontSize]);

        console.log(bottomLeft, topRight);

        return boundingBox =  {
            bottomLeft :  bottomLeft,
            topRight : topRight
        };
    }

});