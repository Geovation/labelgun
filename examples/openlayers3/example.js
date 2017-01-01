console.log("Openlayers3 Example");

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
        zoom: 2
    })
});

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
    console.log("Created");
    
    var text = geojsonFeature.get("name")
    var labelFontStyle = "Normal 12px Arial";
    var labelWidth = getTextWidth(text, labelFontStyle);
    labelWidth = labelWidth + 10;

    var iconSVG = '<svg ' +
                'version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ' +
                'x="0px" y="0px" width="' + labelWidth + 'px" height="16px" ' +
                'viewBox="0 0 ' + labelWidth + ' 16" enable-background="new 0 0 ' + labelWidth + ' 16" xml:space="preserve">'+
                    '<rect x="0" y="0" width="' + labelWidth + '" height="16" stroke="#000000" fill="#DEEFAE" stroke-width="2"></rect>' +
                    '<text x="5" y="13" fill="#000000" font-family="Arial" font-size="12" font-weight="normal">' + text + '</text>' +
            '</svg>';

    var imageElement = new Image();
    imageElement.src = 'data:image/svg+xml,' + escape( iconSVG );

    var iconStyle = new ol.style.Style({
        "image": new ol.style.Icon({
            "img": imageElement,
            "imgSize":[labelWidth, 66],
            "anchor": [0.5, 0.5],
            "offset": [0, -50]
        })
    });

    return iconStyle

};

function getBoundingBox(feature) {

    var blX = 0;
    var blY = 0;
    var trX = 0;
    var trY = 0;

    return boundingBox =  {
        bottomLeft : map.getCoordinateFromPixel([blX, blY]),
        topRight : map.getCoordinateFromPixel([trX, trY])
     };
}